"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "motion/react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  variant?: "char" | "word" | "line";
  className?: string;
  delay?: number; // seconds before start, default 0
}

export function TextReveal({
  text,
  variant = "word",
  className,
  delay = 0,
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [inView, controls]);

  const split = (): string[] => {
    if (variant === "char") return text.split("");
    if (variant === "line") return text.split("\n");
    return text.split(" ");
  };

  const pieces = split();
  const separator = variant === "char" ? "" : variant === "line" ? "\n" : " ";

  return (
    <motion.span
      ref={ref}
      className={cn("inline", className)}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04, delayChildren: delay } },
      }}
      aria-label={text}
    >
      {pieces.map((piece, i) => (
        <motion.span
          key={`${i}-${piece}`}
          className="inline-block"
          style={{ whiteSpace: variant === "line" ? "pre-line" : "pre" }}
          variants={{
            hidden: { opacity: 0, y: 12, filter: "blur(4px)" },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: 0.4, ease: "easeOut" },
            },
          }}
        >
          {piece}
          {i < pieces.length - 1 ? separator : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
