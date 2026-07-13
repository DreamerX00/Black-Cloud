"use client";

import { useMemo, useRef, useState } from "react";
import { Billboard } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Constellation, ConstNode } from "@/lib/hero/constellation";
import type { Provider } from "@/lib/catalog/nodes";

// Provider accent hexes (WebGL can't read CSS vars).
const PROVIDER_HEX: Record<Provider, string> = {
  aws: "#ff9900",
  azure: "#0078d4",
  gcp: "#4285f4",
};

/**
 * Constellation nodes: each is a camera-facing billboard with a glowing halo
 * disc (additive) behind a provider-icon plane. Icons that exist as SVGs load
 * as textures; Azure (no asset) shows a provider-tinted halo only.
 *
 * Textures are loaded lazily per node via a tiny loader hook so a missing/slow
 * asset never blocks the whole scene.
 */

// Soft radial gradient texture for the halo — generated once, reused by all nodes.
function useHaloTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,0.9)");
    g.addColorStop(0.25, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function useIconTexture(url: string | null) {
  const [tex, setTex] = useState<THREE.Texture | null>(null);
  useMemo(() => {
    if (!url) return;
    const loader = new THREE.TextureLoader();
    loader.load(url, (t) => {
      t.colorSpace = THREE.SRGBColorSpace;
      setTex(t);
    });
  }, [url]);
  return tex;
}

function Node({
  node,
  halo,
}: {
  node: ConstNode;
  halo: THREE.Texture;
}) {
  const icon = useIconTexture(node.icon);
  // PROVIDER_META.accentVar is a CSS var reference (unusable in WebGL); use hex.
  const color = useMemo(
    () => new THREE.Color(PROVIDER_HEX[node.provider]),
    [node.provider],
  );

  const ref = useRef<THREE.Group>(null);
  // gentle idle bob so the field feels alive
  const seed = node.position[0] + node.position[1];
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y =
        node.position[1] + Math.sin(state.clock.elapsedTime * 0.6 + seed) * 0.12;
    }
  });

  return (
    <group ref={ref} position={node.position}>
      <Billboard>
        {/* glowing halo */}
        <mesh scale={node.scale * 2.4}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={halo}
            color={color}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            opacity={0.8}
          />
        </mesh>
        {/* icon */}
        {icon && (
          <mesh scale={node.scale}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial map={icon} transparent depthWrite={false} />
          </mesh>
        )}
      </Billboard>
    </group>
  );
}

export function Nodes({ constellation }: { constellation: Constellation }) {
  const halo = useHaloTexture();
  return (
    <group>
      {constellation.nodes.map((n) => (
        <Node key={n.id} node={n} halo={halo} />
      ))}
    </group>
  );
}
