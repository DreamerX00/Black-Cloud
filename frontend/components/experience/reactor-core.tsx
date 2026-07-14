"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import type { Mesh } from "three";

function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

export function ReactorCore() {
  const core = useRef<Mesh>(null);
  useFrame((state) => {
    if (!core.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    core.current.scale.setScalar(pulse);
  });
  return (
    <group position={[0, 2, -9]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.4, 4]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} roughness={0.1} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <RigidBody key={i} colliders="ball" linearDamping={0.6} angularDamping={0.5}
          position={[(frac(i) - 0.5) * 6, (frac(i + 10) - 0.5) * 5 + 2, (frac(i + 20) - 0.5) * 6]}>
          <mesh>
            <dodecahedronGeometry args={[0.18 + frac(i + 30) * 0.15]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.2} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
