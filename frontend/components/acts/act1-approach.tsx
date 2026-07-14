"use client";
import { motion } from "motion/react";
import { Spotlight } from "@/components/effects/spotlight";
import { ShimmerButton } from "@/components/effects/shimmer-button";

export default function Act1Approach() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <Spotlight />
      <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="max-w-3xl bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold text-transparent">
        One control plane for every cloud.
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-6 max-w-xl text-lg text-zinc-400">
        Deploy, observe, and scale across AWS, Azure, and Google Cloud from a single cinematic surface.
      </motion.p>
      <div className="mt-10"><ShimmerButton>Enter the galaxy →</ShimmerButton></div>
    </section>
  );
}
