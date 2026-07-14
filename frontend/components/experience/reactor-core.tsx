"use client";
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";

// Deterministic hash (no Math.random — SSR-stable, matches galaxy set-dressing).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const DEBRIS_COUNT = 18;

// Debris drifts on cheap useFrame sine motion instead of a physics engine.
// ponytail: rapier's WASM init crashed the whole canvas (v2.2.0 ↔ rapier-wasm
// arg-signature mismatch); decorative rubble does not justify a physics dep.
// Upgrade path: reinstate @react-three/rapier once its WASM init is fixed.
const DEBRIS = Array.from({ length: DEBRIS_COUNT }, (_, i) => ({
  radius: 1.8 + frac(i) * 2.6,
  size: 0.18 + frac(i + 30) * 0.15,
  angle0: frac(i + 20) * Math.PI * 2,
  speed: (0.15 + frac(i + 40) * 0.25) * (frac(i + 50) > 0.5 ? 1 : -1),
  yBase: (frac(i + 10) - 0.5) * 4,
  yAmp: 0.3 + frac(i + 60) * 0.5,
  ySpeed: 0.5 + frac(i + 70),
}));

export function ReactorCore() {
  const core = useRef<Mesh>(null);
  const debris = useRef<Group>(null);
  const meshes = useMemo(() => DEBRIS, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (core.current) {
      const pulse = 1 + Math.sin(t * 2) * 0.08;
      core.current.scale.setScalar(pulse);
    }
    const g = debris.current;
    if (g) {
      for (let i = 0; i < g.children.length; i++) {
        const d = meshes[i];
        const child = g.children[i];
        const a = d.angle0 + t * d.speed;
        child.position.set(
          Math.cos(a) * d.radius,
          d.yBase + Math.sin(t * d.ySpeed + d.angle0) * d.yAmp,
          Math.sin(a) * d.radius,
        );
        child.rotation.x = t * d.speed * 1.5;
        child.rotation.y = t * d.speed;
      }
    }
  });

  return (
    <group position={[0, 2, -9]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.4, 4]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} roughness={0.1} />
      </mesh>
      <group ref={debris}>
        {meshes.map((d, i) => (
          <mesh key={i}>
            <dodecahedronGeometry args={[d.size]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.2} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
