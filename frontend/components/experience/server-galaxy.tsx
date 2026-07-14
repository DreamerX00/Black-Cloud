"use client";

// Spiral galaxy of the 23 cloud services as glowing node-orbs around the core,
// plus deterministic instanced "server rack" boxes as background set-dressing.
// Renders inside the existing experience Canvas.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { CATALOG, PROVIDER_META } from "@/lib/catalog/nodes";
import { useExperience } from "@/components/experience/store";

const PROVIDER_HEX: Record<keyof typeof PROVIDER_META, string> = {
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

// Precompute static spiral placement (independent of frame).
const NODES = CATALOG.map((service, i) => {
  const angle = i * 2.4;
  const radius = 4 + i * 0.6;
  return {
    service,
    hex: PROVIDER_HEX[service.provider],
    x: Math.cos(angle) * radius,
    baseY: Math.sin(i * 0.5) * 2 + 2,
    z: Math.sin(angle) * radius,
  };
});

function ServiceOrb({ node, index }: { node: (typeof NODES)[number]; index: number }) {
  const meshRef = useRef<Mesh>(null);
  const hovered = useRef(false);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    mesh.position.y = node.baseY + Math.sin(t + index) * 0.15;
    // Smoothly ease scale toward hover target.
    const target = hovered.current ? 1.4 : 1;
    mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * 0.15);
  });

  return (
    <mesh
      ref={meshRef}
      position={[node.x, node.baseY, node.z]}
      onPointerOver={(e) => {
        e.stopPropagation();
        hovered.current = true;
        useExperience.getState().setFocusedService(node.service.id);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hovered.current = false;
        useExperience.getState().setFocusedService(null);
        document.body.style.cursor = "auto";
      }}
    >
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial
        color={node.hex}
        emissive={node.hex}
        emissiveIntensity={1.6}
        metalness={0.3}
        roughness={0.2}
      />
    </mesh>
  );
}

// Deterministic hash so rack layout is stable across builds (no Math.random).
function frac(i: number) {
  const s = Math.sin(i * 127.1) * 43758.5453;
  return s - Math.floor(s);
}

const RACK_COUNT = 120;

function ServerRacks() {
  const racks = useMemo(
    () =>
      Array.from({ length: RACK_COUNT }, (_, i) => {
        const angle = frac(i) * Math.PI * 2;
        const radius = 12 + frac(i + 1000) * 14; // 12..26
        return {
          position: [
            Math.cos(angle) * radius,
            frac(i + 500) * 1.5,
            Math.sin(angle) * radius,
          ] as [number, number, number],
          rotY: frac(i + 2000) * Math.PI * 2,
        };
      }),
    [],
  );

  return (
    <Instances limit={RACK_COUNT} range={RACK_COUNT}>
      <boxGeometry args={[0.6, 2.5, 0.6]} />
      <meshStandardMaterial
        color="#161b22"
        metalness={0.8}
        roughness={0.35}
        emissive="#8b5cf6"
        emissiveIntensity={0.08}
      />
      {racks.map((r, i) => (
        <Instance key={i} position={r.position} rotation={[0, r.rotY, 0]} />
      ))}
    </Instances>
  );
}

export function ServerGalaxy() {
  const groupRef = useRef<Group>(null);

  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.03;
  });

  return (
    <group ref={groupRef}>
      {NODES.map((node, i) => (
        <ServiceOrb key={node.service.id} node={node} index={i} />
      ))}
      <ServerRacks />
    </group>
  );
}
