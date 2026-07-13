"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Lightweight FPS meter — dev builds only.
 * Samples `requestAnimationFrame` and reports rolling averages. Zero cost in
 * production because `<FpsMeter />` early-returns null when NODE_ENV !== dev.
 * Renders in a fixed-position badge to avoid coupling to any layout.
 */
export function FpsMeter() {
  const isDev = process.env.NODE_ENV === "development";
  const [fps, setFps] = useState(60);
  const [min, setMin] = useState(60);
  const frameRef = useRef(0);
  const lastRef = useRef<number | null>(null);
  const framesRef = useRef<number[]>([]);

  useEffect(() => {
    if (!isDev) return;

    let raf = 0;
    lastRef.current = performance.now();
    const loop = (now: number) => {
      const delta = now - (lastRef.current ?? now);
      lastRef.current = now;
      const current = 1000 / delta;
      framesRef.current.push(current);
      if (framesRef.current.length > 30) framesRef.current.shift();
      frameRef.current++;

      // Update UI ~10 Hz to avoid its own re-render spam.
      if (frameRef.current % 6 === 0) {
        const avg = framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length;
        setFps(Math.round(avg));
        setMin((prev) => Math.min(prev, Math.round(current)));
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isDev]);

  if (!isDev) return null;

  const color =
    fps >= 55 ? "text-success" : fps >= 40 ? "text-warning" : "text-danger";

  return (
    <div className="pointer-events-none fixed bottom-3 left-3 z-50 select-none rounded-md border border-border/60 bg-background/80 px-2.5 py-1 font-mono text-[10px] backdrop-blur">
      <span className={color}>{fps} fps</span>
      <span className="ml-2 text-muted-foreground">min {min}</span>
    </div>
  );
}
