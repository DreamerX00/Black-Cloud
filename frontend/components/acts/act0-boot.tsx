"use client";
import { ParticleLogo } from "@/components/effects/particle-logo";

export default function Act0Boot() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <ParticleLogo text="BLACKCLOUD" />
      <p className="mt-4 font-mono text-sm tracking-[0.3em] text-zinc-400">SCROLL TO DESCEND</p>
    </section>
  );
}
