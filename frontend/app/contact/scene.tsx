"use client";

// Bespoke contact scene: a SIGNAL-BEACON. A pulsing clay transmitter core sits in
// the void, breathing violet↔cyan and driving the bloom. Concentric rings of light
// expand outward from it on a loop (staggered phases) like a broadcast. A field of
// instanced particles is drawn inward toward the beacon — each orbits and slowly
// spirals in, then respawns at its outer radius, so the beacon looks like it is
// pulling signal from deep space. Fully deterministic (hashed from index — no
// Math.random / Date in render paths, SSR-safe), 60fps via a single InstancedMesh.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Color,
  Matrix4,
  Quaternion,
  Vector3,
  type Group,
  type InstancedMesh,
  type Mesh,
  type MeshStandardMaterial,
} from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash — SSR-stable (matches pricing/reactor-core pattern).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const VIOLET = new Color("#8b5cf6");
const CYAN = new Color("#22d3ee");

// ── Beacon core ──────────────────────────────────────────────────────────────
function Beacon() {
  const mat = useRef<MeshStandardMaterial>(null);
  const mesh = useRef<Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) mesh.current.rotation.y = t * 0.3;
    if (mat.current) {
      const m = (Math.sin(t * 0.9) + 1) / 2;
      mat.current.emissive.copy(VIOLET).lerp(CYAN, m);
      mat.current.emissiveIntensity = 1.8 + Math.sin(t * 2.2) * 0.7;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshStandardMaterial
          ref={mat}
          color="#a855f7"
          emissive="#8b5cf6"
          emissiveIntensity={2}
          roughness={0.25}
          metalness={0.15}
        />
      </mesh>
    </Float>
  );
}

// ── Expanding broadcast rings ────────────────────────────────────────────────
const RING_COUNT = 5;
const RING_PERIOD = 4; // seconds per full expansion
const RING_MAX = 9;

function Rings() {
  const refs = useRef<(Mesh | null)[]>([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    for (let i = 0; i < RING_COUNT; i++) {
      const m = refs.current[i];
      if (!m) continue;
      // Staggered phase per ring; loops 0→1 in radius, fading as it expands.
      const phase = ((t / RING_PERIOD) + i / RING_COUNT) % 1;
      const r = 1 + phase * RING_MAX;
      m.scale.setScalar(r);
      const mat = m.material as MeshStandardMaterial;
      mat.opacity = (1 - phase) * 0.55;
    }
  });
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {Array.from({ length: RING_COUNT }, (_, i) => (
        <mesh key={i} ref={(el) => { refs.current[i] = el; }}>
          <torusGeometry args={[1, 0.022, 8, 96]} />
          <meshStandardMaterial
            color="#22d3ee"
            emissive="#22d3ee"
            emissiveIntensity={2.5}
            transparent
            opacity={0.4}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

// ── Inbound signal particles (single InstancedMesh) ──────────────────────────
const P_COUNT = 260;
const P = Array.from({ length: P_COUNT }, (_, i) => ({
  radius: 4 + frac(i) * 8, // spawn ring
  theta: frac(i + 7) * Math.PI * 2, // azimuth
  phi: (frac(i + 13) - 0.5) * 1.1, // vertical spread
  speed: 0.35 + frac(i + 19) * 0.7, // inward speed
  offset: frac(i + 23), // phase so they don't all arrive together
  size: 0.03 + frac(i + 29) * 0.06,
}));

function SignalParticles() {
  const ref = useRef<InstancedMesh>(null);
  const { mat4, quat, scaleV, up } = useMemo(
    () => ({ mat4: new Matrix4(), quat: new Quaternion(), scaleV: new Vector3(), up: new Vector3(0, 1, 0) }),
    [],
  );
  const pos = useMemo(() => new Vector3(), []);

  useFrame((state) => {
    const inst = ref.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < P_COUNT; i++) {
      const p = P[i];
      // Progress 0→1 = outer spawn → swallowed by beacon, then respawn.
      const prog = (p.offset + (t * p.speed) / 10) % 1;
      const r = p.radius * (1 - prog) + 0.9 * prog; // ease toward core
      const spin = p.theta + t * 0.25 * p.speed; // spiral while falling
      pos.set(
        Math.cos(spin) * Math.cos(p.phi) * r,
        Math.sin(p.phi) * r,
        Math.sin(spin) * Math.cos(p.phi) * r,
      );
      quat.setFromUnitVectors(up, pos.clone().normalize());
      const s = p.size * (0.5 + (1 - prog) * 0.8); // shrink as it nears core
      scaleV.setScalar(s);
      mat4.compose(pos, quat, scaleV);
      inst.setMatrixAt(i, mat4);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, P_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#c4b5fd"
        emissive="#8b5cf6"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </instancedMesh>
  );
}

function Rig() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    // Slow parallax drift keyed to pointer for depth without disorientation.
    const { x, y } = state.pointer;
    g.rotation.y += (x * 0.25 - g.rotation.y) * 0.03;
    g.rotation.x += (-y * 0.15 - g.rotation.x) * 0.03;
  });
  return (
    <group ref={group}>
      <Beacon />
      <Rings />
      <SignalParticles />
    </group>
  );
}

export default function ContactScene() {
  return (
    <SceneShell
      camera={{ position: [0, 1.5, 13], fov: 55 }}
      keyColor="#22d3ee"
      fillColor="#8b5cf6"
      stars={2800}
      fallback={<StaticFallback />}
    >
      <Rig />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={1.5} radius={0.8} />
        <Vignette eskil={false} offset={0.3} darkness={0.85} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static fallback for reduced-motion / no-WebGL: CSS beacon with radiating rings.
function StaticFallback() {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(50% 45% at 50% 42%, rgba(139,92,246,0.3), transparent 68%), radial-gradient(45% 40% at 65% 62%, rgba(34,211,238,0.22), transparent 70%)",
        }}
      />
      <div className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-cyan/25"
            style={{ width: `${8 + i * 7}rem`, height: `${8 + i * 7}rem`, opacity: 0.5 - i * 0.1 }}
          />
        ))}
        <div className="clay size-24 rounded-full bg-gradient-to-br from-accent-violet/40 to-accent-cyan/40 shadow-[0_0_70px_rgba(139,92,246,0.55)]" />
      </div>
    </div>
  );
}
