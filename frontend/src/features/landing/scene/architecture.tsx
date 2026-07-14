"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";
import { NODE_REGISTRY, PROVIDER_META } from "@/lib/nodes/registry";
import { AwsIcon3D, type AwsIconName } from "./aws-icon-3d";
import { NebulaPlane } from "./nebula";

/** Registry `id` → AWS icon file. Missing entries fall back to a plain card. */
const ICON_MAP: Record<string, AwsIconName> = {
  "aws.ec2": "ec2",
  "aws.lambda": "lambda",
  "aws.s3": "s3",
  "aws.rds": "rds",
  "aws.dynamodb": "dynamodb",
  "aws.aurora": "aurora",
  "aws.alb": "elb",
  "aws.nlb": "elb",
  "aws.cloudfront": "cloudfront",
  "aws.route53": "route53",
  "aws.ecs": "fargate",
  "aws.fargate": "fargate",
  "aws.apigw": "apigw",
  "aws.api-gateway": "apigw",
  "aws.shield": "shield",
  "aws.waf": "waf",
};

/**
 * Architecture 3D scene — "walk through the graph".
 *
 * Real nodes from the registry placed in a stylised depth layout:
 *   compute in the mid-plane, storage behind, edge/CDN in front, DBs low.
 *
 * Camera responds to pointer position (parallax with soft damping) and
 * idles with a slow orbit so it never feels dead. Edges draw between
 * neighbouring nodes on the same plane. Text labels ride billboards so
 * they always face the camera.
 */

interface Placed {
  id: string;
  label: string;
  accent: string;
  pos: THREE.Vector3;
}

/** Category → z-plane. Puts compute in the middle, DBs behind, CDN in front. */
const PLANE_Z: Record<string, number> = {
  compute: 0,
  container: 0,
  serverless: 0.5,
  networking: 1,
  "load-balancer": 1,
  cdn: 1.5,
  dns: 1.5,
  database: -1,
  storage: -1.5,
};

// Deterministic hash — Math.random() is banned at render time by the
// React 19 purity rule; a stable pseudo-noise on the node index keeps
// placement varied but reproducible.
function jitter(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (x - Math.floor(x)) - 0.5;
}

function placeNodes(): Placed[] {
  // Take a curated slice — 12 nodes gives a rich field without murdering fps.
  const pick = NODE_REGISTRY.slice(0, 12);
  return pick.map((n, i) => {
    const zPlane = PLANE_Z[n.category] ?? 0;
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = (col - 1.5) * 1.9 + (row % 2 ? 0.4 : -0.4);
    const y = (1 - row) * 1.6;
    return {
      id: n.id,
      label: n.label,
      accent: n.accent,
      pos: new THREE.Vector3(x, y, zPlane + jitter(i, 7) * 0.6),
    };
  });
}

function EdgeLine({ from, to, color }: { from: THREE.Vector3; to: THREE.Vector3; color: string }) {
  const geom = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([from, to]);
    return g;
  }, [from, to]);
  return (
    <line>
      <primitive object={geom} attach="geometry" />
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </line>
  );
}

function Packet({
  from,
  to,
  color,
  phase,
}: {
  from: THREE.Vector3;
  to: THREE.Vector3;
  color: string;
  phase: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = ((clock.elapsedTime * 0.4 + phase) % 1);
    ref.current.position.lerpVectors(from, to, t);
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 12, 12]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}

function NodeChip({ node }: { node: Placed }) {
  const icon = ICON_MAP[node.id];
  return (
    <group position={node.pos}>
      {/* Glow ring — sits behind the icon (negative z), sized to frame it (icon
          is size=0.7, so outer radius 0.55 leaves a visible halo). depthWrite
          off stops z-fighting with the extruded icon in front. */}
      <mesh position={[0, 0, -0.05]}>
        <ringGeometry args={[0.46, 0.55, 32]} />
        <meshBasicMaterial
          color={node.accent}
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {icon ? (
        <Suspense fallback={null}>
          <AwsIcon3D name={icon} size={0.7} depth={0.1} />
        </Suspense>
      ) : (
        // Fallback for non-AWS registry entries (azure/gcp) — plain card.
        <mesh>
          <planeGeometry args={[0.9, 0.36]} />
          <meshBasicMaterial color="#161B22" transparent opacity={0.92} />
        </mesh>
      )}
      <Billboard position={[0, -0.55, 0]}>
        <Text
          fontSize={0.11}
          color="#EDEDED"
          anchorX="center"
          anchorY="middle"
        >
          {node.label}
        </Text>
      </Billboard>
    </group>
  );
}

function CameraRig() {
  const target = useRef(new THREE.Vector2(0, 0));
  const current = useRef(new THREE.Vector2(0, 0));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Pull `camera` from the frame state — R3F's imperative loop owns it, and
  // the purity/immutability rules don't apply to values sourced there.
  useFrame((state, dt) => {
    current.current.lerp(target.current, Math.min(1, dt * 3));
    const t = state.clock.elapsedTime * 0.06;
    state.camera.position.x = current.current.x * 1.6 + Math.sin(t) * 0.3;
    state.camera.position.y = current.current.y * 0.8;
    state.camera.position.z = 5 + Math.cos(t) * 0.25;
    state.camera.lookAt(0, 0, 0);
  });
  return null;
}

export function ArchitectureScene() {
  // Inline arrow so React's `use-memo` rule sees the deps clearly.
  const nodes = useMemo(() => placeNodes(), []);
  // Wire edges: connect each node to its nearest neighbour in the placement.
  const edges = useMemo(() => {
    const out: Array<{ from: THREE.Vector3; to: THREE.Vector3; color: string; phase: number }> = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      out.push({
        from: nodes[i].pos,
        to: nodes[i + 1].pos,
        color: nodes[i].accent,
        phase: (i / nodes.length) * 1,
      });
    }
    // Cross-plane connections for depth interest
    out.push({ from: nodes[0].pos, to: nodes[6].pos, color: PROVIDER_META.aws.accent, phase: 0.2 });
    out.push({ from: nodes[2].pos, to: nodes[9].pos, color: PROVIDER_META.gcp.accent, phase: 0.7 });
    return out;
  }, [nodes]);

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      {/* Nebula backdrop lives inside this same Canvas — the previous version
          stacked a second full-bleed Canvas at opacity-70, doubling the WebGL
          context count for this section. Under swiftshader / driver limits,
          the second context failed silently and the whole act rendered white.
          The nebula plane writes clip-space in its vertex shader, so the host
          camera doesn't matter; renderOrder=-1 + depthTest off keeps it behind. */}
      <NebulaPlane />
      <CameraRig />
      <ambientLight intensity={0.9} />
      <hemisphereLight args={["#8B5CF6", "#050505", 0.5]} />
      <directionalLight position={[3, 4, 5]} intensity={0.7} />
      <directionalLight position={[-4, -2, 3]} intensity={0.4} color="#8B5CF6" />

      {edges.map((e, i) => (
        <EdgeLine key={`e-${i}`} from={e.from} to={e.to} color={e.color} />
      ))}
      {edges.map((e, i) => (
        <Packet key={`p-${i}`} from={e.from} to={e.to} color={e.color} phase={e.phase} />
      ))}
      {nodes.map((n) => (
        <NodeChip key={n.id} node={n} />
      ))}
    </Canvas>
  );
}
