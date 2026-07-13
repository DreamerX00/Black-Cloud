"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Cloud network graph — Vision.md Scene 2/3: the AWS path
 *   Route53 → CloudFront → ALB → ECS → RDS
 * plus a fan of secondary nodes emerging from the primary line.
 *
 * Renders as spheres + lines with animated data packets (small emissive
 * spheres that traverse each edge on a loop). All positions are baked
 * once; only the packet uniform advances per frame.
 */

interface Node {
  pos: [number, number, number];
  color: string;
  primary?: boolean;
}

interface Edge {
  from: number;
  to: number;
  duration: number; // seconds — packet traversal
  offset: number;   // phase offset
}

const AWS_ORANGE = "#FF9900";
const AZURE_BLUE = "#0078D4";
const GCP_BLUE = "#4285F4";
const AI_PURPLE = "#8B5CF6";

// Node layout roughly matches: Route53 (far left, high) →
// CloudFront → ALB (center) → ECS (right center) → RDS (far right, low)
const NODES: Node[] = [
  { pos: [-6, 2, 0], color: AWS_ORANGE, primary: true },   // 0 Route53
  { pos: [-3, 1, 0.5], color: AWS_ORANGE, primary: true }, // 1 CloudFront
  { pos: [0, 0, 0], color: AI_PURPLE, primary: true },     // 2 ALB
  { pos: [3, -0.5, -0.5], color: AWS_ORANGE, primary: true }, // 3 ECS
  { pos: [6, -1.5, 0], color: AWS_ORANGE, primary: true }, // 4 RDS

  // Secondary — Azure & GCP satellites orbiting
  { pos: [-2, 3, -2], color: AZURE_BLUE },  // 5
  { pos: [2, 2.5, -2.5], color: GCP_BLUE }, // 6
  { pos: [-4, -2, 1.5], color: GCP_BLUE },  // 7
  { pos: [4, 2, 1], color: AZURE_BLUE },    // 8
  { pos: [-1, -2.5, 2], color: AZURE_BLUE },// 9
];

const EDGES: Edge[] = [
  { from: 0, to: 1, duration: 2.4, offset: 0 },
  { from: 1, to: 2, duration: 2.2, offset: 0.5 },
  { from: 2, to: 3, duration: 2.0, offset: 1.0 },
  { from: 3, to: 4, duration: 2.4, offset: 1.4 },
  { from: 2, to: 5, duration: 3.0, offset: 0.2 },
  { from: 2, to: 6, duration: 3.2, offset: 1.1 },
  { from: 3, to: 8, duration: 3.6, offset: 0.6 },
  { from: 1, to: 7, duration: 3.8, offset: 1.8 },
  { from: 4, to: 9, duration: 3.4, offset: 0.9 },
];

export function Network() {
  const group = useRef<THREE.Group>(null);
  const packetRefs = useRef<(THREE.Mesh | null)[]>([]);

  // Precompute edge geometry as line segments.
  const linePositions = useMemo(() => {
    const arr = new Float32Array(EDGES.length * 2 * 3);
    EDGES.forEach((e, i) => {
      const a = NODES[e.from].pos;
      const b = NODES[e.to].pos;
      arr[i * 6 + 0] = a[0]; arr[i * 6 + 1] = a[1]; arr[i * 6 + 2] = a[2];
      arr[i * 6 + 3] = b[0]; arr[i * 6 + 4] = b[1]; arr[i * 6 + 5] = b[2];
    });
    return arr;
  }, []);

  useFrame((state) => {
    // Slow drift of the entire graph — parallax feel against the starfield.
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.15;
      group.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.08) * 0.05;
    }

    // Animate packets along their edges.
    EDGES.forEach((e, i) => {
      const packet = packetRefs.current[i];
      if (!packet) return;
      const t = ((state.clock.elapsedTime + e.offset) % e.duration) / e.duration;
      const a = NODES[e.from].pos;
      const b = NODES[e.to].pos;
      packet.position.set(
        a[0] + (b[0] - a[0]) * t,
        a[1] + (b[1] - a[1]) * t,
        a[2] + (b[2] - a[2]) * t,
      );
      // Pulse the packet slightly at edge endpoints.
      const pulse = 1 + Math.sin(t * Math.PI) * 0.4;
      packet.scale.setScalar(pulse);
    });
  });

  return (
    <group ref={group}>
      {/* Edges */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4a5568"
          transparent
          opacity={0.35}
          depthWrite={false}
        />
      </lineSegments>

      {/* Nodes */}
      {NODES.map((n, i) => (
        <mesh key={i} position={n.pos}>
          <sphereGeometry args={[n.primary ? 0.28 : 0.16, 24, 24]} />
          <meshStandardMaterial
            color={n.color}
            emissive={n.color}
            emissiveIntensity={n.primary ? 1.6 : 0.9}
            roughness={0.4}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Traffic packets */}
      {EDGES.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  );
}
