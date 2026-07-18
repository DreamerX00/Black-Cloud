"use client";

import { useEffect, useRef } from "react";

/**
 * Cinematic cursor: fine dot + trailing halo that magnetizes to
 * elements marked `data-cursor="magnet"` and enlarges on `data-cursor="grow"`.
 * Falls back to native cursor on touch devices.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let dx = mx;
    let dy = my;
    let rx = mx;
    let ry = my;
    let raf = 0;

    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const step = () => {
      dx += (mx - dx) * 0.85;
      dy += (my - dy) * 0.85;
      rx += (mx - rx) * 0.14;
      ry += (my - ry) * 0.14;
      dot.style.transform = `translate3d(${dx - 3}px, ${dy - 3}px, 0)`;
      ring.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const el = document.elementFromPoint(mx, my) as HTMLElement | null;
      const mode = el?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor;
      if (mode === "grow") {
        ring.style.width = "72px";
        ring.style.height = "72px";
        ring.style.borderColor = "rgba(139,92,246,0.7)";
        ring.style.backgroundColor = "rgba(139,92,246,0.08)";
      } else if (mode === "magnet") {
        ring.style.width = "56px";
        ring.style.height = "56px";
        ring.style.borderColor = "rgba(56,189,248,0.7)";
        ring.style.backgroundColor = "rgba(56,189,248,0.06)";
      } else if (mode === "text") {
        ring.style.width = "6px";
        ring.style.height = "28px";
        ring.style.borderRadius = "3px";
        ring.style.borderColor = "rgba(230,237,247,0.9)";
        ring.style.backgroundColor = "rgba(230,237,247,0.4)";
      } else {
        ring.style.width = "36px";
        ring.style.height = "36px";
        ring.style.borderRadius = "9999px";
        ring.style.borderColor = "rgba(230,237,247,0.4)";
        ring.style.backgroundColor = "transparent";
      }
    };
    window.addEventListener("mousemove", onMove);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-ink/40 transition-[width,height,border-color,background-color,border-radius] duration-200"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 rounded-full bg-ink"
      />
    </>
  );
}
