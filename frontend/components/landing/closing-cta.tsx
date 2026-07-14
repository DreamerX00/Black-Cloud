"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import GradientText from "@/components/reactbits/GradientText";
import Magnet from "@/components/reactbits/Magnet";
import StarBorder from "@/components/reactbits/StarBorder";

const Particles = dynamic(() => import("@/components/reactbits/Particles"), {
  ssr: false,
});

// ponytail: cheap one-shot WebGL probe; enough to gate the heavy ogl bg
function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

export function ClosingCta() {
  const reduced = useReducedMotion();
  // Lazy init: dynamic import + "use client" means this only runs in the browser.
  const [webgl] = useState(() => (typeof window !== "undefined" ? hasWebGL() : false));

  const showParticles = webgl && !reduced;

  return (
    <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 py-32 text-center">
      {showParticles ? (
        <div className="pointer-events-none absolute inset-0 z-0 opacity-50">
          <Particles
            particleColors={["#8b5cf6", "#4285f4", "#22c55e"]}
            particleCount={220}
            particleSpread={12}
            speed={0.08}
            alphaParticles
          />
        </div>
      ) : (
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.18),transparent_65%)]" />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <GradientText
          colors={["#8b5cf6", "#4285f4", "#22c55e", "#8b5cf6"]}
          animationSpeed={6}
          className="font-display text-6xl font-bold tracking-tight sm:text-8xl"
        >
          Your cloud, visualized.
        </GradientText>

        <p className="max-w-xl text-lg text-fg-muted sm:text-xl">
          Draw your architecture across AWS, Azure, and GCP, catch invalid edges
          live, and export the whole thing as JSON in one click.
        </p>

        <Magnet padding={80} magnetStrength={4}>
          <StarBorder
            as={Link}
            href="/dashboard"
            color="#8b5cf6"
            speed="5s"
            className="cursor-target"
          >
            Start building — free
          </StarBorder>
        </Magnet>
      </motion.div>
    </section>
  );
}
