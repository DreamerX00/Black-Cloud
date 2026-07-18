"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Types text with an occasional character-glitch — evokes a decoder.
 * Runs once when mounted; deterministic length so SSR HTML doesn't jump.
 */
export function ScrambleText({
  text,
  duration = 1200,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) {
  const [out, setOut] = useState(text);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const chars = "▓▒░ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const cut = Math.floor(p * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < cut) s += text[i];
        else if (text[i] === " ") s += " ";
        else s += chars[Math.floor(Math.random() * chars.length)];
      }
      setOut(s);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return <span className={cn("font-mono", className)}>{out}</span>;
}
