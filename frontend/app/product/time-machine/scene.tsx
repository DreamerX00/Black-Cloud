"use client";

// Bespoke R3F scene for Time Machine: ghosted past architecture versions recede
// into depth (one instanced node-topology layer per SNAPSHOT), older layers sit
// further back, fainter and desaturated. A scrubbing light-plane sweeps through
// history driven by the shared scrub store; the "current" layer glows with bloom.
// All positions/colors are seeded from index — no Date/Math.random in render.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  Color,
  InstancedMesh,
  Matrix4,
  Quaternion,
  Vector3,
  AdditiveBlending,
  type Group,
  type Mesh,
} from "three";
import { SceneShell } from "@/components/canvas/scene-shell";
import { SNAPSHOTS } from "@/lib/mock";
import { useScrubStore } from "./scrub-store";

const LAYERS = SNAPSHOTS.length;
const LAYER_GAP = 7; // z-depth between snapshot planes
const NEWEST_Z = 2; // "Current" snapshot sits nearest the camera

// Deterministic pseudo-random from two integer seeds (hydration-safe: no Math.random).
function seeded(a: number, b: number): number {
  const s = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

// Cool→warm palette across history; newest is warm/violet, oldest desaturated blue.
const PALETTE = ["#3b4a6b", "#4c63a6", "#5b8fd6", "#8b5cf6"];

// z position for a layer index (0 = oldest / deepest).
function layerZ(i: number): number {
  return NEWEST_Z - (LAYERS - 1 - i) * LAYER_GAP;
}

function TopologyLayer({ index }: { index: number }) {
  const meshRef = useRef<InstancedMesh>(null);
  const count = SNAPSHOTS[index].nodes;
  const z = layerZ(index);
  const age = (LAYERS - 1 - index) / Math.max(1, LAYERS - 1); // 0 newest → 1 oldest

  // Base color desaturated + darkened with age.
  const baseColor = useMemo(() => {
    const c = new Color(PALETTE[index % PALETTE.length]);
    const hsl = { h: 0, s: 0, l: 0 };
    c.getHSL(hsl);
    c.setHSL(hsl.h, hsl.s * (1 - age * 0.7), hsl.l * (1 - age * 0.35));
    return c;
  }, [index, age]);

  // Static node layout (ring-ish scatter), seeded by (index, node).
  const layout = useMemo(() => {
    const out: { pos: Vector3; scale: number }[] = [];
    for (let n = 0; n < count; n++) {
      const ang = seeded(index + 1, n + 1) * Math.PI * 2;
      const rad = 1.4 + seeded(index + 3, n + 7) * 4.6;
      const y = (seeded(index + 5, n + 11) - 0.5) * 6;
      out.push({
        pos: new Vector3(Math.cos(ang) * rad, y, Math.sin(ang) * rad),
        scale: 0.18 + seeded(index + 9, n + 2) * 0.22,
      });
    }
    return out;
  }, [index, count]);

  const tmpM = useMemo(() => new Matrix4(), []);
  const tmpQ = useMemo(() => new Quaternion(), []);
  const tmpS = useMemo(() => new Vector3(), []);
  const tmpP = useMemo(() => new Vector3(), []);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const scrub = useScrubStore.getState().scrub; // 0..1 across history
    // World-space z of the sweeping light-plane.
    const planeZ = layerZ(0) + scrub * (NEWEST_Z - layerZ(0));
    const nearness = 1 - Math.min(1, Math.abs(z - planeZ) / (LAYER_GAP * 0.9));

    for (let n = 0; n < count; n++) {
      const l = layout[n];
      // Gentle drift so history feels alive, phase seeded per node.
      const drift = Math.sin(t * 0.5 + n * 1.3 + index) * 0.12;
      tmpS.setScalar(l.scale * (1 + nearness * 0.5));
      tmpP.set(l.pos.x, l.pos.y + drift, l.pos.z);
      tmpM.compose(tmpP, tmpQ.identity(), tmpS);
      mesh.setMatrixAt(n, tmpM);
    }
    mesh.instanceMatrix.needsUpdate = true;

    // Emissive lift as the sweep passes this layer.
    const mat = mesh.material as unknown as { emissiveIntensity: number; opacity: number };
    mat.emissiveIntensity = 0.15 + nearness * 2.2;
    mat.opacity = 0.25 + (1 - age) * 0.35 + nearness * 0.4;
  });

  return (
    <group position={[0, 0, z]}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={baseColor}
          emissive={baseColor}
          emissiveIntensity={0.2}
          transparent
          opacity={0.5}
          roughness={0.35}
          metalness={0.4}
        />
      </instancedMesh>
    </group>
  );
}

// The scrubbing light-plane that sweeps through history.
function SweepPlane() {
  const ref = useRef<Mesh>(null);
  useFrame(() => {
    const m = ref.current;
    if (!m) return;
    const scrub = useScrubStore.getState().scrub;
    m.position.z = layerZ(0) + scrub * (NEWEST_Z - layerZ(0));
  });
  return (
    <mesh ref={ref} rotation={[0, 0, 0]}>
      <planeGeometry args={[26, 20]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.06}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function TimeRig() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    // Subtle parallax so depth reads; scrub also nudges the camera along z.
    const scrub = useScrubStore.getState().scrub;
    const t = state.clock.elapsedTime;
    g.rotation.y = Math.sin(t * 0.1) * 0.12;
    state.camera.position.z = 16 - scrub * 4;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      {SNAPSHOTS.map((s, i) => (
        <TopologyLayer key={s.id} index={i} />
      ))}
      <SweepPlane />
    </group>
  );
}

export function TimeMachineFallback() {
  return (
    <div className="absolute inset-0 -z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,color-mix(in_oklch,var(--accent-violet),transparent_55%),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_80%,color-mix(in_oklch,var(--accent-cyan),transparent_70%),transparent_60%)]" />
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-6 opacity-60">
        {SNAPSHOTS.map((s, i) => (
          <div
            key={s.id}
            className="clay flex size-24 flex-col items-center justify-center rounded-2xl"
            style={{ opacity: 0.35 + (i / (SNAPSHOTS.length - 1)) * 0.65 }}
          >
            <span className="font-display text-2xl font-bold text-gradient">{s.nodes}</span>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TimeMachineScene() {
  return (
    <SceneShell
      camera={{ position: [0, 1.5, 16], fov: 55 }}
      keyColor="#8b5cf6"
      fillColor="#22d3ee"
      stars={2600}
      fallback={<TimeMachineFallback />}
    >
      <TimeRig />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.35} intensity={1.4} radius={0.8} />
        <Vignette eskil={false} offset={0.3} darkness={0.9} />
      </EffectComposer>
    </SceneShell>
  );
}
