"use client";

// Bespoke /docs scene: a "knowledge constellation" — a slowly rotating 3D field
// of doc-nodes (instanced glowing spheres) wired together by faint lines wherever
// two nodes fall within a linking radius. Calm, cerebral, cyan. Nodes breathe on
// a per-node phase and the whole lattice drifts + rotates. Bloom makes the cores
// bleed. All positions are deterministic (hashed from index — no Math.random /
// Date in the render path, SSR-safe).
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  type Group,
  type InstancedMesh,
  Matrix4,
  Vector3,
} from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash (no Math.random — SSR-stable, matches pricing/reactor pattern).
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const NODE_COUNT = 120;
const LINK_RADIUS = 3.4; // nodes closer than this get wired together
const FIELD = 13; // half-extent of the constellation cube

type Node = {
  base: Vector3;
  scale: number;
  phase: number;
  ampSpeed: number;
};

// Seed the node cloud deterministically.
const NODES: Node[] = Array.from({ length: NODE_COUNT }, (_, i) => ({
  base: new Vector3(
    (frac(i) - 0.5) * FIELD * 2,
    (frac(i + 40) - 0.5) * FIELD * 1.4,
    (frac(i + 80) - 0.5) * FIELD * 2,
  ),
  scale: 0.06 + frac(i + 120) * 0.14,
  phase: frac(i + 160) * Math.PI * 2,
  ampSpeed: 0.4 + frac(i + 200) * 0.9,
}));

// Precompute the link list once (pairs within LINK_RADIUS). Capped so the line
// buffer stays cheap on lower-end GPUs.
const LINKS: [number, number][] = (() => {
  const pairs: [number, number][] = [];
  for (let a = 0; a < NODE_COUNT; a++) {
    for (let b = a + 1; b < NODE_COUNT; b++) {
      if (NODES[a].base.distanceTo(NODES[b].base) < LINK_RADIUS) {
        pairs.push([a, b]);
        if (pairs.length >= 260) return pairs;
      }
    }
  }
  return pairs;
})();

const CYAN = new Color("#22d3ee");
const PALE = new Color("#a5f3fc");

function Constellation() {
  const group = useRef<Group>(null);
  const points = useRef<InstancedMesh>(null);
  const lines = useRef<Group>(null);

  const mat4 = useMemo(() => new Matrix4(), []);
  const live = useMemo(() => NODES.map((n) => n.base.clone()), []);

  // Line geometry: one BufferGeometry with 2 verts per link. Positions get
  // rewritten each frame from the live node positions.
  const lineGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(new Float32Array(LINKS.length * 6), 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Slow whole-field rotation + gentle drift.
    if (group.current) {
      group.current.rotation.y = t * 0.04;
      group.current.rotation.x = Math.sin(t * 0.06) * 0.12;
    }

    // Breathe each node along a per-node phase; update instance matrices.
    const im = points.current;
    if (im) {
      for (let i = 0; i < NODE_COUNT; i++) {
        const n = NODES[i];
        const bob = Math.sin(t * n.ampSpeed + n.phase) * 0.5;
        live[i].set(n.base.x, n.base.y + bob, n.base.z);
        const pulse = n.scale * (1 + Math.sin(t * n.ampSpeed * 1.6 + n.phase) * 0.28);
        mat4.makeScale(pulse, pulse, pulse);
        mat4.setPosition(live[i]);
        im.setMatrixAt(i, mat4);
      }
      im.instanceMatrix.needsUpdate = true;
    }

    // Rewrite link endpoints from live node positions.
    const pos = lineGeo.getAttribute("position") as Float32BufferAttribute;
    for (let k = 0; k < LINKS.length; k++) {
      const [a, b] = LINKS[k];
      pos.setXYZ(k * 2, live[a].x, live[a].y, live[a].z);
      pos.setXYZ(k * 2 + 1, live[b].x, live[b].y, live[b].z);
    }
    pos.needsUpdate = true;
  });

  return (
    <group ref={group}>
      {/* Glowing doc-nodes as one instanced mesh. */}
      <instancedMesh ref={points} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          color={PALE}
          emissive={CYAN}
          emissiveIntensity={2.2}
          roughness={0.3}
          metalness={0.1}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Connective tissue between nearby nodes. */}
      <group ref={lines}>
        <lineSegments geometry={lineGeo}>
          <lineBasicMaterial
            color={CYAN}
            transparent
            opacity={0.18}
            blending={AdditiveBlending}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* Central soft core to seat the bloom. */}
      <mesh scale={2.4}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshStandardMaterial
          color={CYAN}
          emissive={CYAN}
          emissiveIntensity={0.9}
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export default function DocsScene() {
  return (
    <SceneShell
      camera={{ position: [0, 0, 22], fov: 55 }}
      keyColor="#22d3ee"
      fillColor="#38bdf8"
      stars={2200}
      fallback={<StaticFallback />}
    >
      <Constellation />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.4} intensity={1.5} radius={0.8} />
        <Vignette eskil={false} offset={0.32} darkness={0.85} />
      </EffectComposer>
    </SceneShell>
  );
}

// Static fallback for reduced-motion / no-WebGL: a CSS constellation of clay
// nodes over cyan gradients — calm and on-brand without a live canvas.
function StaticFallback() {
  // Deterministic scatter (index-hashed) so SSR and client agree.
  const dots = Array.from({ length: 26 }, (_, i) => ({
    left: frac(i) * 100,
    top: frac(i + 40) * 100,
    size: 4 + frac(i + 80) * 10,
    opacity: 0.25 + frac(i + 120) * 0.5,
  }));
  return (
    <div className="fixed inset-0 -z-0 overflow-hidden bg-background">
      <div
        aria-hidden
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "radial-gradient(55% 50% at 50% 35%, rgba(34,211,238,0.22), transparent 70%), radial-gradient(50% 45% at 80% 70%, rgba(56,189,248,0.16), transparent 70%)",
        }}
      />
      {dots.map((d, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute rounded-full bg-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.6)]"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}
