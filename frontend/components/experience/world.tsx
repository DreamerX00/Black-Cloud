"use client";

// Shared environment/atmosphere for the cinematic scene. Renders inside the
// existing Canvas (see experience-root.tsx). HDRI + lights + fog + reflective floor.

import { Suspense } from "react";
import { Environment, MeshReflectorMaterial } from "@react-three/drei";

export function World() {
  return (
    <>
      {/* Base background + fog so the scene is never blown out or blank if the HDR is missing. */}
      <color attach="background" args={["#050505"]} />
      <fogExp2 attach="fog" args={["#070713", 0.028]} />

      {/* HDRI lighting/background. Suspends independently; falls back to the color above. */}
      <Suspense fallback={null}>
        <Environment
          files="/experience/env.hdr"
          background
          blur={0.5}
          environmentIntensity={0.6}
        />
      </Suspense>

      {/* Base fill + key light with tuned shadow camera. */}
      <ambientLight intensity={0.15} />
      <directionalLight
        position={[10, 20, 10]}
        intensity={1.2}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-camera-left={-40}
        shadow-camera-right={40}
        shadow-camera-top={40}
        shadow-camera-bottom={-40}
        shadow-bias={-0.0004}
      />

      {/* Neon rim glow near the core: violet + azure. */}
      <pointLight position={[0, 3, -9]} color="#8b5cf6" intensity={40} distance={30} decay={2} />
      <pointLight position={[0, 3, -9]} color="#0078d4" intensity={40} distance={30} decay={2} />

      {/* Large reflective ground plane at y=0. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200]} />
        <MeshReflectorMaterial
          color="#0b0f17"
          metalness={0.6}
          roughness={0.4}
          blur={[300, 100]}
          mixStrength={40}
          resolution={1024}
          mirror={0.5}
          depthScale={1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.2}
        />
      </mesh>
    </>
  );
}
