// frontend/lib/catalog/nodes.check.ts
// Run: bunx tsx lib/catalog/nodes.check.ts
import { CATALOG, PROVIDER_META } from "./nodes";

const assert = (c: boolean, m: string) => { if (!c) throw new Error(`FAIL: ${m}`); };

assert(CATALOG.length === 23, `catalog has 23 services (got ${CATALOG.length})`);
const ids = new Set(CATALOG.map((s) => s.id));
assert(ids.size === 23, "all service ids are unique");
for (const s of CATALOG) {
  assert(!!s.id && !!s.name && !!s.blurb, `service ${s.id} has id/name/blurb`);
  assert(!!PROVIDER_META[s.provider], `service ${s.id} has a known provider`);
}
console.log("OK — 23 unique services, all fields present, providers known.");
