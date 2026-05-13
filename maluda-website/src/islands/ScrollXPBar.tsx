import { useEffect, useState } from "react";
import { useStore } from "@nanostores/react";
import { xpAtom } from "../lib/store";

const MAX_XP = 1000;

const milestones = [
  { xp: 100, label: "Исследователь" },
  { xp: 300, label: "Любознательный" },
  { xp: 500, label: "Продвинутый" },
  { xp: 750, label: "Эксперт" },
  { xp: 1000, label: "Мастер" },
];

export default function ScrollXPBar() {
  const xp = useStore(xpAtom);
  const [visible, setVisible] = useState(false);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Desktop-only — the bar overlapped the sticky banner on mobile and
    // mostly cluttered small screens. Mounting still happens (cheap), but
    // we skip the scroll listener and render null below 768px.
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setEnabled(false);
      return;
    }
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = Math.min(scrollTop / docHeight, 1);
        const newXp = Math.round(progress * MAX_XP);

        xpAtom.set(newXp);
        setVisible(scrollTop > 100);
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const currentMilestone = milestones.filter((m) => m.xp <= xp).pop();
  const progressPercent = (xp / MAX_XP) * 100;

  if (!enabled) return null;

  return (
    <div
      className={`fixed top-16 left-0 right-0 z-30 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      {/* Track */}
      <div className="h-1 relative overflow-hidden" style={{ background: "rgba(4,22,39,0.1)" }}>
        {/* Filled bar with gradient */}
        <div
          className="h-full transition-all duration-300 ease-out relative"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(90deg, #62fae3, #006b5f ${Math.min(progressPercent * 2, 100)}%, #041627)`,
          }}
        >
          {/* Shimmer on the leading edge */}
          <div
            className="absolute right-0 top-0 bottom-0 w-8"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>

        {/* Milestone dots */}
        {milestones.map((m) => (
          <div
            key={m.xp}
            className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300 ${
              xp >= m.xp ? "bg-[var(--color-accent-secondary)] scale-125" : "bg-[var(--color-text-secondary)]/20"
            }`}
            style={{ left: `${(m.xp / MAX_XP) * 100}%` }}
          />
        ))}
      </div>

      {/* XP counter - only visible when scrolling */}
      {visible && (
        <div className="absolute right-4 top-2 flex items-center gap-2 text-xs">
          <span className="text-[var(--color-text-secondary)]">
            {currentMilestone?.label || "Новичок"}
          </span>
          <span
            className="font-mono font-bold px-2 py-0.5 rounded-full text-[10px]"
            style={{
              background: "rgba(0, 107, 95, 0.12)",
              color: "#006b5f",
              border: "1px solid rgba(0, 107, 95, 0.25)",
            }}
          >
            {xp} XP
          </span>
        </div>
      )}
    </div>
  );
}
