"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { useScrollProgress } from "./scroll";
import { Overlay } from "./overlay";
import ClickSpark from "@/components/reactbits/ClickSpark";
import TargetCursor from "@/components/reactbits/TargetCursor";

// Lazy client-only WebGL layers (each pulls a renderer; keep off first paint / SSR).
const ConstellationScene = dynamic(
  () => import("./scene").then((m) => m.ConstellationScene),
  { ssr: false },
);
const LightRays = dynamic(() => import("@/components/reactbits/LightRays"), {
  ssr: false,
});
const Aurora = dynamic(() => import("@/components/reactbits/Aurora"), {
  ssr: false,
});

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const progress = useScrollProgress();
  const reduced = useReducedMotion();
  const [webgl] = useState(() => (typeof window !== "undefined" ? hasWebGL() : false));
  const enabled = webgl && !reduced;

  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={10} sparkRadius={22} duration={500}>
      {/* Custom targeting cursor (locks onto .cursor-target elements) */}
      {enabled && <TargetCursor targetSelector=".cursor-target" spinDuration={3} />}

      <div className="relative">
        {enabled ? (
          <>
            {/* Layer 0: atmospheric light rays from top */}
            <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
              <LightRays
                raysOrigin="top-center"
                raysColor="#8b5cf6"
                raysSpeed={1.2}
                lightSpread={1.4}
                rayLength={2.4}
                followMouse
                mouseInfluence={0.15}
                fadeDistance={1.2}
              />
            </div>
            {/* Layer 1: aurora wash at the base */}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-[60vh] opacity-60">
              <Aurora
                colorStops={["#8b5cf6", "#4285f4", "#22c55e"]}
                amplitude={1.1}
                blend={0.6}
                speed={0.8}
              />
            </div>
            {/* Layer 2: the 3D infrastructure constellation */}
            <ConstellationScene progress={progress} />
          </>
        ) : (
          <StaticBackdrop />
        )}

        {/* Layer 3: content */}
        <Overlay />
      </div>
    </ClickSpark>
  );
}

function StaticBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 bg-void"
      style={{
        backgroundImage:
          "radial-gradient(60% 50% at 30% 30%, rgba(139,92,246,0.18), transparent 70%)," +
          "radial-gradient(50% 40% at 75% 60%, rgba(0,120,212,0.14), transparent 70%)," +
          "radial-gradient(45% 45% at 60% 20%, rgba(255,153,0,0.10), transparent 70%)",
      }}
    />
  );
}
