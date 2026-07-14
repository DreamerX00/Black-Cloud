"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { SplitText } from "@/components/motion/split-text";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";

/**
 * Chapter — one scroll act.
 * Adds parallax on the visual (moves at ~0.65× scroll speed) and 3D pointer
 * tilt on hover. Sticky-headline effect: heading rises while visual drops,
 * producing the "cinematic parallax" Awwwards sites lean on.
 */
interface Props {
  eyebrow: string;
  headline: string;
  body: string;
  visual: ReactNode;
  align?: "left" | "right";
  accent?: string;
}

export function Chapter({
  eyebrow,
  headline,
  body,
  visual,
  align = "left",
  accent,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const yVisual = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.6]);

  return (
    <section
      ref={ref}
      className="relative mx-auto grid w-full max-w-6xl gap-8 px-6 py-24 tablet:grid-cols-2 tablet:gap-16 tablet:px-10 tablet:py-40"
      style={{
        // Ambient chapter tint — each chapter gets a whisper of its accent.
        // Placed on the section so it doesn't interfere with the sticky bg.
        backgroundImage: accent
          ? `radial-gradient(ellipse 45% 55% at ${
              align === "left" ? "80%" : "20%"
            } 50%, ${accent}18, transparent 65%)`
          : undefined,
      }}
    >
      <motion.div
        style={{ y: reduce ? 0 : yText, opacity: reduce ? 1 : opacity }}
        className={cn(
          "flex flex-col justify-center",
          align === "right" && "tablet:order-2",
        )}
      >
        <Reveal>
          <span
            className="inline-block rounded-full border border-border/60 bg-graphite/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
            style={accent ? { color: accent, borderColor: `${accent}55` } : undefined}
          >
            {eyebrow}
          </span>
        </Reveal>

        <h2 className="mt-6 font-display text-4xl font-semibold leading-[1.03] tracking-[-0.02em] tablet:text-6xl desktop:text-7xl">
          <SplitText text={headline} />
        </h2>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-lg text-lg text-muted-foreground tablet:text-xl">
            {body}
          </p>
        </Reveal>
      </motion.div>

      <motion.div
        style={{ y: reduce ? 0 : yVisual }}
        className={cn(
          "relative flex items-center justify-center",
          align === "right" && "tablet:order-1",
        )}
      >
        <TiltCard className="w-full">
          <div className="group relative flex items-center justify-center">
            {visual}
            {/* Spotlight follow — reads --mx/--my set by TiltCard. */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at var(--mx,50%) var(--my,50%), rgba(139,92,246,0.14), transparent 40%)",
              }}
            />
          </div>
        </TiltCard>
      </motion.div>
    </section>
  );
}
