import type { APIRoute } from 'astro';
import { db, Registrations } from 'astro:db';
import { registrationSchema } from '../../lib/validation';

export const prerender = false;

type Bucket = { count: number; reset: number };
const rateBuckets = new Map<string, Bucket>();
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 60_000;

function getClientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();
  return 'anonymous';
}

function isOriginAllowed(request: Request, site: URL | undefined): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return true;
  try {
    const o = new URL(origin);
    const reqUrl = new URL(request.url);
    if (o.host === reqUrl.host) return true;
    if (site && o.host === site.host) return true;
    return false;
  } catch {
    return false;
  }
}

interface PostSignupPayload {
  fullName: string;
  email: string;
  phone: string;
  courseInterest: string;
}

async function notifyPostSignup(_payload: PostSignupPayload): Promise<void> {
  // TODO(maluda): wire each branch when env vars are configured.
  //
  // 1. Confirmation email (Resend / Postmark / SES):
  //    if (process.env.RESEND_API_KEY) { await resend.emails.send({...}); }
  //
  // 2. .ics calendar invite for the masterclass event — generate inline and
  //    attach to the email above. Use the Events row eventDate as DTSTART.
  //
  // 3. Telegram cohort group invite (bot DM with one-time invite link):
  //    if (process.env.TELEGRAM_BOT_TOKEN) {
  //      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {...});
  //    }
  //
  // 4. Schedule a 24h-before reminder (Trigger.dev / Vercel cron / DB queue).
  //
  // Keeping this stub no-op means production won't break on missing keys,
  // and every real registration still lands in the DB for manual follow-up.
}

export const POST: APIRoute = async ({ request, site, clientAddress }) => {
  try {
    if (!isOriginAllowed(request, site)) {
      return new Response(JSON.stringify({ error: 'Forbidden origin' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ip = clientAddress || getClientIp(request);
    const now = Date.now();
    const bucket = rateBuckets.get(ip);
    if (!bucket || bucket.reset < now) {
      rateBuckets.set(ip, { count: 1, reset: now + RATE_WINDOW_MS });
    } else if (bucket.count >= RATE_LIMIT) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    } else {
      bucket.count++;
    }

    if (rateBuckets.size > 2000) {
      for (const [k, v] of rateBuckets) {
        if (v.reset < now) rateBuckets.delete(k);
      }
    }

    const body = await request.json();

    if (typeof body?.website === 'string' && body.website.trim().length > 0) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = registrationSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({ error: 'Validation failed', issues: result.error.issues }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await db.insert(Registrations).values({
      fullName: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone,
      courseInterest: result.data.courseInterest,
      source: result.data.source || null,
      registrationType: 'general',
      status: 'new',
      createdAt: new Date(),
    });

    // Post-signup automation hook. Fire-and-forget so the user's response
    // isn't blocked on third-party latency. Each integration is a no-op until
    // the corresponding env vars are configured (TELEGRAM_BOT_TOKEN,
    // RESEND_API_KEY, etc.) — see deployment docs.
    void notifyPostSignup({
      fullName: result.data.fullName,
      email: result.data.email,
      phone: result.data.phone,
      courseInterest: result.data.courseInterest,
    }).catch((err) => console.error('post-signup notify failed', err));

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
