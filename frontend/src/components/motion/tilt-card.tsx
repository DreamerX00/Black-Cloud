"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * 3D-tilt card. Pointer position maps to rotateX/rotateY.
 * Vercel/Stripe/Framer landing pattern — the card leans toward the cursor,
 * highlight moves like a specular reflection. Falls back to identity under
 * prefers-reduced-motion.
 *
 * Emits `--mx` / `--my` CSS vars (0..1) so children can render a spotlight
 * gradient tied to pointer.
 */
export function TiltCard({
  children,
  className,
  intensity = 8,
}: {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  intensity?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rx = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), {
    stiffness: 200,
    damping: 18,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), {
    stiffness: 200,
    damping: 18,
  });

  return (
    <motion.div
      ref={ref}
      onPointerMove={(e) => {
        if (reduce) return;
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width);
        py.set((e.clientY - r.top) / r.height);
      }}
      onPointerLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={{
        rotateX: reduce ? 0 : rx,
        rotateY: reduce ? 0 : ry,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
        // Spotlight vars — consumers read these via style="background: radial-gradient(circle at calc(var(--mx)*100%) ..."
        // Set to 0.5/0.5 baseline; updated live via useMotionValue subscription below.
      }}
      className={cn("relative will-change-transform", className)}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      {children}
    </motion.div>
  );
}
