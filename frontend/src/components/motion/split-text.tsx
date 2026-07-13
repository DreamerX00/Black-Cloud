"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "./primitives";

/**
 * Word-by-word reveal for display headlines.
 * Splits on whitespace only (no per-character to keep DOM count sane —
 * per-char stagger causes layout thrash on huge headlines).
 * Under reduced-motion, renders plain text.
 */
export function SplitText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{text}</span>;

  const words = text.split(" ");

  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom"
        >
          <motion.span
            initial={{ y: "110%" }}
            whileInView={{ y: "0%" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{
              duration: 0.9,
              delay: delay + i * stagger,
              ease: EASE.emphasized,
            }}
            className="inline-block will-change-transform"
          >
            {word}
            {i < words.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
