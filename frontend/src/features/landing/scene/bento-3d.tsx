"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { AwsIcon3D, type AwsIconName } from "./aws-icon-3d";

/**
 * Bento tile 3D snippets — one canvas per tile. All scenes render extruded
 * AWS icons rather than abstract drei primitives, so each tile actually
 * communicates the service it's about.
 *
 * dpr capped at [1, 1.5] and each Canvas is small (<300px) so 4-5 tiles on
 * one screen stay smooth. Reduced-motion is enforced at the caller
 * (BentoScene wrapper).
 */

const SHARED = {
  dpr: [1, 1.5] as [number, number],
  gl: { antialias: true, alpha: true },
  camera: { position: [0, 0, 3.4] as [number, number, number], fov: 45 },
};

function Lights() {
  return (
    <>
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#8B5CF6", "#050505", 0.5]} />
      <directionalLight position={[2, 3, 4]} intensity={0.7} />
      <directionalLight position={[-3, -1, 2]} intensity={0.35} color="#8B5CF6" />
    </>
  );
}

/* ── AI Copilot — Lambda badge with a purple aura ───────────────────────── */

export function CopilotScene3D() {
  return (
    <Canvas {...SHARED}>
      <Lights />
      <Suspense fallback={null}>
        <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.7}>
          <AwsIcon3D name="lambda" size={1.6} depth={0.2} emissiveIntensity={0.25} />
        </Float>
      </Suspense>
      <Sparkles count={15} scale={4} size={0.6} speed={0.3} color="#8B5CF6" />
    </Canvas>
  );
}

/* ── Multi-cloud — three provider-tinted badges in slow rotation ────────── */

function ProviderTrio() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.4;
  });
  // ponytail: reuse ec2 shape for all three, recolored — one SVG parse, three visuals
  const badges: { name: AwsIconName; color: string; pos: [number, number, number] }[] = [
    { name: "ec2", color: "#FF9900", pos: [-0.9, 0.2, 0.4] },
    { name: "lambda", color: "#2563EB", pos: [0, -0.3, -0.2] },
    { name: "s3", color: "#DB4437", pos: [0.9, 0.2, 0.4] },
  ];
  return (
    <group ref={ref}>
      {badges.map((b) => (
        <group key={b.name} position={b.pos}>
          <AwsIcon3D name={b.name} size={0.7} depth={0.12} bgColor={b.color} />
        </group>
      ))}
    </group>
  );
}

export function MultiCloudScene3D() {
  return (
    <Canvas {...SHARED}>
      <Lights />
      <Suspense fallback={null}>
        <ProviderTrio />
      </Suspense>
      <Sparkles count={12} scale={4} size={0.6} speed={0.25} color="#FF9900" />
    </Canvas>
  );
}

/* ── Validation — Shield badge with a green success ring ────────────────── */

function ValidationCore() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame((_s, dt) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += dt * 0.6;
    }
  });
  return (
    <>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.5}>
        <AwsIcon3D name="shield" size={1.4} depth={0.18} bgColor="#22C55E" />
      </Float>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.025, 8, 64]} />
        <meshBasicMaterial color="#22C55E" transparent opacity={0.6} />
      </mesh>
    </>
  );
}

export function ValidationScene3D() {
  return (
    <Canvas {...SHARED}>
      <Lights />
      <Suspense fallback={null}>
        <ValidationCore />
      </Suspense>
      <Sparkles count={15} scale={4} size={0.6} speed={0.3} color="#22C55E" />
    </Canvas>
  );
}

/* ── Drag & drop — EC2 badge sweeping across the tile ───────────────────── */

function DraggingBadge() {
  const ref = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * 0.6;
    ref.current.position.x = Math.sin(t) * 1.2;
    ref.current.position.y = Math.cos(t * 0.7) * 0.5;
    ref.current.rotation.y = t * 0.6;
  });
  return (
    <group ref={ref}>
      <AwsIcon3D name="ec2" size={1} depth={0.14} />
    </group>
  );
}

export function DragScene3D() {
  return (
    <Canvas {...SHARED}>
      <Lights />
      <Suspense fallback={null}>
        <DraggingBadge />
      </Suspense>
      <Sparkles count={12} scale={4} size={0.6} speed={0.2} />
    </Canvas>
  );
}
