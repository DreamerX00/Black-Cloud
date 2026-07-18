"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/use-reduced-motion";

/* ── Types ───────────────────────────────────────────────────────── */

interface StarFieldProps {
  /** 0-1, controls star density. Default 0.6 */
  intensity?: number;
  /** Primary tint color. Default violet #8B5CF6 */
  color?: string;
  /** Enable mouse parallax camera shift. Default true */
  interactive?: boolean;
}

/* ── Constants ───────────────────────────────────────────────────── */

const VIOLET = "#8B5CF6";
const CYAN = "#06B6D4";
const DEEP_PURPLE = "#4C1D95";

/* ── Main star layer ─────────────────────────────────────────────── */

function StarPoints({
  count,
  color,
  size,
  radius,
}: {
  count: number;
  color: string;
  size: number;
  radius: number;
}) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    // ponytail: maath/random gives us a typed Float32Array sphere distribution
    const pos = new Float32Array(count * 3);
    random.inSphere(pos, { radius });
    return pos;
  }, [count, radius]);

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.85}
      />
    </Points>
  );
}

/* ── Nebula cloud — a single soft transparent blob ───────────────── */

function NebulaCloud({
  position,
  color,
  scale,
}: {
  position: [number, number, number];
  color: string;
  scale: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <icosahedronGeometry args={[1, 4]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.025}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* ── Ambient dust particles ──────────────────────────────────────── */

function DustParticles({ count }: { count: number }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    random.inSphere(pos, { radius: 8 });
    return pos;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    // Gentle upward drift
    ref.current.rotation.y += delta * 0.02;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={CYAN}
        size={0.008}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.4}
      />
    </Points>
  );
}

/* ── Orchestrator ────────────────────────────────────────────────── */

export default function StarField({
  intensity = 0.6,
  color = VIOLET,
  interactive = true,
}: StarFieldProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const reducedMotion = useReducedMotion();
  const { pointer } = useThree();

  // Scale counts by intensity (0-1)
  const starCount = Math.floor(3000 * intensity);
  const dustCount = Math.floor(500 * intensity);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Gentle auto-rotation
    if (!reducedMotion) {
      groupRef.current.rotation.y += delta * 0.015;
      groupRef.current.rotation.x += delta * 0.005;
    }

    // Mouse parallax — subtle camera-group shift
    if (interactive && !reducedMotion) {
      const targetX = pointer.x * 0.3;
      const targetY = pointer.y * 0.15;
      // ponytail: lerp towards target, don't snap
      groupRef.current.rotation.x +=
        (targetY - groupRef.current.rotation.x) * 0.01;
      groupRef.current.position.x +=
        (targetX - groupRef.current.position.x) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary star layer */}
      <StarPoints count={starCount} color={color} size={0.015} radius={12} />

      {/* Dimmer background stars */}
      <StarPoints
        count={Math.floor(starCount * 0.6)}
        color="#ffffff"
        size={0.008}
        radius={18}
      />

      {/* Nebula clouds — very subtle colored blobs */}
      <NebulaCloud position={[-4, 2, -8]} color={VIOLET} scale={5} />
      <NebulaCloud position={[5, -1, -10]} color={CYAN} scale={4} />
      <NebulaCloud position={[0, -3, -6]} color={DEEP_PURPLE} scale={6} />

      {/* Ambient dust */}
      <DustParticles count={dustCount} />
    </group>
  );
}
