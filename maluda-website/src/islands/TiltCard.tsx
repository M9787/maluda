import { useEffect, useRef, useState, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export default function TiltCard({ children, className = "", glowColor = "#00D4FF" }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendingRef = useRef<{ rotateX: number; rotateY: number; gx: number; gy: number } | null>(null);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Disable tilt on touch / coarse pointers and when user prefers reduced motion.
    // 3D tilt has no value without a precise pointer and is GPU-expensive on mobile.
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    if (reducedMotion || coarsePointer) setEnabled(false);
  }, []);

  const flush = () => {
    rafRef.current = null;
    const next = pendingRef.current;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!next || !card || !glow) return;
    card.style.transform = `perspective(800px) rotateX(${next.rotateX}deg) rotateY(${next.rotateY}deg) scale3d(1.012, 1.012, 1.012)`;
    glow.style.opacity = "1";
    glow.style.left = `${next.gx}px`;
    glow.style.top = `${next.gy}px`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Claude-restraint: subtler tilt amplitude (was 8°, now 5°). The card
    // acknowledges the cursor without performing for it.
    pendingRef.current = {
      rotateX: ((y - centerY) / centerY) * -5,
      rotateY: ((x - centerX) / centerX) * 5,
      gx: x,
      gy: y,
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(flush);
    }
  };

  const handleMouseLeave = () => {
    if (!enabled) return;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingRef.current = null;
    const card = cardRef.current;
    const glow = glowRef.current;
    if (!card || !glow) return;
    card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)";
    glow.style.opacity = "0";
    setTimeout(() => {
      if (cardRef.current) cardRef.current.style.transition = "";
    }, 600);
  };

  useEffect(() => () => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={enabled ? handleMouseMove : undefined}
      onMouseLeave={enabled ? handleMouseLeave : undefined}
      style={{ transformStyle: "preserve-3d", willChange: enabled ? "transform" : "auto" }}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle, ${glowColor}20 0%, transparent 70%)`,
          filter: "blur(20px)",
          zIndex: 0,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
