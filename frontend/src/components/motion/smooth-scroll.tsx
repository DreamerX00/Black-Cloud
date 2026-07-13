"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Global Lenis smooth-scroll + GSAP ScrollTrigger bridge.
 *
 * This is the DNA move behind Lusion / Active Theory / Igloo — buttery,
 * momentum-based scroll that all scroll-linked animations attach to.
 * Ties Lenis into ScrollTrigger so all `useScroll` (Motion) and
 * ScrollTrigger animations read from the same virtual scroller.
 *
 * Disables itself under prefers-reduced-motion — the DOM still scrolls
 * naturally, no smoothing.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduce) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    // Sync Lenis with GSAP's ticker (no double rAF loops).
    lenis.on("scroll", ScrollTrigger.update);
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    // Sync Lenis position into `window.scrollY` for Motion useScroll().
    // Lenis already dispatches native scroll events for this.

    return () => {
      gsap.ticker.remove(tickerCb);
      lenis.destroy();
    };
  }, []);

  return null;
}
