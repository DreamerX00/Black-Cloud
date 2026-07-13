"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Award-tier custom cursor — Lusion/Active Theory pattern.
 *
 * Two-layer cursor:
 *   - `dot`  : pixel-tight tracker, follows raw pointer, tiny lag = "alive"
 *   - `ring` : trailing outline, magnetic-attracts to `[data-magnetic]` elements
 *
 * Perf: uses transform in a rAF loop with `pointerEvents: none`. Never triggers
 * React re-renders. Hidden on touch devices (no pointer, no benefit).
 * Fully disabled under `prefers-reduced-motion`.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduce) return;
    // Touch device? — no cursor to enhance.
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let scale = 1;
    let raf = 0;
    let magnetTarget: HTMLElement | null = null;

    document.documentElement.classList.add("has-custom-cursor");

    const onMove = (e: PointerEvent) => {
      // Magnetic pull: if hovering a [data-magnetic], the ring drifts toward
      // that element's center rather than the pointer, giving the classic
      // "buttons want to be clicked" feel.
      magnetTarget = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-magnetic]",
      ) ?? null;
      mx = e.clientX;
      my = e.clientY;
    };

    const onDown = () => (scale = 0.75);
    const onUp = () => (scale = 1);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    const loop = () => {
      let tx = mx;
      let ty = my;
      if (magnetTarget) {
        const r = magnetTarget.getBoundingClientRect();
        // 40% pull toward the center of the magnet target.
        tx = mx + (r.left + r.width / 2 - mx) * 0.4;
        ty = my + (r.top + r.height / 2 - my) * 0.4;
      }
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;

      dot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${
        magnetTarget ? 2.2 : scale
      })`;
      ring.style.borderColor = magnetTarget
        ? "var(--bc-ai)"
        : "rgba(255,255,255,0.35)";

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <>
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground mix-blend-difference [.has-custom-cursor_&]:block"
        style={{ transform: "translate3d(-100px,-100px,0)" }}
      />
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/35 [.has-custom-cursor_&]:block"
        style={{ transform: "translate3d(-100px,-100px,0)", transition: "border-color 200ms" }}
      />
    </>
  );
}
