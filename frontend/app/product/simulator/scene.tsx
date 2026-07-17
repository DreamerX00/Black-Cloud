"use client";

// Bespoke "failure-storm" scene for the Failure Simulator page. A healthy mesh of
// network nodes grouped into three availability zones. On a deterministic, time-
// driven cycle one AZ FAILS: its nodes go red + dim + jitter, warning rings pulse,
// and animated traffic packets that used to cross the dead zone reroute around it
// to the surviving zones. All motion is seeded from a constant hash (no Math.random
// / Date in render paths) so SSR + hydration stay stable. Runs inside SceneShell,
// with bloom post-processing for the glow. Reduced-motion / no-webgl users never
// mount this — the page passes a static fallback to SceneShell.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { SceneShell } from "@/components/canvas/scene-shell";

// Deterministic hash — SSR-stable, matches the reactor-core/galaxy convention.
function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

const AZ_COUNT = 3;
const NODES_PER_AZ = 10;
// One full storm cycle: healthy → failing AZ → recovery, in seconds.
const CYCLE = 12;
const FAIL_START = 3.5;
const FAIL_END = 9.5;

type Node = {
  az: number;
  pos: THREE.Vector3;
  size: number;
  phase: number;
};

// Zones sit at the corners of a triangle around the origin, each a small cloud.
const ZONE_CENTERS: THREE.Vector3[] = Array.from({ length: AZ_COUNT }, (_, z) => {
  const a = (z / AZ_COUNT) * Math.PI * 2 - Math.PI / 2;
  return new THREE.Vector3(Math.cos(a) * 6.2, (frac(z + 5) - 0.5) * 1.6, Math.sin(a) * 6.2);
});

const NODES: Node[] = [];
for (let z = 0; z < AZ_COUNT; z++) {
  for (let n = 0; n < NODES_PER_AZ; n++) {
    const i = z * NODES_PER_AZ + n;
    const c = ZONE_CENTERS[z];
    NODES.push({
      az: z,
      pos: new THREE.Vector3(
        c.x + (frac(i + 1) - 0.5) * 4.2,
        c.y + (frac(i + 40) - 0.5) * 3.0,
        c.z + (frac(i + 80) - 0.5) * 4.2,
      ),
      size: 0.18 + frac(i + 120) * 0.16,
      phase: frac(i + 200) * Math.PI * 2,
    });
  }
}

// Packets travel between two zones. When their route touches the failing zone we
// detour them through the third (surviving) zone — the visible reroute.
const PACKET_COUNT = 22;
const PACKETS = Array.from({ length: PACKET_COUNT }, (_, i) => {
  const from = Math.floor(frac(i + 3) * AZ_COUNT) % AZ_COUNT;
  let to = Math.floor(frac(i + 17) * AZ_COUNT) % AZ_COUNT;
  if (to === from) to = (to + 1) % AZ_COUNT;
  return {
    from,
    to,
    detour: (3 - from - to + 3) % 3, // the surviving third zone id
    speed: 0.12 + frac(i + 60) * 0.14,
    offset: frac(i + 90),
  };
});

const FAIL_COLOR = new THREE.Color("#ef4444");
const OK_COLOR = new THREE.Color("#22d3ee");
const OK_COLOR_ALT = new THREE.Color("#8b5cf6");
const WARN_COLOR = new THREE.Color("#f59e0b");
const tmpColor = new THREE.Color();
const tmpObj = new THREE.Object3D();

// Quadratic bezier point for a reroute arc through a mid control point.
function bezier(a: THREE.Vector3, ctrl: THREE.Vector3, b: THREE.Vector3, t: number, out: THREE.Vector3) {
  const mt = 1 - t;
  out.set(
    mt * mt * a.x + 2 * mt * t * ctrl.x + t * t * b.x,
    mt * mt * a.y + 2 * mt * t * ctrl.y + t * t * b.y,
    mt * mt * a.z + 2 * mt * t * ctrl.z + t * t * b.z,
  );
  return out;
}

// failingAz for a given cycle-relative time; -1 when healthy.
function failingAzAt(t: number) {
  const c = t % CYCLE;
  if (c < FAIL_START || c > FAIL_END) return -1;
  // Which AZ fails advances each cycle so it's not always the same one.
  return Math.floor(t / CYCLE) % AZ_COUNT;
}

// 0→1 ramp of how "failed" the failing zone currently is (for dim/jitter/warn).
function failIntensityAt(t: number) {
  const c = t % CYCLE;
  if (c < FAIL_START || c > FAIL_END) return 0;
  const span = FAIL_END - FAIL_START;
  const local = (c - FAIL_START) / span;
  // Fast onset, slow recovery.
  return Math.min(1, Math.sin(local * Math.PI) * 1.6);
}

function FailureStorm() {
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const packetsRef = useRef<THREE.InstancedMesh>(null);
  const warnRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Static intra-zone link geometry (healthy mesh wiring).
  const lineGeom = useMemo(() => {
    const pts: number[] = [];
    for (let z = 0; z < AZ_COUNT; z++) {
      for (let n = 0; n < NODES_PER_AZ; n++) {
        const from = NODES[z * NODES_PER_AZ + n];
        const to = NODES[z * NODES_PER_AZ + ((n + 1) % NODES_PER_AZ)];
        pts.push(from.pos.x, from.pos.y, from.pos.z, to.pos.x, to.pos.y, to.pos.z);
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const failAz = failingAzAt(t);
    const intensity = failIntensityAt(t);

    if (groupRef.current) groupRef.current.rotation.y = t * 0.05;

    // --- Nodes ---
    const nm = nodesRef.current;
    if (nm) {
      for (let i = 0; i < NODES.length; i++) {
        const node = NODES[i];
        const dead = node.az === failAz;
        const jitter = dead ? intensity * 0.25 : 0;
        const breathe = 1 + Math.sin(t * 1.6 + node.phase) * 0.08;
        const scale = node.size * breathe * (dead ? 1 - intensity * 0.45 : 1);
        tmpObj.position.set(
          node.pos.x + Math.sin(t * 9 + node.phase) * jitter,
          node.pos.y + Math.cos(t * 11 + node.phase) * jitter,
          node.pos.z,
        );
        tmpObj.scale.setScalar(scale);
        tmpObj.updateMatrix();
        nm.setMatrixAt(i, tmpObj.matrix);

        const base = node.az % 2 === 0 ? OK_COLOR : OK_COLOR_ALT;
        if (dead) {
          tmpColor.copy(base).lerp(FAIL_COLOR, Math.min(1, intensity + 0.2));
          // dim the dead nodes
          tmpColor.multiplyScalar(1 - intensity * 0.55);
        } else {
          tmpColor.copy(base);
        }
        nm.setColorAt(i, tmpColor);
      }
      nm.instanceMatrix.needsUpdate = true;
      if (nm.instanceColor) nm.instanceColor.needsUpdate = true;
    }

    // --- Packets (reroute around the failed AZ) ---
    const pm = packetsRef.current;
    if (pm) {
      for (let i = 0; i < PACKETS.length; i++) {
        const p = PACKETS[i];
        const a = ZONE_CENTERS[p.from];
        const b = ZONE_CENTERS[p.to];
        const local = (t * p.speed + p.offset) % 1;
        // Does this packet's straight path involve the failing zone?
        const touchesFail = failAz === p.from || failAz === p.to;
        // If either endpoint failed, hold packets away (fade small); else reroute
        // packets whose midpoint would pass near the failed zone.
        const midNearFail =
          failAz >= 0 &&
          failAz !== p.from &&
          failAz !== p.to &&
          intensity > 0.05;

        let ctrl: THREE.Vector3;
        if (midNearFail) {
          // Detour arc bulging toward the surviving third zone.
          ctrl = ZONE_CENTERS[p.detour].clone().multiplyScalar(1.35);
        } else {
          ctrl = a.clone().add(b).multiplyScalar(0.5);
          ctrl.y += 2.2;
        }
        bezier(a, ctrl, b, local, tmpObj.position);
        const alive = touchesFail ? 0.15 + (1 - intensity) * 0.85 : 1;
        tmpObj.scale.setScalar(0.12 * alive + 0.02);
        tmpObj.updateMatrix();
        pm.setMatrixAt(i, tmpObj.matrix);

        if (midNearFail) tmpColor.copy(OK_COLOR).lerp(WARN_COLOR, 0.6);
        else if (touchesFail) tmpColor.copy(FAIL_COLOR);
        else tmpColor.copy(OK_COLOR);
        pm.setColorAt(i, tmpColor);
      }
      pm.instanceMatrix.needsUpdate = true;
      if (pm.instanceColor) pm.instanceColor.needsUpdate = true;
    }

    // --- Warning rings over the failing zone ---
    const wg = warnRef.current;
    if (wg) {
      const show = failAz >= 0 && intensity > 0.02;
      wg.visible = show;
      if (show) {
        const c = ZONE_CENTERS[failAz];
        wg.position.set(c.x, c.y, c.z);
        for (let r = 0; r < wg.children.length; r++) {
          const ring = wg.children[r] as THREE.Mesh;
          const pulse = ((t * 0.8 + r / wg.children.length) % 1);
          ring.scale.setScalar(1.2 + pulse * 4.5);
          const mat = ring.material as THREE.MeshBasicMaterial;
          mat.opacity = (1 - pulse) * intensity * 0.9;
        }
      }
    }

    // Wiring dims slightly during a storm.
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = 0.22 - intensity * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef} geometry={lineGeom}>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.22} />
      </lineSegments>

      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODES.length]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial
          emissive="#ffffff"
          emissiveIntensity={1.6}
          roughness={0.25}
          metalness={0.1}
          toneMapped={false}
        />
      </instancedMesh>

      <instancedMesh ref={packetsRef} args={[undefined, undefined, PACKET_COUNT]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial
          emissive="#ffffff"
          emissiveIntensity={3}
          roughness={0.2}
          toneMapped={false}
        />
      </instancedMesh>

      <group ref={warnRef} visible={false} rotation={[Math.PI / 2, 0, 0]}>
        {Array.from({ length: 3 }, (_, i) => (
          <mesh key={i}>
            <ringGeometry args={[0.9, 1, 48]} />
            <meshBasicMaterial
              color="#ef4444"
              transparent
              opacity={0}
              side={THREE.DoubleSide}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function SimulatorScene({ fallback }: { fallback: React.ReactNode }) {
  return (
    <SceneShell
      camera={{ position: [0, 3, 16], fov: 52 }}
      keyColor="#ef4444"
      fillColor="#8b5cf6"
      stars={3000}
      fallback={fallback}
    >
      <FailureStorm />
      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.5} intensity={1.4} radius={0.75} />
        <Vignette eskil={false} offset={0.32} darkness={0.82} />
      </EffectComposer>
    </SceneShell>
  );
}
