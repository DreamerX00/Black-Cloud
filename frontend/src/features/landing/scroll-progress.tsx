"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Scroll progress rail — persistent overlay.
 *
 * Two affordances:
 *   1. Top gradient bar tracking global scroll (useScroll → spring)
 *   2. Right-edge dot rail showing act boundaries. Dots read the current
 *      #hash / IntersectionObserver on section ids to highlight the active
 *      act. Hover reveals the label.
 *
 * Sits above content (z-40) but below the header (z-50 not used; header is
 * z-40 — dots go z-30 so header wins).
 */

const ACTS: { id: string; label: string }[] = [
  { id: "hero", label: "Hero" },
  { id: "globe", label: "Globe" },
  { id: "bento", label: "Features" },
  { id: "architecture", label: "3D" },
  { id: "playground", label: "Playground" },
  { id: "command", label: "Command" },
  { id: "gallery", label: "Gallery" },
  { id: "chapters", label: "Chapters" },
  { id: "code", label: "Export" },
  { id: "builder", label: "Builder" },
  { id: "timeline", label: "Steps" },
  { id: "cost", label: "Cost" },
  { id: "integrations", label: "Integrations" },
  { id: "trust", label: "Trust" },
  { id: "cases", label: "Cases" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 90, damping: 20 });

  const [active, setActive] = useState<string>(ACTS[0].id);

  useEffect(() => {
    const targets = ACTS.map((a) => document.getElementById(a.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!targets.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // Choose the entry closest to the top that's currently intersecting.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, []);

  return (
    <>
      {/* Top gradient bar */}
      <motion.div
        aria-hidden
        style={{ scaleX: width }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-gradient-to-r from-ai via-gcp to-aws"
      />

      {/* Right-edge dot rail (tablet+ only, decorative) */}
      <nav
        aria-label="Section navigation"
        className="fixed right-6 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 tablet:flex"
      >
        {ACTS.map((a) => {
          const isActive = active === a.id;
          return (
            <a
              key={a.id}
              href={`#${a.id}`}
              className="group relative flex items-center"
            >
              <span
                className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "scale-[2] bg-ai" : "bg-muted-foreground/40 group-hover:bg-muted-foreground"
                }`}
              />
              <span
                className={`pointer-events-none absolute right-6 whitespace-nowrap rounded-md border border-border/40 bg-space/80 px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground backdrop-blur transition-opacity duration-200 ${
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
              >
                {a.label}
              </span>
            </a>
          );
        })}
      </nav>
    </>
  );
}
