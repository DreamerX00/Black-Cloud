"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

export function CursorGlow() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 30, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 200, damping: 30, mass: 0.4 });

  useEffect(() => {
    if (reduced) return;
    function onMove(e: MouseEvent) {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[60]"
      style={{ opacity: visible ? 1 : 0 }}
      transition={{ opacity: { duration: 0.4 } }}
    >
      <motion.div
        className="absolute h-[500px] w-[500px] rounded-full blur-3xl"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.18), rgba(139,92,246,0.06) 45%, transparent 70%)",
        }}
      />
    </motion.div>
  );
}
