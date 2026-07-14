"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NODE_REGISTRY, PROVIDER_META } from "@/lib/nodes/registry";

/**
 * WebGL globe with orbiting service nodes.
 *
 * Composition:
 *   - Central wireframe icosphere (the "network core")
 *   - Three inclined orbit rings (AWS / Azure / GCP), each populated with
 *     real registry nodes as glowing chips
 *   - Pulsing connection arcs between nodes on different rings
 *   - Ambient star sparkle billboard
 *
 * Camera slowly orbits. Reduced motion is honored by the caller via a
 * conditional render — nothing inside the scene checks it, so the shader
 * pipeline stays hot when it does mount.
 */

const PROVIDER_ORBITS: Record<
  "aws" | "azure" | "gcp",
  { radius: number; tilt: number; color: string }
> = {
  aws: { radius: 3.2, tilt: 0.1, color: PROVIDER_META.aws.accent },
  azure: { radius: 4.1, tilt: 0.55, color: PROVIDER_META.azure.accent },
  gcp: { radius: 5.0, tilt: -0.35, color: PROVIDER_META.gcp.accent },
};

function Core() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_s, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.12;
      ref.current.rotation.x += dt * 0.03;
    }
  });
  return (
    <group ref={ref}>
      <mesh>
        <icosahedronGeometry args={[1.6, 2]} />
        <meshBasicMaterial color="#8B5CF6" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color="#4285F4" wireframe transparent opacity={0.18} />
      </mesh>
      {/* Glow sphere */}
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#8B5CF6" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function OrbitRing({
  radius,
  tilt,
  color,
  count = 64,
}: {
  radius: number;
  tilt: number;
  color: string;
  count?: number;
}) {
  const geom = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= count; i++) {
      const a = (i / count) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(a) * radius,
          Math.sin(a) * radius * Math.sin(tilt),
          Math.sin(a) * radius * Math.cos(tilt),
        ),
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius, tilt, count]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={0.25} />
    </line>
  );
}

function OrbitingChip({
  radius,
  tilt,
  angleOffset,
  speed,
  color,
}: {
  radius: number;
  tilt: number;
  angleOffset: number;
  speed: number;
  color: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const a = clock.elapsedTime * speed + angleOffset;
    ref.current.position.set(
      Math.cos(a) * radius,
      Math.sin(a) * radius * Math.sin(tilt),
      Math.sin(a) * radius * Math.cos(tilt),
    );
    ref.current.lookAt(0, 0, 0);
  });
  return (
    <mesh ref={ref}>
      <boxGeometry args={[0.28, 0.28, 0.04]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

// Deterministic hash — keeps sparkle placement stable across renders
// (React 19's `react-hooks/purity` rule bans Math.random() during render).
function hash(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function Sparkles({ count = 300 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute on a large sphere shell, using a deterministic hash.
      const r = 12 + hash(i, 1) * 8;
      const theta = hash(i, 2) * Math.PI * 2;
      const phi = Math.acos(2 * hash(i, 3) - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);
  return (
    <points>
      <primitive object={geom} attach="geometry" />
      <pointsMaterial color="#EDEDED" size={0.03} transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

function CameraOrbit() {
  // The R3F frame callback owns the camera write — three's mutable-vector
  // ownership is exempt from the immutability rule when the object is
  // pulled from the callback param (not from a hook). Grabbing `camera`
  // via `useFrame`'s state arg is the correct escape hatch.
  useFrame((state) => {
    const t = state.clock.elapsedTime * 0.08;
    const r = 11;
    state.camera.position.set(Math.cos(t) * r, 2.2 + Math.sin(t * 0.6) * 0.4, Math.sin(t) * r);
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function GlobeScene() {
  // Group registry entries by provider — first N of each ride their ring.
  const byProvider = useMemo(() => {
    return {
      aws: NODE_REGISTRY.filter((n) => n.provider === "aws").slice(0, 10),
      azure: NODE_REGISTRY.filter((n) => n.provider === "azure").slice(0, 5),
      gcp: NODE_REGISTRY.filter((n) => n.provider === "gcp").slice(0, 5),
    };
  }, []);

  return (
    <Canvas
      camera={{ position: [11, 2, 0], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <CameraOrbit />
      <ambientLight intensity={0.4} />

      <Core />

      {(Object.keys(PROVIDER_ORBITS) as Array<keyof typeof PROVIDER_ORBITS>).map((p) => {
        const orbit = PROVIDER_ORBITS[p];
        const nodes = byProvider[p];
        return (
          <group key={p}>
            <OrbitRing radius={orbit.radius} tilt={orbit.tilt} color={orbit.color} />
            {nodes.map((_, i) => (
              <OrbitingChip
                key={`${p}-${i}`}
                radius={orbit.radius}
                tilt={orbit.tilt}
                angleOffset={(i / nodes.length) * Math.PI * 2}
                speed={0.12 + (p === "aws" ? 0 : p === "azure" ? 0.04 : 0.08)}
                color={orbit.color}
              />
            ))}
          </group>
        );
      })}

      <Sparkles />
    </Canvas>
  );
}
