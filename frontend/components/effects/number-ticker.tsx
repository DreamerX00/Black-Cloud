"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

export function NumberTicker({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 30, stiffness: 120 });

  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, mv, value]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
      }),
    [spring, suffix],
  );

  return <span ref={ref}>0{suffix}</span>;
}
