import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function initAllAnimations(): () => void {
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Always — these are one-shot or do their own reduced-motion handling.
  initHeroVideo();
  initLazyBgVideos();
  const removeVisibility = initVisibilityPause();

  if (!reducedMotion) {
    animateHeroText();
    animateSectionHeadings();
    animateCards();
    animateComparison();
    initPortalTransitions();
    animateSteps();
    animateCounters();
    setupParallax();
    initMagneticButtons();
  } else {
    // Reduced-motion users still need to see content — strip the from-state.
    document.querySelectorAll<HTMLElement>("[data-animate]").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  // Cleanup: kill all ScrollTriggers + GSAP tweens so SPA-style navigation
  // (Astro View Transitions) doesn't leak listeners or stack triggers.
  return () => {
    ScrollTrigger.getAll().forEach((t) => t.kill());
    gsap.globalTimeline.clear();
    removeVisibility?.();
  };
}

// The hero video is now a single pre-rendered boomerang loop (forward+reverse
// concatenated and slowed at encode time). No JS source-swap, no decoder reset,
// no playbackRate fiddling — the browser just loops it natively. We only need
// to pause it for prefers-reduced-motion users and tag it for visibility pause.
function initHeroVideo() {
  const vid = document.getElementById("hero-vid") as HTMLVideoElement | null;
  if (!vid) return;

  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reducedMotion) {
    vid.pause();
    vid.removeAttribute("autoplay");
    return;
  }

  vid.play().catch(() => { /* mobile autoplay quirks; poster stays */ });
  vid.dataset.maludaManaged = "1";
}

function initLazyBgVideos() {
  const lazies = document.querySelectorAll<HTMLVideoElement>("video[data-lazy-video]");
  if (!lazies.length || typeof IntersectionObserver === "undefined") {
    // Fallback: just play whatever's there
    lazies.forEach((v) => v.play().catch(() => {}));
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const vid = entry.target as HTMLVideoElement;
      vid.load();
      vid.play().catch(() => {});
      vid.dataset.maludaManaged = "1";
      io.unobserve(vid);
    });
  }, { rootMargin: "200px" });

  lazies.forEach((vid) => io.observe(vid));
}

function initVisibilityPause(): (() => void) | undefined {
  if (typeof document === "undefined") return undefined;
  const handler = () => {
    const managed = document.querySelectorAll<HTMLVideoElement>('video[data-maluda-managed="1"]');
    managed.forEach((vid) => {
      if (document.hidden) {
        vid.pause();
      } else {
        vid.play().catch(() => {});
      }
    });
  };
  document.addEventListener("visibilitychange", handler);
  return () => document.removeEventListener("visibilitychange", handler);
}

function animateHeroText() {
  // Entrance tweens stay in GSAP (one-shot, run once and stop).
  // The infinite "breathing" idle loops were promoted to CSS @keyframes —
  // GSAP's ticker would otherwise burn ~60 rAFs/sec forever just to oscillate
  // a few px on three elements. CSS-driven transforms run on the compositor
  // and don't touch the JS main thread at all.
  const headline = document.querySelector("[data-animate='hero-headline']");
  if (headline) {
    gsap.from(headline, {
      y: 40, opacity: 0, duration: 2.4, ease: "sine.out", delay: 0.2,
      onComplete: () => headline.classList.add("hero-breath"),
    });
  }

  const sub = document.querySelector("[data-animate='hero-sub']");
  if (sub) {
    gsap.from(sub, {
      y: 30, opacity: 0, duration: 2.2, ease: "sine.out", delay: 0.5,
      onComplete: () => sub.classList.add("hero-breath-sub"),
    });
  }

  const cta = document.querySelector("[data-animate='hero-cta']");
  if (cta) {
    gsap.from(cta, {
      scale: 0.95, y: 20, opacity: 0, duration: 1.8, ease: "sine.out", delay: 0.8,
      onComplete: () => cta.classList.add("hero-breath-cta"),
    });
  }
}

function animateSectionHeadings() {
  gsap.utils.toArray<HTMLElement>("[data-animate='heading']").forEach((el) => {
    gsap.from(el, {
      y: 40, opacity: 0, duration: 1.6, ease: "sine.out",
      scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
    });
  });
}

function initMagneticButtons() {
  const magneticElements = document.querySelectorAll<HTMLElement>("[data-magnetic]");

  // Claude-restraint: gentler magnetic pull (0.45 -> 0.25) and a soft return
  // ease instead of bouncy elastic. Buttons drift toward the cursor; they
  // don't fly at it and snap back like a slingshot.
  magneticElements.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(el, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.7,
        ease: "power2.out",
        overwrite: true
      });
    });

    el.addEventListener("mouseleave", () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        overwrite: true
      });
    });
  });
}

function animateCards() {
  gsap.utils.toArray<HTMLElement>("[data-animate='card-group']").forEach((group) => {
    const cards = group.querySelectorAll("[data-animate='card']");
    gsap.from(cards, {
      y: 60, opacity: 0, duration: 1.0, stagger: 0.18, ease: "power2.out",
      scrollTrigger: { trigger: group, start: "top 85%", once: true },
      clearProps: "all"
    });
  });
}

function animateComparison() {
  const left = document.querySelector("[data-animate='compare-left']");
  const right = document.querySelector("[data-animate='compare-right']");
  if (left) {
    gsap.from(left, {
      x: -100, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: left, start: "top 80%" },
    });
  }
  if (right) {
    gsap.from(right, {
      x: 100, opacity: 0, duration: 0.8, ease: "power2.out",
      scrollTrigger: { trigger: right, start: "top 80%" },
    });
  }
}

function animateSteps() {
  const steps = gsap.utils.toArray<HTMLElement>("[data-animate='step']");
  const line = document.querySelector("[data-animate='step-line']");

  if (line) {
    gsap.from(line, {
      scaleY: 0, transformOrigin: "top", duration: 1.5, ease: "power1.inOut",
      scrollTrigger: { trigger: line, start: "top 75%", end: "bottom 25%", scrub: 1 },
    });
  }

  steps.forEach((step, i) => {
    gsap.from(step, {
      x: i % 2 === 0 ? -60 : 60, opacity: 0, duration: 0.6, ease: "power2.out",
      scrollTrigger: { trigger: step, start: "top 85%" },
    });
  });
}

function animateCounters() {
  gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
    const target = parseInt(el.dataset.count || "0");
    const suffix = el.dataset.countSuffix || "";
    const obj = { val: 0 };
    gsap.to(obj, {
      val: target, duration: 2, ease: "power1.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = Math.round(obj.val).toString() + suffix;
      },
    });
  });
}

function setupParallax() {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const speed = parseFloat(el.dataset.parallax || "0.3");
    gsap.to(el, {
      yPercent: speed * 100, ease: "none",
      scrollTrigger: {
        trigger: el.parentElement!, start: "top bottom", end: "bottom top", scrub: true,
      },
    });
  });
}

function initPortalTransitions() {
  gsap.utils.toArray<HTMLElement>(".portal-section").forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top 85%",
      onEnter: () => section.classList.add("portal-active"),
    });
  });
}
