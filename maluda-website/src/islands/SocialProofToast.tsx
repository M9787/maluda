import { useEffect, useRef, useState } from "react";

export interface SocialProofEntry {
  name: string;
  city?: string;
  course?: string;
  minutesAgo: number;
}

interface Props {
  entries?: SocialProofEntry[];
}

const SESSION_KEY = "maluda-social-proof-dismissed";

export default function SocialProofToast({ entries }: Props) {
  const [active, setActive] = useState<SocialProofEntry | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!Array.isArray(entries) || entries.length === 0) return;
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setDismissed(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let index = 0;

    const fire = () => {
      const form = document.getElementById("register");
      if (form) {
        const rect = form.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          schedule();
          return;
        }
      }
      setActive(entries[index % entries.length]);
      index++;
      hideRef.current = setTimeout(() => setActive(null), 5200);
      schedule();
    };

    const schedule = () => {
      const delay = 35_000 + Math.floor(Math.random() * 20_000);
      timerRef.current = setTimeout(fire, delay);
    };

    timerRef.current = setTimeout(fire, 12_000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (hideRef.current) clearTimeout(hideRef.current);
    };
  }, [entries]);

  const handleDismiss = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setDismissed(true);
    setActive(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (hideRef.current) clearTimeout(hideRef.current);
  };

  if (dismissed || !active) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="social-proof-toast"
      style={{
        position: "fixed",
        left: "0.5rem",
        bottom: "1rem",
        zIndex: 55,
        right: "0.5rem",
        maxWidth: "min(20rem, calc(100vw - 1rem))",
        background: "rgba(255, 255, 255, 0.97)",
        border: "1px solid rgba(4, 22, 39, 0.08)",
        borderRadius: "0.75rem",
        padding: "0.75rem 0.875rem",
        boxShadow: "0 8px 30px rgba(4, 22, 39, 0.08), 0 20px 60px rgba(4, 22, 39, 0.06)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        animation: "social-proof-in 360ms ease-out",
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #62fae3, #006b5f)",
          color: "#00201c",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "0.8125rem",
          flexShrink: 0,
        }}
      >
        {active.name.charAt(0)}
      </div>
      <div style={{ flex: 1, minWidth: 0, lineHeight: 1.35 }}>
        <p style={{ margin: 0, fontSize: "0.8125rem", color: "var(--color-text-primary)" }}>
          <strong>{active.name}</strong>
          {active.city ? <> из <strong>{active.city}</strong></> : null} записал
          {active.name.endsWith("а") || active.name.endsWith("я") ? "ась" : "ся"}{" "}
          {active.minutesAgo} мин назад
        </p>
        {active.course && (
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.6875rem",
              color: "var(--color-accent-secondary)",
              fontWeight: 600,
            }}
          >
            {active.course}
          </p>
        )}
      </div>
      <button
        onClick={handleDismiss}
        aria-label="Скрыть уведомление"
        style={{
          background: "transparent",
          border: 0,
          color: "rgba(68, 71, 76, 0.5)",
          fontSize: "1.125rem",
          lineHeight: 1,
          minWidth: 32,
          minHeight: 32,
          cursor: "pointer",
        }}
      >
        ×
      </button>
    </div>
  );
}
