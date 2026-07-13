/**
 * Deterministic 3D constellation of cloud-service nodes for the homepage hero.
 *
 * Everything here is a pure function of a fixed seed so the server render and
 * client hydration produce byte-identical geometry (no hydration jump, no
 * Math.random at render time). Layout: golden-spiral sphere for even coverage,
 * biased per-provider so AWS/Azure/GCP form loose clusters — "organized infra".
 */
import { CATALOG, type Provider } from "@/lib/catalog/nodes";

export interface ConstNode {
  id: string;
  provider: Provider;
  icon: string | null;
  label: string;
  /** Position in world space. */
  position: [number, number, number];
  /** Base scale (slight variation so it doesn't look uniform). */
  scale: number;
}

export interface ConstEdge {
  from: number; // index into nodes
  to: number;
  /** Precomputed length so the scene can pace packets without recomputing. */
  length: number;
}

export interface Constellation {
  nodes: ConstNode[];
  edges: ConstEdge[];
  radius: number;
}

/** Deterministic PRNG (mulberry32) — same seed → same sequence everywhere. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cluster centers per provider (spread on X so they read as three regions).
const PROVIDER_CENTER: Record<Provider, [number, number, number]> = {
  aws: [-6, 1.5, 0],
  azure: [6, -1.5, -2],
  gcp: [0, 2.5, 3],
};

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export function buildConstellation(seed = 1337): Constellation {
  const rng = mulberry32(seed);
  const n = CATALOG.length;

  const nodes: ConstNode[] = CATALOG.map((svc, i) => {
    // Fibonacci-sphere point for even distribution.
    const y = 1 - (i / (n - 1)) * 2; // 1 → -1
    const r = Math.sqrt(1 - y * y);
    const theta = GOLDEN_ANGLE * i;
    const sphere: [number, number, number] = [
      Math.cos(theta) * r,
      y,
      Math.sin(theta) * r,
    ];

    // Blend the sphere point toward the provider cluster, plus jitter.
    const c = PROVIDER_CENTER[svc.provider];
    const spread = 5.5;
    const jitter = () => (rng() - 0.5) * 2.2;
    const position: [number, number, number] = [
      c[0] + sphere[0] * spread + jitter(),
      c[1] + sphere[1] * spread + jitter(),
      c[2] + sphere[2] * spread + jitter(),
    ];

    return {
      id: svc.id,
      provider: svc.provider,
      icon: svc.icon,
      label: svc.label,
      position,
      scale: 0.85 + rng() * 0.5,
    };
  });

  // Edges: connect each node to its 2 nearest neighbors (organic mesh), plus a
  // few cross-provider links so the graph reads as one connected system.
  const edges: ConstEdge[] = [];
  const seen = new Set<string>();
  const dist2 = (a: ConstNode, b: ConstNode) =>
    (a.position[0] - b.position[0]) ** 2 +
    (a.position[1] - b.position[1]) ** 2 +
    (a.position[2] - b.position[2]) ** 2;

  const addEdge = (i: number, j: number) => {
    const key = i < j ? `${i}-${j}` : `${j}-${i}`;
    if (i === j || seen.has(key)) return;
    seen.add(key);
    const d = Math.sqrt(dist2(nodes[i], nodes[j]));
    edges.push({ from: i, to: j, length: d });
  };

  nodes.forEach((_, i) => {
    const neighbors = nodes
      .map((_, j) => ({ j, d: dist2(nodes[i], nodes[j]) }))
      .filter((x) => x.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2);
    neighbors.forEach((nb) => addEdge(i, nb.j));
  });

  // A handful of deterministic long-range links for visual interest.
  for (let k = 0; k < 5; k++) {
    addEdge(Math.floor(rng() * n), Math.floor(rng() * n));
  }

  return { nodes, edges, radius: 12 };
}
