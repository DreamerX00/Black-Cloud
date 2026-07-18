"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ── Types ───────────────────────────────────────────────────────── */

interface FloatingNodesProps {
  /** Number of nodes to render. Default 12 */
  count?: number;
}

/* ── Provider colors ─────────────────────────────────────────────── */

const NODE_COLORS = [
  "#FF9900", // AWS orange
  "#0078D4", // Azure blue
  "#4285F4", // GCP blue
  "#8B5CF6", // Violet primary
  "#06B6D4", // Cyan accent
];

/* ── Node geometry types ─────────────────────────────────────────── */

type GeoType = "box" | "sphere" | "cylinder";

const GEO_TYPES: GeoType[] = ["box", "sphere", "cylinder"];

function NodeGeometry({ type }: { type: GeoType }) {
  switch (type) {
    case "box":
      return <boxGeometry args={[0.15, 0.15, 0.15]} />;
    case "sphere":
      return <sphereGeometry args={[0.09, 12, 12]} />;
    case "cylinder":
      return <cylinderGeometry args={[0.06, 0.06, 0.18, 8]} />;
  }
}

/* ── Single floating node ────────────────────────────────────────── */

interface NodeData {
  position: [number, number, number];
  color: string;
  geo: GeoType;
  speed: number;
  orbitRadius: number;
  orbitOffset: number;
}

function FloatingNode({ data }: { data: NodeData }) {
  const ref = useRef<THREE.Mesh>(null!);
  const reducedMotion = useReducedMotion();

  useFrame((state) => {
    if (!ref.current || reducedMotion) return;
    const t = state.clock.elapsedTime * data.speed + data.orbitOffset;
    // Slow elliptical orbit
    ref.current.position.x = data.position[0] + Math.sin(t) * data.orbitRadius;
    ref.current.position.y =
      data.position[1] + Math.sin(t * 0.7) * data.orbitRadius * 0.5;
    ref.current.position.z = data.position[2] + Math.cos(t) * data.orbitRadius;
    // Gentle spin
    ref.current.rotation.y += 0.005;
    ref.current.rotation.x += 0.003;
  });

  return (
    <mesh ref={ref} position={data.position}>
      <NodeGeometry type={data.geo} />
      <meshStandardMaterial
        color={data.color}
        emissive={data.color}
        emissiveIntensity={0.6}
        transparent
        opacity={0.7}
        toneMapped={false}
      />
    </mesh>
  );
}

/* ── Connection lines between nearby nodes ───────────────────────── */

function ConnectionLines({ nodes }: { nodes: NodeData[] }) {
  // ponytail: connect first N pairs statically, dynamic line updates would need refs per line
  const pairs = useMemo(() => {
    const result: [number, number][] = [];
    for (let i = 0; i < nodes.length && result.length < 6; i++) {
      const j = (i + 1) % nodes.length;
      // Only connect nodes within a reasonable distance
      const dx = nodes[i].position[0] - nodes[j].position[0];
      const dy = nodes[i].position[1] - nodes[j].position[1];
      const dz = nodes[i].position[2] - nodes[j].position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < 6) {
        result.push([i, j]);
      }
    }
    return result;
  }, [nodes]);

  return (
    <>
      {pairs.map(([a, b], idx) => (
        <Line
          key={idx}
          points={[nodes[a].position, nodes[b].position]}
          color="#8B5CF6"
          lineWidth={0.5}
          transparent
          opacity={0.12}
        />
      ))}
    </>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export default function FloatingNodes({ count = 12 }: FloatingNodesProps) {
  const nodes = useMemo<NodeData[]>(() => {
    // Deterministic pseudo-random using simple seed math
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const r = 3 + (i % 3) * 1.5;
      return {
        position: [
          Math.cos(angle) * r,
          ((i % 5) - 2) * 0.8,
          Math.sin(angle) * r - 5,
        ] as [number, number, number],
        color: NODE_COLORS[i % NODE_COLORS.length],
        geo: GEO_TYPES[i % GEO_TYPES.length],
        speed: 0.15 + (i % 4) * 0.05,
        orbitRadius: 0.3 + (i % 3) * 0.15,
        orbitOffset: i * 1.3,
      };
    });
  }, [count]);

  return (
    <group>
      {nodes.map((data, i) => (
        <FloatingNode key={i} data={data} />
      ))}
      <ConnectionLines nodes={nodes} />
    </group>
  );
}
