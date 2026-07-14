"use client";

// GLB centerpieces (helmet + boombox) with procedural fallback. Each model is
// wrapped in Suspense (handles missing/loading) AND an error boundary (handles
// parse/decode failures) so an absent file degrades gracefully instead of
// crashing the whole R3F tree. Renders inside the existing Canvas.

import { Component, Suspense, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { Group } from "three";

// ponytail: preload is a nice-to-have; guard so a missing file can't throw here.
try {
  useGLTF.preload("/experience/helmet.glb");
  useGLTF.preload("/experience/boombox.glb");
} catch {
  /* asset absent — fallback handles it */
}

// Minimal error boundary: renders `fallback` if its child throws (bad/missing GLB).
class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    /* swallow — fallback is the recovery */
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function ProceduralCenterpiece({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: number;
}) {
  const ref = useRef<Group>(null);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.2;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh castShadow>
        <torusKnotGeometry args={[0.7, 0.24, 160, 24]} />
        <meshPhysicalMaterial
          color="#8b5cf6"
          metalness={0.9}
          roughness={0.15}
          clearcoat={1}
          emissive="#4c1d95"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  );
}

function Gltf({
  url,
  position,
  scale,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
}) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(url);
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.15;
  });
  return (
    <group ref={ref} position={position} scale={scale}>
      <primitive object={scene} />
    </group>
  );
}

function Centerpiece({
  url,
  position,
  scale,
  fallbackPosition,
  fallbackScale,
}: {
  url: string;
  position: [number, number, number];
  scale: number;
  fallbackPosition: [number, number, number];
  fallbackScale: number;
}) {
  const fallback = (
    <ProceduralCenterpiece position={fallbackPosition} scale={fallbackScale} />
  );
  return (
    <ModelBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Gltf url={url} position={position} scale={scale} />
      </Suspense>
    </ModelBoundary>
  );
}

export function FetchedModels() {
  return (
    <group>
      <Centerpiece
        url="/experience/helmet.glb"
        position={[0, 3, -6]}
        scale={2}
        fallbackPosition={[0, 3, -6]}
        fallbackScale={2}
      />
      <Centerpiece
        url="/experience/boombox.glb"
        position={[6, 2, -2]}
        scale={40}
        fallbackPosition={[6, 2, -2]}
        fallbackScale={1}
      />
    </group>
  );
}
