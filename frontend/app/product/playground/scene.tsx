"use client";

// Bespoke R3F scene for the Cloud Playground marketing page: an infinite dark
// grid-floor with glowing cloud-service nodes that drift and connect via animated
// light-edges — a living architecture blooming into being. Runs inside SceneShell
// (Canvas + IBL + tier gating). All placement is deterministic (seeded from index)
// so SSR/CSR match — no Date.now()/Math.random() in render paths.

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Line } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from "@react-three/postprocessing";
import type { Group, Mesh, ShaderMaterial } from "three";
import { AdditiveBlending, Color, DoubleSide } from "three";
import { CATALOG } from "@/lib/catalog/nodes";
import { SceneShell } from "@/components/canvas/scene-shell";
import { PlaygroundFallback } from "./fallback";

const PROVIDER_HEX: Record<string, string> = {
  aws: "#ff9900",
  azure: "#38bdf8",
  gcp: "#4285f4",
};

// Deterministic hash → [0,1). Stable across builds; replaces Math.random().
function frac(i: number) {
  const s = Math.sin(i * 127.1 + 11.7) * 43758.5453;
  return s - Math.floor(s);
}

// 14 hero nodes drawn from the catalog, scattered across the grid floor.
const NODE_COUNT = 14;
const NODES = Array.from({ length: NODE_COUNT }, (_, i) => {
  const service = CATALOG[(i * 3 + 2) % CATALOG.length];
  const angle = frac(i) * Math.PI * 2;
  const radius = 3.5 + frac(i + 100) * 8;
  return {
    service,
    hex: PROVIDER_HEX[service.provider] ?? "#8b5cf6",
    home: [
      Math.cos(angle) * radius,
      0.9 + frac(i + 300) * 1.6,
      Math.sin(angle) * radius,
    ] as [number, number, number],
    phase: frac(i + 500) * Math.PI * 2,
    drift: 0.35 + frac(i + 700) * 0.5,
    scale: 0.55 + frac(i + 900) * 0.35,
  };
});

// Deterministic edge set: connect each node to a couple of near-ish neighbours.
const EDGES: Array<[number, number]> = [];
for (let i = 0; i < NODE_COUNT; i++) {
  const a = (i + 1) % NODE_COUNT;
  const b = (i + 3) % NODE_COUNT;
  EDGES.push([i, a]);
  if (i % 2 === 0) EDGES.push([i, b]);
}

function ServiceNode({ node }: { node: (typeof NODES)[number] }) {
  const ref = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);

  useFrame((state) => {
    const m = ref.current;
    if (!m) return;
    const t = state.clock.elapsedTime;
    // Gentle drift around its home coordinate — the "living" feel.
    m.position.x = node.home[0] + Math.sin(t * node.drift + node.phase) * 0.35;
    m.position.y = node.home[1] + Math.sin(t * node.drift * 1.3 + node.phase) * 0.25;
    m.position.z = node.home[2] + Math.cos(t * node.drift + node.phase) * 0.35;
    m.rotation.y = t * 0.4 + node.phase;
    m.rotation.x = t * 0.25;
    if (glowRef.current) {
      glowRef.current.position.copy(m.position);
      const pulse = 1 + Math.sin(t * 1.6 + node.phase) * 0.12;
      glowRef.current.scale.setScalar(node.scale * 2.6 * pulse);
    }
  });

  return (
    <group>
      {/* Soft additive halo sprite behind the crystal. */}
      <mesh ref={glowRef} position={node.home}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial
          color={node.hex}
          transparent
          opacity={0.12}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      {/* The service crystal — bloom picks up its emissive. */}
      <mesh ref={ref} position={node.home} scale={node.scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color={node.hex}
          emissive={node.hex}
          emissiveIntensity={2.2}
          metalness={0.4}
          roughness={0.15}
          flatShading
        />
      </mesh>
    </group>
  );
}

// Animated light-edges: a base dim line plus a bright pulse that travels along it.
function LightEdges() {
  const groupRef = useRef<Group>(null);
  const pulseRefs = useRef<(Mesh | null)[]>([]);

  const edges = useMemo(
    () =>
      EDGES.map(([ia, ib], i) => {
        const a = NODES[ia].home;
        const b = NODES[ib].home;
        return {
          a,
          b,
          color: new Color(NODES[ia].hex).lerp(new Color(NODES[ib].hex), 0.5),
          offset: frac(i + 42),
          speed: 0.25 + frac(i + 84) * 0.35,
        };
      }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    edges.forEach((e, i) => {
      const dot = pulseRefs.current[i];
      if (!dot) return;
      const k = (t * e.speed + e.offset) % 1;
      dot.position.set(
        e.a[0] + (e.b[0] - e.a[0]) * k,
        e.a[1] + (e.b[1] - e.a[1]) * k,
        e.a[2] + (e.b[2] - e.a[2]) * k,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {edges.map((e, i) => (
        <group key={i}>
          <Line
            points={[e.a, e.b]}
            color={e.color.getStyle()}
            lineWidth={1}
            transparent
            opacity={0.32}
          />
          {/* Travelling light pulse. */}
          <mesh ref={(el) => void (pulseRefs.current[i] = el)}>
            <sphereGeometry args={[0.09, 10, 10]} />
            <meshBasicMaterial
              color={e.color.getStyle()}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// Infinite scrolling grid-floor built from a shader — cheaper + cleaner than
// gridHelper, and it drifts toward the camera for the "endless canvas" feel.
const gridVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const gridFragment = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec3 uColor;
  float gridLine(vec2 uv, float scale, float width) {
    vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
    float line = min(g.x, g.y);
    return 1.0 - min(line, 1.0);
  }
  void main() {
    vec2 uv = vUv;
    uv.y += uTime * 0.02;
    float g = gridLine(uv, 40.0, 1.0) * 0.5 + gridLine(uv, 8.0, 1.0) * 0.5;
    // Radial fade so the plane dissolves into the void at the horizon.
    float d = distance(vUv, vec2(0.5));
    float fade = smoothstep(0.5, 0.05, d);
    float alpha = g * fade;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor * (0.6 + g), alpha * 0.55);
  }
`;

function GridFloor() {
  const matRef = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new Color("#6366f1") },
    }),
    [],
  );
  useFrame((state) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
      <planeGeometry args={[80, 80]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={gridVertex}
        fragmentShader={gridFragment}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

function Architecture() {
  const groupRef = useRef<Group>(null);
  useFrame((_, dt) => {
    if (groupRef.current) groupRef.current.rotation.y += dt * 0.04;
  });
  return (
    <>
      <GridFloor />
      <group ref={groupRef}>
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
          <LightEdges />
        </Float>
        {NODES.map((node) => (
          <ServiceNode key={`${node.service.provider}-${node.service.id}`} node={node} />
        ))}
      </group>
    </>
  );
}

export default function PlaygroundScene() {
  return (
    <SceneShell
      camera={{ position: [0, 3.2, 15], fov: 52 }}
      keyColor="#38bdf8"
      fillColor="#8b5cf6"
      stars={2600}
      fallback={<PlaygroundFallback />}
    >
      <Architecture />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.55} intensity={1.4} radius={0.75} />
        <ChromaticAberration offset={[0.0005, 0.0005]} />
        <Vignette eskil={false} offset={0.32} darkness={0.82} />
      </EffectComposer>
    </SceneShell>
  );
}
