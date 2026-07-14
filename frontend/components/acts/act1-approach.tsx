"use client";
import { Spotlight } from "@/components/effects/spotlight";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { SplitText } from "@/components/effects/split-text";
import { TextReveal } from "@/components/effects/text-reveal";
import { Magnetic } from "@/components/effects/magnetic";
import { AnimatedGradient } from "@/components/effects/animated-gradient";
import { DotPattern } from "@/components/effects/dot-pattern";
import { Parallax } from "@/components/effects/parallax";

export default function Act1Approach() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden text-center">
      {/* decorative layers — partial opacity + pointer-events-none so the 3D galaxy stays visible */}
      <div className="pointer-events-none absolute inset-0 opacity-25">
        <AnimatedGradient />
      </div>
      <DotPattern className="opacity-40" />

      <Spotlight />

      <Parallax speed={0.2} className="flex flex-col items-center">
        <SplitText
          text="One control plane for every cloud."
          as="h1"
          className="max-w-3xl bg-gradient-to-b from-foreground to-muted-foreground bg-clip-text text-5xl font-bold text-transparent sm:text-6xl"
        />

        <TextReveal className="mt-6 max-w-xl text-lg text-muted-foreground">
          Deploy, observe, and scale across AWS, Azure, and Google Cloud from a
          single cinematic surface.
        </TextReveal>
      </Parallax>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Magnetic>
          <ShimmerButton>Enter the galaxy →</ShimmerButton>
        </Magnetic>
        <Magnetic strength={0.3}>
          <button className="clay-pressable px-6 py-3 text-sm font-medium text-foreground">
            Watch the flythrough
          </button>
        </Magnetic>
      </div>
    </section>
  );
}
