"use client";

import dynamic from "next/dynamic";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import { useReducedMotion } from "motion/react";
import { HUD } from "./hud";

// Heavy scene subtrees are client-only and code-split (each pulls three deps).
const World = dynamic(() => import("./world").then((m) => m.World), { ssr: false });
const ServerGalaxy = dynamic(() => import("./server-galaxy").then((m) => m.ServerGalaxy), { ssr: false });
const FetchedModels = dynamic(() => import("./fetched-models").then((m) => m.FetchedModels), { ssr: false });
const CameraRig = dynamic(() => import("./camera-rig").then((m) => m.CameraRig), { ssr: false });
const PostFX = dynamic(() => import("./post-fx").then((m) => m.PostFX), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/**
 * Fullscreen cinematic 3D experience. One Canvas, one shared World scene, two
 * camera modes (see store.ts). Max-fidelity post-processing. Static fallback for
 * reduced-motion / no-WebGL is an accessibility floor, not a perf downgrade.
 */
export function ExperienceRoot() {
  const reduced = useReducedMotion();
  const [webgl] = useState(() => (typeof window !== "undefined" ? hasWebGL() : false));

  if (reduced || !webgl) return <StaticFallback />;

  return (
    <div className="fixed inset-0 h-dvh w-screen bg-void">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: false, // SMAA in the post pipeline handles AA
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        camera={{ fov: 55, near: 0.1, far: 200, position: [0, 14, 32] }}
      >
        <Suspense fallback={null}>
          <World />
          <ServerGalaxy />
          <FetchedModels />
          <CameraRig />
          <PostFX />
        </Suspense>
      </Canvas>
      <HUD />
    </div>
  );
}

function StaticFallback() {
  return (
    <div
      className="flex min-h-dvh flex-col items-center justify-center bg-void px-6 text-center"
      style={{
        backgroundImage:
          "radial-gradient(60% 50% at 50% 30%, rgba(139,92,246,0.20), transparent 70%)," +
          "radial-gradient(50% 40% at 75% 70%, rgba(66,133,244,0.14), transparent 70%)",
      }}
    >
      <h1 className="font-display text-6xl font-bold tracking-tight sm:text-8xl">BlackCloud</h1>
      <p className="mt-6 max-w-md text-lg text-fg-muted">
        Your cloud, as a universe. Enable motion and a WebGL-capable browser for the
        full cinematic experience.
      </p>
      <a
        href="/dashboard"
        className="mt-10 rounded-full bg-primary px-7 py-3 font-medium text-primary-fg"
      >
        Launch the playground
      </a>
    </div>
  );
}
