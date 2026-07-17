"use client";

// Bespoke /about scene: a slow cinematic drift through a galaxy of servers.
// An instanced mesh scatters hundreds of tiny clay "server" cubes along a
// logarithmic spiral (the brand's compute nebula); a Points cloud paints the
// nebula dust behind them. The whole galaxy slowly rotates and the camera
// breathes in/out on a sine so it feels like drifting through the arm. Bloom
// makes the emissive server cores bleed into a glow. Everything is seeded from
// index via a deterministic hash — no Math.random in render paths (SSR-safe).
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Color,
  MathUtils,
  Object3D,
  type Group,
  type InstancedMesh,
  type PerspectiveCamera,
  type Points,
} from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash (matches the pricing-scene pattern — SSR-stable).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const SERVER_COUNT = 420;
const ARMS = 3;
const VIOLET = new Color("#8b5cf6");
const CYAN = new Color("#22d3ee");
const AI = new Color("#a855f7");
const PALETTE = [VIOLET, CYAN, AI];

type Node = {
  x: number;
  y: number;
  z: number;
  scale: number;
  rot: number;
  color: Color;
  spin: number;
};

// Scatter server cubes along a logarithmic spiral galaxy, thickened toward the
// core. Precomputed once — pure function of index.
function buildNodes(): Node[] {
  const nodes: Node[] = [];
  for (let i = 0; i < SERVER_COUNT; i++) {
    const t = i / SERVER_COUNT;
    const arm = i % ARMS;
    const radius = 1.5 + t * 16;
    // Spiral angle + a little jitter so arms aren't razor-sharp.
    const angle =
      arm * ((Math.PI * 2) / ARMS) + radius * 0.42 + (frac(i) - 0.5) * 0.6;
    const spread = (1 - t) * 0.6 + 0.15; // tighter core, looser edges
    const x = Math.cos(angle) * radius + (frac(i + 11) - 0.5) * radius * spread;
    const z = Math.sin(angle) * radius + (frac(i + 23) - 0.5) * radius * spread;
    const y = (frac(i + 37) - 0.5) * (2.2 + t * 3.5); // disc thickens outward
    nodes.push({
      x,
      y,
      z,
      scale: 0.12 + frac(i + 51) * 0.28,
      rot: frac(i + 67) * Math.PI * 2,
      color: PALETTE[i % PALETTE.length],
      spin: 0.2 + frac(i + 83) * 0.8,
    });
  }
  return nodes;
}

function ServerGalaxy() {
  const mesh = useRef<InstancedMesh>(null);
  const nodes = useMemo(() => buildNodes(), []);
  const dummy = useMemo(() => new Object3D(), []);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      dummy.position.set(n.x, n.y, n.z);
      dummy.rotation.set(n.rot + t * 0.05, n.rot + t * n.spin * 0.15, n.rot);
      dummy.scale.setScalar(n.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (t < 0.05) m.setColorAt(i, n.color);
    }
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor && t < 0.1) m.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, SERVER_COUNT]}>
      {/* Little rounded clay server chassis. */}
      <boxGeometry args={[1, 0.55, 0.7, 2, 2, 2]} />
      <meshStandardMaterial
        vertexColors
        emissive="#7c3aed"
        emissiveIntensity={0.9}
        roughness={0.3}
        metalness={0.15}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

const DUST_COUNT = 900;
// Nebula dust points, scattered in the same disc but softer and wider.
function Nebula() {
  const points = useRef<Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(DUST_COUNT * 3);
    for (let i = 0; i < DUST_COUNT; i++) {
      const t = i / DUST_COUNT;
      const radius = 1 + t * 22;
      const angle = (i % ARMS) * ((Math.PI * 2) / ARMS) + radius * 0.42 + frac(i) * 2.4;
      arr[i * 3] = Math.cos(angle) * radius + (frac(i + 5) - 0.5) * radius * 0.9;
      arr[i * 3 + 1] = (frac(i + 9) - 0.5) * (3 + t * 6);
      arr[i * 3 + 2] = Math.sin(angle) * radius + (frac(i + 13) - 0.5) * radius * 0.9;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (points.current) points.current.rotation.y = state.clock.elapsedTime * 0.02;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.09}
        sizeAttenuation
        color="#a78bfa"
        transparent
        opacity={0.55}
        depthWrite={false}
        toneMapped={false}
      />
    </points>
  );
}

// Rotates the whole galaxy and drifts the camera on a slow sine so the viewer
// glides through the spiral arm.
function Drift({ children }: { children: React.ReactNode }) {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const g = group.current;
    const t = state.clock.elapsedTime;
    if (g) g.rotation.y = t * 0.04;
    const cam = state.camera as PerspectiveCamera;
    cam.position.z = MathUtils.lerp(cam.position.z, 18 + Math.sin(t * 0.15) * 5, 0.05);
    cam.position.y = MathUtils.lerp(cam.position.y, 4 + Math.sin(t * 0.1) * 2, 0.05);
    cam.lookAt(0, 0, 0);
  });
  return <group ref={group}>{children}</group>;
}

export default function AboutScene() {
  return (
    <SceneShell
      camera={{ position: [0, 4, 20], fov: 58 }}
      keyColor="#8b5cf6"
      fillColor="#22d3ee"
      stars={3200}
      fallback={<StaticFallback />}
    >
      <Drift>
        <ServerGalaxy />
        <Nebula />
        {/* A luminous core at the galactic center. */}
        <Float speed={1.2} floatIntensity={0.4} rotationIntensity={0.3}>
          <mesh>
            <icosahedronGeometry args={[1.1, 3]} />
            <meshStandardMaterial
              color="#c4b5fd"
              emissive="#a855f7"
              emissiveIntensity={2.4}
              roughness={0.2}
              toneMapped={false}
            />
          </mesh>
        </Float>
      </Drift>
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={1.5} radius={0.8} />
        <Vignette eskil={false} offset={0.28} darkness={0.85} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static fallback for reduced-motion / no-WebGL: a claymorphism spiral-glow.
function StaticFallback() {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(40% 40% at 50% 45%, rgba(168,85,247,0.35), transparent 70%), radial-gradient(50% 45% at 70% 65%, rgba(34,211,238,0.22), transparent 70%), radial-gradient(45% 40% at 25% 60%, rgba(139,92,246,0.2), transparent 70%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-violet/50 to-accent-cyan/40 blur-2xl" />
      <div className="clay absolute left-1/2 top-1/2 size-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-accent-violet/40 to-accent-cyan/30 shadow-[0_0_80px_rgba(168,85,247,0.5)]" />
    </div>
  );
}
