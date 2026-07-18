"use client";

// ponytail: isolated 3D chunk — keeps Three.js out of the homepage's
// initial module graph so Turbopack doesn't block the page compile
import SceneShell from "@/components/canvas/scene-shell";
import StarField from "@/components/canvas/star-field";

export default function Home3D() {
  return (
    <SceneShell className="pointer-events-none">
      <StarField intensity={0.6} interactive />
    </SceneShell>
  );
}
