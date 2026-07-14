"use client";

import { useEffect, useRef } from "react";

/**
 * Global cursor spotlight — subtle mood layer.
 *
 * A fixed radial gradient that follows the pointer with a raf-driven
 * lerp. Sits above the page background but below content (pointer-events
 * none), so it's decorative only. Uses `mix-blend-screen` so it warms the
 * space it passes over without washing out text.
 *
 * Cheap: one <div>, one CSS `background`, one raf. No React state churn.
 */
export function SpotlightOverlay() {
  const ref = useRef<HTMLDivElement | null>(null);
  const target = useRef({ x: -1000, y: -1000 });
  const current = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      target.current.x = e.clientX;
      target.current.y = e.clientY;
    };
    const tick = () => {
      const el = ref.current;
      if (el) {
        current.current.x += (target.current.x - current.current.x) * 0.12;
        current.current.y += (target.current.y - current.current.y) * 0.12;
        el.style.setProperty("--sx", `${current.current.x}px`);
        el.style.setProperty("--sy", `${current.current.y}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 mix-blend-screen"
      style={{
        background:
          "radial-gradient(400px circle at var(--sx, -1000px) var(--sy, -1000px), rgba(139,92,246,0.14), transparent 60%)",
      }}
    />
  );
}
