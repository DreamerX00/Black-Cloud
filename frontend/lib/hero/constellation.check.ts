/**
 * Runnable check for the constellation layout.
 * Run: bun run lib/hero/constellation.check.ts
 *
 * The load-bearing invariant is DETERMINISM: SSR and client must agree, so the
 * same seed must yield byte-identical geometry. Also checks connectivity/no self-loops.
 */
import { buildConstellation } from "./constellation";
import { CATALOG } from "@/lib/catalog/nodes";

const assert = (c: boolean, m: string) => {
  if (!c) {
    console.error("FAIL:", m);
    process.exit(1);
  }
};

const a = buildConstellation(1337);
const b = buildConstellation(1337);

// Determinism: identical serialization for identical seed.
assert(JSON.stringify(a) === JSON.stringify(b), "same seed must be deterministic");

// Different seed → different layout (sanity that the seed actually matters).
const c = buildConstellation(9999);
assert(JSON.stringify(a) !== JSON.stringify(c), "different seed should differ");

// One node per catalog entry.
assert(a.nodes.length === CATALOG.length, "node count matches catalog");

// No self-loops, valid indices.
for (const e of a.edges) {
  assert(e.from !== e.to, "no self-loop");
  assert(e.from >= 0 && e.from < a.nodes.length, "from index valid");
  assert(e.to >= 0 && e.to < a.nodes.length, "to index valid");
  assert(e.length > 0, "edge length positive");
}

// Connectivity: every node has at least one edge (nearest-neighbor guarantees this).
const degree = new Array(a.nodes.length).fill(0);
a.edges.forEach((e) => {
  degree[e.from]++;
  degree[e.to]++;
});
assert(degree.every((d) => d > 0), "every node connected");

// No NaN positions.
assert(
  a.nodes.every((n) => n.position.every((v) => Number.isFinite(v))),
  "positions finite",
);

console.log(
  `OK — ${a.nodes.length} nodes, ${a.edges.length} edges, deterministic.`,
);
