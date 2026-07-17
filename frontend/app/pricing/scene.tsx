"use client";

// Bespoke pricing scene: three colossal floating clay MONOLITHS in the void,
// one per tier, slowly rotating with a gentle Float bob. The featured (center)
// monolith pulses violet→cyan and drives the bloom. Deterministic particle dust
// drifts around them (no Math.random in render — hashed from index for SSR
// stability). Bloom postprocessing makes the emissive core bleed.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Color, type Group, type Mesh, type MeshStandardMaterial } from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash (no Math.random — SSR-stable, matches reactor-core pattern).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const MONOLITHS = [
  { x: -6.2, scale: 0.85, color: "#8b5cf6", featured: false },
  { x: 0, scale: 1.15, color: "#a855f7", featured: true },
  { x: 6.2, scale: 0.85, color: "#22d3ee", featured: false },
] as const;

const DUST_COUNT = 90;
const DUST = Array.from({ length: DUST_COUNT }, (_, i) => ({
  x: (frac(i) - 0.5) * 22,
  yBase: (frac(i + 30) - 0.5) * 12,
  z: -4 + (frac(i + 60) - 0.5) * 8,
  size: 0.02 + frac(i + 90) * 0.05,
  yAmp: 0.4 + frac(i + 120) * 1.2,
  ySpeed: 0.15 + frac(i + 150) * 0.4,
  phase: frac(i + 180) * Math.PI * 2,
}));

const VIOLET = new Color("#8b5cf6");
const CYAN = new Color("#22d3ee");

function Monolith({
  x,
  scale,
  color,
  featured,
  index,
}: (typeof MONOLITHS)[number] & { index: number }) {
  const mesh = useRef<Mesh>(null);
  const mat = useRef<MeshStandardMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (mesh.current) mesh.current.rotation.y = t * 0.12 + index;
    if (featured && mat.current) {
      // Featured monolith cycles violet↔cyan and breathes its emissive.
      const m = (Math.sin(t * 0.6) + 1) / 2;
      mat.current.emissive.copy(VIOLET).lerp(CYAN, m);
      mat.current.emissiveIntensity = 1.4 + Math.sin(t * 1.4) * 0.5;
    }
  });

  return (
    <Float speed={featured ? 1.4 : 1} rotationIntensity={0.15} floatIntensity={featured ? 0.9 : 0.6}>
      <mesh ref={mesh} position={[x, 0, -2]} scale={scale}>
        {/* Tall clay slab — chamfered box feel via high-poly rounded look. */}
        <boxGeometry args={[2, 6.4, 2, 4, 12, 4]} />
        <meshStandardMaterial
          ref={mat}
          color={color}
          emissive={color}
          emissiveIntensity={featured ? 1.6 : 0.4}
          roughness={featured ? 0.25 : 0.45}
          metalness={0.1}
        />
      </mesh>
    </Float>
  );
}

function Dust() {
  const group = useRef<Group>(null);
  const items = useMemo(() => DUST, []);

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < g.children.length; i++) {
      const d = items[i];
      g.children[i].position.y = d.yBase + Math.sin(t * d.ySpeed + d.phase) * d.yAmp;
    }
  });

  return (
    <group ref={group}>
      {items.map((d, i) => (
        <mesh key={i} position={[d.x, d.yBase, d.z]}>
          <sphereGeometry args={[d.size, 8, 8]} />
          <meshStandardMaterial
            color="#c4b5fd"
            emissive="#8b5cf6"
            emissiveIntensity={2}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export default function PricingScene() {
  return (
    <SceneShell
      camera={{ position: [0, 0, 15], fov: 55 }}
      keyColor="#a855f7"
      fillColor="#22d3ee"
      stars={2600}
      fallback={<StaticFallback />}
    >
      {MONOLITHS.map((m, i) => (
        <Monolith key={i} {...m} index={i} />
      ))}
      <Dust />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.55} intensity={1.4} radius={0.75} />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static fallback for reduced-motion / no-WebGL: claymorphism monoliths in CSS.
function StaticFallback() {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 40%, rgba(168,85,247,0.28), transparent 70%), radial-gradient(50% 40% at 80% 60%, rgba(34,211,238,0.2), transparent 70%)",
        }}
      />
      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-center gap-8">
        <div className="clay h-52 w-16 rounded-2xl opacity-70 sm:h-64" />
        <div className="clay h-72 w-24 rounded-2xl bg-gradient-to-b from-accent-violet/30 to-accent-cyan/30 shadow-[0_0_60px_rgba(168,85,247,0.4)] sm:h-96" />
        <div className="clay h-52 w-16 rounded-2xl opacity-70 sm:h-64" />
      </div>
    </div>
  );
}
