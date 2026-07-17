"use client";

// Bespoke signup scene: a "blooming constellation" — nodes on a slowly rotating
// shell drift outward and pulse, wired by faint lines, evoking a network taking
// shape as you join. Distinct from login's scene. Reduced-motion / no-webgl get
// the static fallback from the page.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// ponytail: seeded PRNG — Math.random is blocked in this env and would break SSR.
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COUNT = 46;

function Constellation() {
  const group = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const rnd = mulberry32(0xc0ffee);
    return Array.from({ length: COUNT }, () => {
      // Fibonacci-ish spread on a shell with jittered radius.
      const r = 3.4 + rnd() * 3.6;
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      return {
        pos: new THREE.Vector3(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta) * 0.7,
          r * Math.cos(phi),
        ),
        s: 0.05 + rnd() * 0.13,
        hue: rnd(),
        speed: 0.4 + rnd() * 0.9,
      };
    });
  }, []);

  // Wire nearby nodes into a sparse constellation.
  const lineGeom = useMemo(() => {
    const pts: number[] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].pos.distanceTo(nodes[j].pos) < 2.6) {
          pts.push(...nodes[i].pos.toArray(), ...nodes[j].pos.toArray());
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, [nodes]);

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * 0.06;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lineGeom}>
        <lineBasicMaterial color="#8b5cf6" transparent opacity={0.16} />
      </lineSegments>
      {nodes.map((n, i) => (
        <Float key={i} speed={n.speed} floatIntensity={0.6} rotationIntensity={0.2}>
          <mesh position={n.pos}>
            <icosahedronGeometry args={[n.s, 1]} />
            <meshStandardMaterial
              color={n.hue > 0.5 ? "#22d3ee" : "#a78bfa"}
              emissive={n.hue > 0.5 ? "#22d3ee" : "#8b5cf6"}
              emissiveIntensity={1.4}
              roughness={0.25}
              metalness={0.1}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export default function SignupScene() {
  return (
    <SceneShell
      camera={{ position: [0, 0, 13], fov: 55 }}
      keyColor="#22d3ee"
      fillColor="#8b5cf6"
      stars={3000}
    >
      <Constellation />
    </SceneShell>
  );
}
