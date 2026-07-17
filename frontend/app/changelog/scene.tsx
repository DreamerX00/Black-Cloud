"use client";

// Bespoke changelog scene: a vertical "data river" — thousands of GPU-instanced
// light particles streaming upward through the void, wrapped around a soft central
// column. Speed/size seeded deterministically per index (no Math.random in render
// paths — SSR-stable). A faint emissive core spine drives the bloom so the stream
// reads as a glowing ribbon of releases flowing forward in time. Static CSS
// fallback for reduced-motion / no-WebGL.
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Color, InstancedMesh, Matrix4, type MeshStandardMaterial, Vector3 } from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash (matches pricing/reactor pattern — SSR-stable).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const COUNT = 900;
const SPAN = 26; // vertical travel distance before a particle wraps to the bottom.

type Particle = {
  radius: number;
  angle: number;
  y0: number;
  speed: number;
  size: number;
  swirl: number;
  warm: boolean; // cyan vs violet tint
};

const PARTICLES: Particle[] = Array.from({ length: COUNT }, (_, i) => ({
  radius: 0.4 + frac(i) * 3.6,
  angle: frac(i + 30) * Math.PI * 2,
  y0: frac(i + 60) * SPAN,
  speed: 1.2 + frac(i + 90) * 2.6,
  size: 0.03 + frac(i + 120) * 0.09,
  swirl: 0.1 + frac(i + 150) * 0.5,
  warm: frac(i + 180) > 0.5,
}));

const VIOLET = new Color("#8b5cf6");
const CYAN = new Color("#22d3ee");
const _m = new Matrix4();
const _v = new Vector3();

function River() {
  const mesh = useRef<InstancedMesh>(null);
  const painted = useRef(false);

  useFrame((state) => {
    const m = mesh.current;
    if (!m) return;
    // Bake per-instance color once, after the mesh mounts (ref is null at render).
    if (!painted.current) {
      for (let i = 0; i < COUNT; i++) m.setColorAt(i, PARTICLES[i].warm ? CYAN : VIOLET);
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
      painted.current = true;
    }
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const p = PARTICLES[i];
      // Rise and wrap: modulo keeps the stream endless and seamless.
      const y = ((p.y0 + t * p.speed) % SPAN) - SPAN / 2;
      const a = p.angle + t * p.swirl;
      // Narrow the river toward the top so it reads as a converging beam.
      const taper = 1 - (y + SPAN / 2) / SPAN / 1.6;
      const r = p.radius * taper;
      _v.set(Math.cos(a) * r, y, Math.sin(a) * r - 3);
      _m.makeScale(p.size, p.size, p.size);
      _m.setPosition(_v);
      m.setMatrixAt(i, _m);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial emissive="#ffffff" emissiveIntensity={2.4} toneMapped={false} color="#ffffff" />
    </instancedMesh>
  );
}

// Soft glowing spine the river wraps around — anchors the bloom.
function Spine() {
  const mat = useRef<MeshStandardMaterial>(null);
  useFrame((state) => {
    if (mat.current) {
      const m = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2;
      mat.current.emissive.copy(VIOLET).lerp(CYAN, m);
      mat.current.emissiveIntensity = 1.1 + Math.sin(state.clock.elapsedTime) * 0.35;
    }
  });
  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
      <mesh position={[0, 0, -3]}>
        <cylinderGeometry args={[0.12, 0.12, SPAN, 16, 1, true]} />
        <meshStandardMaterial ref={mat} emissive="#8b5cf6" emissiveIntensity={1.2} color="#1b1035" toneMapped={false} />
      </mesh>
    </Float>
  );
}

export default function ChangelogScene() {
  return (
    <SceneShell
      camera={{ position: [0, 0, 12], fov: 55 }}
      keyColor="#22d3ee"
      fillColor="#8b5cf6"
      stars={2200}
      fallback={<StaticFallback />}
    >
      <Spine />
      <River />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={1.5} radius={0.8} />
        <Vignette eskil={false} offset={0.3} darkness={0.85} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static fallback for reduced-motion / no-WebGL: a CSS light-stream + glow.
function StaticFallback() {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(40% 60% at 50% 60%, rgba(139,92,246,0.28), transparent 70%), radial-gradient(30% 50% at 50% 20%, rgba(34,211,238,0.22), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-40 -translate-x-1/2 opacity-80 blur-2xl"
        style={{
          background:
            "linear-gradient(to top, transparent, rgba(139,92,246,0.5) 30%, rgba(34,211,238,0.6) 70%, transparent)",
        }}
      />
      <div className="clay absolute inset-y-24 left-1/2 w-1 -translate-x-1/2 rounded-full bg-gradient-to-t from-accent-violet/40 to-accent-cyan/40" />
    </div>
  );
}
