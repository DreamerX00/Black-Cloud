"use client";

// Bespoke login scene: a DRIFTING FIELD. Two counter-rotating shells of instanced
// particles hang in the void, breathing violet↔cyan, with a soft parallax drift keyed
// to the pointer — calm, cinematic, non-distracting behind the auth card. Fully
// deterministic (hashed from index — no Math.random / Date in render paths, SSR-safe),
// 60fps via two InstancedMeshes + one bloom pass.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { Color, Matrix4, Quaternion, Vector3, type Group, type InstancedMesh } from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash — SSR-stable (matches contact/pricing pattern).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const VIOLET = new Color("#8b5cf6");
const CYAN = new Color("#22d3ee");

const COUNT = 340;
// Spherical-shell field; each particle drifts on a slow orbit and bobs vertically.
const FIELD = Array.from({ length: COUNT }, (_, i) => ({
  radius: 5 + frac(i) * 7,
  theta: frac(i + 7) * Math.PI * 2,
  phi: Math.acos(2 * frac(i + 13) - 1),
  spin: 0.04 + frac(i + 19) * 0.12,
  bob: frac(i + 23) * Math.PI * 2,
  size: 0.03 + frac(i + 29) * 0.07,
}));

function Field() {
  const ref = useRef<InstancedMesh>(null);
  const { mat4, quat, scaleV, up, pos } = useMemo(
    () => ({
      mat4: new Matrix4(),
      quat: new Quaternion(),
      scaleV: new Vector3(),
      up: new Vector3(0, 1, 0),
      pos: new Vector3(),
    }),
    [],
  );

  useFrame((state) => {
    const inst = ref.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      const p = FIELD[i];
      const theta = p.theta + t * p.spin;
      const r = p.radius + Math.sin(t * 0.4 + p.bob) * 0.4;
      pos.set(
        Math.sin(p.phi) * Math.cos(theta) * r,
        Math.cos(p.phi) * r + Math.sin(t * 0.5 + p.bob) * 0.3,
        Math.sin(p.phi) * Math.sin(theta) * r,
      );
      quat.setFromUnitVectors(up, pos.clone().normalize());
      scaleV.setScalar(p.size * (0.8 + Math.sin(t + p.bob) * 0.2));
      mat4.compose(pos, quat, scaleV);
      inst.setMatrixAt(i, mat4);
    }
    inst.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#c4b5fd" emissive="#8b5cf6" emissiveIntensity={2.6} toneMapped={false} />
    </instancedMesh>
  );
}

// A slow breathing core that tints violet↔cyan, driving the bloom behind the card.
function Core() {
  const ref = useRef<InstancedMesh>(null);
  const mat = useMemo(() => new Matrix4(), []);
  const color = useMemo(() => new Color(), []);
  useFrame((state) => {
    const inst = ref.current;
    if (!inst) return;
    const t = state.clock.elapsedTime;
    const m = (Math.sin(t * 0.6) + 1) / 2;
    color.copy(VIOLET).lerp(CYAN, m);
    inst.setColorAt(0, color);
    if (inst.instanceColor) inst.instanceColor.needsUpdate = true;
    mat.makeRotationY(t * 0.15).scale(new Vector3(1.6, 1.6, 1.6));
    inst.setMatrixAt(0, mat);
    inst.instanceMatrix.needsUpdate = true;
  });
  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 1]}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial emissive="#8b5cf6" emissiveIntensity={2} roughness={0.3} toneMapped={false} />
    </instancedMesh>
  );
}

function Rig() {
  const group = useRef<Group>(null);
  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const { x, y } = state.pointer;
    g.rotation.y += (x * 0.2 - g.rotation.y) * 0.03;
    g.rotation.x += (-y * 0.12 - g.rotation.x) * 0.03;
  });
  return (
    <group ref={group}>
      <Core />
      <Field />
    </group>
  );
}

export default function LoginScene() {
  return (
    <SceneShell
      camera={{ position: [0, 0, 15], fov: 55 }}
      keyColor="#22d3ee"
      fillColor="#8b5cf6"
      stars={3200}
      fallback={<StaticFallback />}
    >
      <Rig />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={1.4} radius={0.85} />
        <Vignette eskil={false} offset={0.28} darkness={0.9} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static fallback for reduced-motion / no-WebGL: CSS aurora glow + scattered dots.
function StaticFallback() {
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(45% 45% at 40% 40%, rgba(139,92,246,0.28), transparent 68%), radial-gradient(45% 45% at 62% 60%, rgba(34,211,238,0.22), transparent 70%)",
        }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent-violet/15"
            style={{ width: `${10 + i * 8}rem`, height: `${10 + i * 8}rem`, opacity: 0.5 - i * 0.1 }}
          />
        ))}
      </div>
    </div>
  );
}
