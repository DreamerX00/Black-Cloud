"use client";

// Bespoke migration "morph-bridge" scene. Two floating islands (source cloud,
// target cloud) span an energy bridge. Instanced service-packets flow across the
// bridge, MORPHING color from provider-orange (AWS) to provider-blue (GCP) as they
// travel — a literal visual of infrastructure migrating clouds. Time-driven, 60fps,
// additive glow + bloom. All randomness seeded from a constant (no Date/Math.random
// in render → hydration-safe). Reduced-motion / no-webgl users get the SceneShell
// fallback (a static claymorphism panel passed from the page).
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

const AWS = new THREE.Color("#ff9900"); // provider-aws
const GCP = new THREE.Color("#4285f4"); // provider-gcp
const BRIDGE = new THREE.Color("#22d3ee"); // accent-cyan

const PACKETS = 220;
// Deterministic pseudo-random from an index (hydration-safe, no Math.random).
function seeded(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// A floating "island": a clustered cloud of small crystals over a disc base.
function Island({
  position,
  color,
  seed,
}: {
  position: [number, number, number];
  color: THREE.Color;
  seed: number;
}) {
  const crystals = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        p: [
          (seeded(i, seed) - 0.5) * 3.4,
          (seeded(i, seed + 1) - 0.5) * 1.6,
          (seeded(i, seed + 2) - 0.5) * 3.4,
        ] as [number, number, number],
        s: 0.18 + seeded(i, seed + 3) * 0.4,
      })),
    [seed],
  );
  return (
    <Float speed={1.4} rotationIntensity={0.35} floatIntensity={0.9}>
      <group position={position}>
        {/* Disc base */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <cylinderGeometry args={[2.6, 1.4, 0.5, 6]} />
          <meshStandardMaterial
            color={color}
            metalness={0.6}
            roughness={0.35}
            emissive={color}
            emissiveIntensity={0.25}
          />
        </mesh>
        {crystals.map((c, i) => (
          <mesh key={i} position={c.p} scale={c.s}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={color}
              metalness={0.9}
              roughness={0.15}
              emissive={color}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
        {/* Halo core */}
        <Icosahedron args={[0.7, 1]} position={[0, 0.6, 0]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.4}
            metalness={1}
            roughness={0.1}
          />
        </Icosahedron>
      </group>
    </Float>
  );
}

// Instanced packets that arc from the source island to the target island along a
// curved bridge, morphing AWS→GCP color as they cross.
function Packets() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Color(), []);
  const src = useMemo(() => new THREE.Vector3(-6.5, 0.4, 0), []);
  const dst = useMemo(() => new THREE.Vector3(6.5, 0.4, 0), []);

  // Per-packet seeds: phase offset, lateral lane, speed jitter.
  const packets = useMemo(
    () =>
      Array.from({ length: PACKETS }, (_, i) => ({
        offset: seeded(i, 0),
        lane: (seeded(i, 1) - 0.5) * 2.4,
        rise: (seeded(i, 2) - 0.5) * 1.2,
        speed: 0.06 + seeded(i, 3) * 0.05,
        scale: 0.06 + seeded(i, 4) * 0.12,
      })),
    [],
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < PACKETS; i++) {
      const pk = packets[i];
      // travel progress 0→1, wraps
      const prog = (t * pk.speed + pk.offset) % 1;
      // arc: lerp x/z, parabolic y hump for the bridge span
      const x = THREE.MathUtils.lerp(src.x, dst.x, prog);
      const z = THREE.MathUtils.lerp(src.z, dst.z, prog) + pk.lane;
      const hump = Math.sin(prog * Math.PI) * 2.6;
      const y = THREE.MathUtils.lerp(src.y, dst.y, prog) + hump + pk.rise;
      dummy.position.set(x, y, z);
      const pulse = pk.scale * (0.7 + Math.sin(t * 4 + i) * 0.3);
      dummy.scale.setScalar(pulse);
      dummy.rotation.set(t + i, t * 0.7 + i, 0);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      // morph AWS→GCP, flaring cyan mid-bridge
      const flare = Math.sin(prog * Math.PI); // 0 at ends, 1 mid
      tmp.copy(AWS).lerp(GCP, prog).lerp(BRIDGE, flare * 0.55);
      mesh.setColorAt(i, tmp);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, PACKETS]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        emissive="#ffffff"
        emissiveIntensity={0.6}
        toneMapped={false}
        metalness={0.4}
        roughness={0.3}
      />
    </instancedMesh>
  );
}

// The energy bridge itself — a translucent glowing tube arc between islands.
function Bridge() {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-6.5, 0.4, 0),
      new THREE.Vector3(-3, 1.8, 0),
      new THREE.Vector3(0, 2.6, 0),
      new THREE.Vector3(3, 1.8, 0),
      new THREE.Vector3(6.5, 0.4, 0),
    ]);
  }, []);
  const ref = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state) => {
    if (ref.current)
      ref.current.emissiveIntensity = 0.7 + Math.sin(state.clock.elapsedTime * 2) * 0.3;
  });
  return (
    <mesh>
      <tubeGeometry args={[curve, 80, 0.09, 12, false]} />
      <meshStandardMaterial
        ref={ref}
        color={BRIDGE}
        emissive={BRIDGE}
        emissiveIntensity={0.8}
        transparent
        opacity={0.55}
        toneMapped={false}
      />
    </mesh>
  );
}

function Rig() {
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.15) * 1.6;
    state.camera.position.y = 3.2 + Math.sin(t * 0.2) * 0.4;
    state.camera.lookAt(0, 1.2, 0);
  });
  return null;
}

export default function MigrationScene({ fallback }: { fallback?: React.ReactNode }) {
  return (
    <SceneShell
      camera={{ position: [0, 3.2, 15], fov: 48 }}
      keyColor="#22d3ee"
      fillColor="#ff9900"
      stars={2600}
      fallback={fallback}
    >
      <Rig />
      <Island position={[-6.5, 0.4, 0]} color={AWS} seed={11} />
      <Island position={[6.5, 0.4, 0]} color={GCP} seed={37} />
      <Bridge />
      <Packets />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.55} intensity={1.35} radius={0.72} />
      </EffectComposer>
    </SceneShell>
  );
}
