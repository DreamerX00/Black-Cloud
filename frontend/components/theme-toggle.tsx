"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const base = cn(
    "relative inline-flex size-9 items-center justify-center rounded-md border border-border bg-background/50 text-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
    className
  );

  // Until mounted, next-themes theme is undefined on the server → render a
  // stable placeholder with identical dimensions to avoid hydration mismatch.
  if (!mounted) {
    return <div className={base} aria-hidden />;
  }

  const isDark = theme === "dark";
  const next = isDark ? "light" : "dark";
  const label = `Switch to ${next} theme`;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={base}
      aria-label={label}
      title={label}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={reduceMotion ? false : { rotate: -90, scale: 0, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { rotate: 90, scale: 0, opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 0.25, ease: "easeInOut" }}
          className="absolute inline-flex"
        >
          {isDark ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
