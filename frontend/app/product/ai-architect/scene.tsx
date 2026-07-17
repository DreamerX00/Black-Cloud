"use client";

// Bespoke R3F scene for the AI Architect page: a "neural bloom".
// Thousands of instanced particles breathe between two deterministic states —
// chaos (a scattered sphere cloud) and order (a layered architecture
// constellation lattice) — driven by a slow time-based ease. Violet (--ai)
// energy, pulsing synapse edges between the ordered anchor nodes, bloom.
// All placement is seeded from a deterministic hash (no Math.random / Date) so
// SSR + hydration stay stable and the layout is identical across builds.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

const AI = "#8b5cf6"; // --ai
const CYAN = "#22d3ee";
const PARTICLES = 2600;

// Deterministic hash in [0,1). Seeds all "randomness" — hydration-safe.
function frac(i: number) {
  const s = Math.sin(i * 127.1 + 12.34) * 43758.5453;
  return s - Math.floor(s);
}

type Placed = {
  // chaos endpoint (scattered shell) and order endpoint (lattice node)
  cx: number; cy: number; cz: number;
  ox: number; oy: number; oz: number;
  hue: number;   // 0..1 mix violet->cyan
  speed: number; // per-particle phase speed
  phase: number;
};

// Ordered architecture: 4 stacked tiers (edge / app / data / infra), each a
// ring of nodes — reads as a constellation of a system diagram.
const TIERS = [
  { y: 4.2, r: 3.0, n: 7 },
  { y: 1.4, r: 4.6, n: 11 },
  { y: -1.4, r: 4.6, n: 11 },
  { y: -4.2, r: 3.4, n: 8 },
];

function anchorNodes() {
  const nodes: [number, number, number][] = [];
  TIERS.forEach((tier) => {
    for (let k = 0; k < tier.n; k++) {
      const a = (k / tier.n) * Math.PI * 2;
      nodes.push([Math.cos(a) * tier.r, tier.y, Math.sin(a) * tier.r]);
    }
  });
  return nodes;
}

function build(): { particles: Placed[]; nodes: [number, number, number][] } {
  const nodes = anchorNodes();
  const particles: Placed[] = [];
  for (let i = 0; i < PARTICLES; i++) {
    // chaos: point on a fuzzy sphere shell
    const u = frac(i) * 2 - 1;
    const theta = frac(i + 1000) * Math.PI * 2;
    const rad = 9 + frac(i + 7000) * 4;
    const sxy = Math.sqrt(1 - u * u);
    const cx = Math.cos(theta) * sxy * rad;
    const cy = u * rad;
    const cz = Math.sin(theta) * sxy * rad;

    // order: cluster tightly around one anchor node so the lattice reads clean
    const node = nodes[i % nodes.length];
    const jitter = 0.55;
    const ox = node[0] + (frac(i + 200) - 0.5) * jitter;
    const oy = node[1] + (frac(i + 400) - 0.5) * jitter;
    const oz = node[2] + (frac(i + 600) - 0.5) * jitter;

    particles.push({
      cx, cy, cz, ox, oy, oz,
      hue: frac(i + 3000),
      speed: 0.5 + frac(i + 5000) * 0.8,
      phase: frac(i + 9000) * Math.PI * 2,
    });
  }
  return { particles, nodes };
}

// Global "order" factor: 0 chaos -> 1 formed, breathing on a slow cosine.
function orderAt(t: number) {
  return 0.5 - 0.5 * Math.cos(t * 0.28); // 0..1, period ~22s
}

function Particles() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { particles } = useMemo(() => build(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colored = useRef(false);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    // Set per-instance color once, on the first frame the mesh exists.
    if (!colored.current) {
      const c = new THREE.Color();
      const violet = new THREE.Color(AI);
      const cyan = new THREE.Color(CYAN);
      particles.forEach((p, i) => {
        c.copy(violet).lerp(cyan, p.hue * 0.6);
        mesh.setColorAt(i, c);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      colored.current = true;
    }
    const t = state.clock.elapsedTime;
    const order = orderAt(t);
    // ease so formation snaps into focus near the top of the breath
    const e = order * order * (3 - 2 * order);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      // swirl the chaos endpoint so the unformed state stays alive
      const sw = t * 0.15 * p.speed;
      const cx = p.cx * Math.cos(sw) - p.cz * Math.sin(sw);
      const cz = p.cx * Math.sin(sw) + p.cz * Math.cos(sw);
      const drift = Math.sin(t * p.speed + p.phase) * 0.12;

      dummy.position.set(
        THREE.MathUtils.lerp(cx, p.ox, e) + drift,
        THREE.MathUtils.lerp(p.cy, p.oy, e) + drift,
        THREE.MathUtils.lerp(cz, p.oz, e),
      );
      const s = 0.045 + (1 - e) * 0.02;
      dummy.scale.setScalar(s);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.rotation.y = t * 0.05;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLES]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

// Pulsing synapse edges between the ordered anchor nodes, appearing only as the
// bloom forms. Built as a single LineSegments for cheap 60fps.
function Synapses() {
  const ref = useRef<THREE.LineSegments>(null);
  const matRef = useRef<THREE.LineBasicMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  const geometry = useMemo(() => {
    const { nodes } = build();
    const pts: number[] = [];
    // connect each node to its 2 nearest neighbours -> a lattice of synapses
    nodes.forEach((a, i) => {
      const dists = nodes
        .map((b, j) => ({ j, d: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2 }))
        .filter((x) => x.j !== i)
        .sort((x, y) => x.d - y.d)
        .slice(0, 2);
      dists.forEach(({ j }) => {
        const b = nodes[j];
        pts.push(a[0], a[1], a[2], b[0], b[1], b[2]);
      });
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const order = orderAt(t);
    if (matRef.current) {
      matRef.current.opacity = order * (0.35 + 0.25 * Math.sin(t * 3));
    }
    if (groupRef.current) groupRef.current.rotation.y = t * 0.05;
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={ref} geometry={geometry}>
        <lineBasicMaterial ref={matRef} color={AI} transparent opacity={0} toneMapped={false} />
      </lineSegments>
    </group>
  );
}

function CoreGlow() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const order = orderAt(t);
    if (ref.current) {
      const s = 0.6 + order * 0.5 + Math.sin(t * 2) * 0.05;
      ref.current.scale.setScalar(s);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = 0.15 + order * 0.35;
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.4, 32, 32]} />
      <meshBasicMaterial color={AI} transparent opacity={0.2} toneMapped={false} />
    </mesh>
  );
}

export default function AiArchitectScene() {
  return (
    <SceneShell
      camera={{ position: [0, 0, 17], fov: 52 }}
      keyColor={AI}
      fillColor={CYAN}
      stars={2200}
      fallback={<SceneFallback />}
    >
      <Particles />
      <Synapses />
      <CoreGlow />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.15} intensity={1.5} radius={0.75} />
        <Vignette eskil={false} offset={0.32} darkness={0.82} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static, dependency-free fallback for reduced-motion / no-webgl tiers.
function SceneFallback() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden bg-[#05060a]">
      <div
        className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, color-mix(in oklch, var(--ai) 55%, transparent), transparent 68%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 size-[42vmin] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--accent-cyan) 40%, transparent), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
    </div>
  );
}
