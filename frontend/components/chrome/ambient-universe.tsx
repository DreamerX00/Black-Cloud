"use client";

import { useEffect, useRef } from "react";

/**
 * Persistent Layer-1 background — a lightweight starfield + drifting nebula
 * painted on a single canvas. Lives behind every route.
 * Keeps FPS by capping DPR, sleeping the RAF when the tab is hidden,
 * and never allocating on the render loop.
 */
export function AmbientUniverse() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    let width = 0;
    let height = 0;

    const stars: Array<{ x: number; y: number; z: number; r: number; hue: number; twinkle: number }> = [];
    const STAR_COUNT = 220;

    const rebuild = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars.length = 0;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: Math.random() * 0.9 + 0.1,
          r: Math.random() * 1.2 + 0.2,
          hue: Math.random() > 0.85 ? 265 : Math.random() > 0.7 ? 200 : 220,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
    };
    rebuild();
    window.addEventListener("resize", rebuild);

    let raf = 0;
    let t = 0;
    let mouseX = width / 2;
    let mouseY = height / 2;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove);

    const draw = () => {
      t += 0.006;
      ctx.clearRect(0, 0, width, height);

      // Nebula wash — three soft radial blooms that drift with time
      const blobs = [
        { x: width * (0.15 + Math.sin(t * 0.6) * 0.05), y: height * (0.2 + Math.cos(t * 0.4) * 0.05), c: "rgba(139,92,246,0.14)", r: Math.max(width, height) * 0.45 },
        { x: width * (0.85 + Math.cos(t * 0.5) * 0.04), y: height * (0.3 + Math.sin(t * 0.7) * 0.04), c: "rgba(56,189,248,0.10)", r: Math.max(width, height) * 0.4 },
        { x: width * (0.5 + Math.sin(t * 0.3) * 0.05), y: height * (0.85 + Math.cos(t * 0.3) * 0.05), c: "rgba(255,153,0,0.08)", r: Math.max(width, height) * 0.5 },
      ];
      for (const b of blobs) {
        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
        g.addColorStop(0, b.c);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Stars — parallax against cursor + twinkle
      const px = (mouseX - width / 2) / width;
      const py = (mouseY - height / 2) / height;
      for (const s of stars) {
        s.twinkle += 0.015 + s.z * 0.01;
        const alpha = 0.4 + Math.sin(s.twinkle) * 0.35 * s.z + 0.25;
        const ox = s.x + px * 20 * s.z;
        const oy = s.y + py * 20 * s.z;
        ctx.beginPath();
        ctx.arc(ox, oy, s.r * s.z, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${s.hue}, 80%, 80%, ${alpha})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!raf) raf = requestAnimationFrame(draw); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    start();

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stop();
      window.removeEventListener("resize", rebuild);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <canvas ref={ref} aria-hidden className="h-full w-full" />
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.08), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(56,189,248,0.05), transparent 55%)",
        }}
      />
    </div>
  );
}
