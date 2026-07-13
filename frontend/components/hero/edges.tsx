"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Constellation } from "@/lib/hero/constellation";

/**
 * Glowing network edges + GPU-animated data packets.
 *
 * Edges: one LineSegments, additive-blended, faint. Packets: one Points cloud
 * where each point rides an edge; its world position is computed in the vertex
 * shader from a per-point offset + global time (single draw call for all motion).
 */

const PACKETS_PER_EDGE = 2;

export function Edges({ constellation }: { constellation: Constellation }) {
  const { nodes, edges } = constellation;

  // ── Static line geometry ──────────────────────────────────────
  const lineGeo = useMemo(() => {
    const positions = new Float32Array(edges.length * 6);
    edges.forEach((e, i) => {
      const a = nodes[e.from].position;
      const b = nodes[e.to].position;
      positions.set([...a, ...b], i * 6);
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, [nodes, edges]);

  // ── Packet geometry: for each packet, store its edge endpoints + phase ──
  const { packetGeo, material } = useMemo(() => {
    const count = edges.length * PACKETS_PER_EDGE;
    const aStart = new Float32Array(count * 3);
    const aEnd = new Float32Array(count * 3);
    const aPhase = new Float32Array(count);
    const aSpeed = new Float32Array(count);

    let p = 0;
    edges.forEach((e) => {
      const a = nodes[e.from].position;
      const b = nodes[e.to].position;
      for (let k = 0; k < PACKETS_PER_EDGE; k++) {
        aStart.set(a, p * 3);
        aEnd.set(b, p * 3);
        aPhase[p] = (k / PACKETS_PER_EDGE + e.length * 0.13) % 1;
        // longer edges → slightly slower, so speed reads as constant world velocity
        aSpeed[p] = 0.25 + 0.15 / Math.max(e.length, 1);
        p++;
      }
    });

    const g = new THREE.BufferGeometry();
    // dummy position attr (required); real position computed in shader
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aStart", new THREE.BufferAttribute(aStart, 3));
    g.setAttribute("aEnd", new THREE.BufferAttribute(aEnd, 3));
    g.setAttribute("aPhase", new THREE.BufferAttribute(aPhase, 1));
    g.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeed, 1));

    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#8b5cf6") },
        uSize: { value: 34 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aStart;
        attribute vec3 aEnd;
        attribute float aPhase;
        attribute float aSpeed;
        uniform float uTime;
        uniform float uSize;
        varying float vGlow;
        void main() {
          float t = fract(aPhase + uTime * aSpeed);
          vec3 pos = mix(aStart, aEnd, t);
          // brighter mid-flight, fades at the ends
          vGlow = sin(t * 3.14159);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * vGlow / -mv.z;
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor;
        varying float vGlow;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          float alpha = smoothstep(0.5, 0.0, d) * vGlow;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
    });

    return { packetGeo: g, material: mat };
  }, [nodes, edges]);

  const matRef = useRef(material);
  useFrame((state) => {
    matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <group>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color="#2b3444"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
      <points geometry={packetGeo} material={material} />
    </group>
  );
}
