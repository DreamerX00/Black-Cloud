"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks page scroll as a 0→1 progress ref (no re-renders — the value is read
 * inside the R3F frame loop). 0 = top of hero, 1 = end of the scroll stage.
 */
export function useScrollProgress() {
  const progress = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return progress;
}
