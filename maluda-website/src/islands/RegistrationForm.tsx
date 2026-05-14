import { useRef, useState } from "react";
import { registrationSchema } from "../lib/validation";

const courseOptions = [
  { value: "python-sql", label: "Python + SQL" },
  { value: "data-analysis", label: "Data Analysis" },
  { value: "devops-cloud", label: "DevOps & Cloud" },
  { value: "vibe-coding", label: "Vibe Coding & AI" },
  { value: "claude-code", label: "Claude Code: Автоматизация" },
  { value: "not-sure", label: "Пока не знаю" },
];

const sourceOptions = [
  { value: "", label: "Выбери..." },
  { value: "friend", label: "Друг / знакомый" },
  { value: "ambassador", label: "Амбассадор" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "event", label: "Мероприятие" },
  { value: "other", label: "Другое" },
];

const spotsMessages = [
  "Группа не больше 8 человек — мы держим обещание",
  "Первое мероприятие — бесплатно, без обязательств",
  "Уже несколько человек зарегистрировались сегодня",
];

// Rotates the urgency line each hour for subtle freshness on repeat visits.
// Computed once at module load (client-only — island hydrates on visibility).
const SPOT_MESSAGE_INDEX = Math.floor(Date.now() / 3_600_000) % spotsMessages.length;

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "+995",
    courseInterest: "not-sure",
    source: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const inFlightRef = useRef(false);
  const submitting = status === "submitting";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inFlightRef.current) return;
    setErrors({});

    const result = registrationSchema.safeParse({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      courseInterest: formData.courseInterest,
      source: formData.source || undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });
      setErrors(fieldErrors);
      const firstError = document.querySelector('[data-form-error]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    inFlightRef.current = true;
    setStatus("submitting");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: formData.website }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    } finally {
      inFlightRef.current = false;
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-4" role="status" aria-live="polite">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,107,95,0.1)" }}>
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "var(--color-accent-secondary)" }} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Manrope', sans-serif" }}>Готово! Место забронировано.</h3>
        <p className="text-sm mb-1" style={{ color: "var(--color-text-secondary)" }}>
          Мы свяжемся с тобой в ближайшее время через Telegram или email.
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--color-accent-secondary)" }}>
          Следи за обновлениями в <a href="https://t.me/maluda_batumi" target="_blank" rel="noopener noreferrer" className="underline">нашем Telegram</a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* Honeypot: hidden field — real users leave empty, bots fill it. */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: "1px", height: "1px", overflow: "hidden" }}>
        <label htmlFor="register-website">Website (не заполнять)</label>
        <input
          id="register-website"
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={formData.website}
          onChange={handleChange}
        />
      </div>

      <div className="flex items-center gap-2 text-xs py-2.5 px-3 rounded-lg" style={{ background: "rgba(0,107,95,0.06)", border: "1px solid rgba(0,107,95,0.15)" }}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#006b5f", animation: "urgency-pulse 1.5s ease-in-out infinite" }} aria-hidden="true"></span>
        <span style={{ color: "var(--color-accent-secondary)" }} className="font-medium">
          {spotsMessages[SPOT_MESSAGE_INDEX]}
        </span>
      </div>

      <fieldset disabled={submitting} className="space-y-5 disabled:opacity-70" style={{ border: 0, padding: 0, margin: 0 }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="register-fullName" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Имя и фамилия <span style={{ color: "#dc2626" }} aria-hidden="true">*</span>
            </label>
            <input
              id="register-fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Иван Иванов"
              className="input-field"
              required
              autoComplete="name"
              aria-required="true"
              aria-invalid={errors.fullName ? "true" : "false"}
              aria-describedby={errors.fullName ? "register-fullName-error" : undefined}
            />
            {errors.fullName && (
              <p id="register-fullName-error" className="text-xs mt-1 font-medium" style={{ color: "#dc2626" }} data-form-error>
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-email" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-text-primary)" }}>
              Email <span style={{ color: "#dc2626" }} aria-hidden="true">*</span>
            </label>
            <input
              id="register-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@example.com"
              className="input-field"
              required
              autoComplete="email"
              inputMode="email"
              aria-required="true"
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby={errors.email ? "register-email-error" : "register-email-privacy"}
            />
            {errors.email ? (
              <p id="register-email-error" className="text-xs mt-1 font-medium" style={{ color: "#dc2626" }} data-form-error>
                {errors.email}
              </p>
            ) : (
              <p id="register-email-privacy" className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
                <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Твои данные защищены. Мы не делимся контактами.
              </p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="register-phone" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-text-primary)" }}>
            Телефон (WhatsApp / Telegram) <span style={{ color: "#dc2626" }} aria-hidden="true">*</span>
          </label>
          <input
            id="register-phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+995 555 123 456"
            className="input-field"
            required
            autoComplete="tel"
            inputMode="tel"
            aria-required="true"
            aria-invalid={errors.phone ? "true" : "false"}
            aria-describedby={errors.phone ? "register-phone-error" : "register-phone-hint"}
          />
          {errors.phone ? (
            <p id="register-phone-error" className="text-xs mt-1 font-medium" style={{ color: "#dc2626" }} data-form-error>
              {errors.phone}
            </p>
          ) : (
            <p id="register-phone-hint" className="text-xs mt-1.5" style={{ color: "var(--color-text-secondary)" }}>
              Подойдёт WhatsApp или Telegram — напишем туда, куда удобно.
            </p>
          )}
        </div>

        <fieldset>
          <legend className="block text-sm font-semibold mb-2" style={{ color: "var(--color-text-primary)" }}>
            Какой курс интересует? <span style={{ color: "var(--color-text-secondary)" }} className="font-normal">(необязательно)</span>
          </legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="radiogroup" aria-label="Курс">
            {courseOptions.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center justify-center px-3 py-3.5 rounded-lg border cursor-pointer transition-all text-sm text-center leading-tight"
                style={
                  formData.courseInterest === opt.value
                    ? {
                        borderColor: "var(--color-accent-secondary)",
                        background: "rgba(0,107,95,0.08)",
                        color: "var(--color-accent-secondary)",
                        fontWeight: 600,
                      }
                    : {
                        borderColor: "rgba(4,22,39,0.12)",
                        background: "rgba(255,255,255,0.7)",
                        color: "var(--color-text-secondary)",
                      }
                }
              >
                <input
                  type="radio"
                  name="courseInterest"
                  value={opt.value}
                  checked={formData.courseInterest === opt.value}
                  onChange={handleChange}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="register-source" className="block text-sm font-semibold mb-1.5" style={{ color: "var(--color-text-primary)" }}>
            Как ты до нас дошёл? <span style={{ color: "var(--color-text-secondary)" }} className="font-normal">(помогает нам расти)</span>
          </label>
          <select
            id="register-source"
            name="source"
            value={formData.source}
            onChange={handleChange}
            className="input-field"
          >
            {sourceOptions.map((opt) => (
              <option key={opt.value} value={opt.value} style={{ background: "var(--color-bg-primary)" }}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="btn-glow w-full py-4 text-base font-bold"
          style={{ fontSize: "1rem", minHeight: 48 }}
        >
          {submitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Отправка...
            </span>
          ) : (
            "Забронировать бесплатное место →"
          )}
        </button>
      </fieldset>

      <div className="flex items-center justify-center gap-4 text-xs flex-wrap" style={{ color: "var(--color-text-secondary)" }}>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Один email в неделю
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Без обязательств
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          30 секунд
        </span>
      </div>

      {status === "error" && (
        <div role="alert" className="text-center p-3 rounded-lg text-sm" style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.2)", color: "#dc2626" }}>
          Что-то пошло не так. Попробуй ещё раз или{" "}
          <a href="https://t.me/maluda_batumi" target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            напиши нам в Telegram
          </a>
          .
        </div>
      )}
    </form>
  );
}
