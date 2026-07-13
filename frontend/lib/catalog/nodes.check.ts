/**
 * Runnable check for the service catalog.
 * Run: bunx tsx lib/catalog/nodes.check.ts   (or: bun run lib/catalog/nodes.check.ts)
 *
 * Verifies: MVP counts, id uniqueness, search behavior, and that every non-null
 * icon path resolves to a real file under public/ (decoded back from URL form).
 */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { CATALOG, searchCatalog, getService } from "./nodes";

const assert = (cond: boolean, msg: string) => {
  if (!cond) {
    console.error("FAIL:", msg);
    process.exit(1);
  }
};

// MVP counts (MVP.md § Node Library)
const byProvider = (p: string) => CATALOG.filter((s) => s.provider === p).length;
assert(byProvider("aws") === 13, `expected 13 AWS, got ${byProvider("aws")}`);
assert(byProvider("azure") === 5, `expected 5 Azure, got ${byProvider("azure")}`);
assert(byProvider("gcp") === 5, `expected 5 GCP, got ${byProvider("gcp")}`);

// Unique ids
assert(new Set(CATALOG.map((s) => s.id)).size === CATALOG.length, "duplicate ids");

// Lookup works
assert(getService("aws-alb")?.label === "ALB", "getService failed");
assert(getService("nope") === undefined, "getService should miss");

// Search
assert(searchCatalog("aws").every((s) => s.provider === "aws"), "search provider");
assert(searchCatalog("database").length >= 3, "search category");
assert(searchCatalog("").length === CATALOG.length, "empty search = all");

// Icon files exist (decode URL back to filesystem path under public/)
const publicDir = join(process.cwd(), "public");
for (const s of CATALOG) {
  if (s.icon === null) continue;
  const rel = s.icon.split("/").filter(Boolean).map(decodeURIComponent).join("/");
  assert(existsSync(join(publicDir, rel)), `missing icon for ${s.id}: ${rel}`);
}

console.log(`OK — ${CATALOG.length} services, all icons resolve.`);
