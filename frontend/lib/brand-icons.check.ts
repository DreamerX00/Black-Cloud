// Runnable check: every provider service-icon asset referenced by serviceIconSrc
// must exist on disk. Run from frontend/: bun lib/brand-icons.check.ts
import { existsSync } from "node:fs";
import { join } from "node:path";
import { CATALOG } from "@/lib/catalog/nodes";
import { serviceIconSrc } from "@/lib/brand-icons";

// Checks run from the frontend/ directory (see other *.check.ts).
const publicDir = join(process.cwd(), "public");
let checked = 0;
let missing = 0;

for (const svc of CATALOG) {
  const src = serviceIconSrc(svc.provider, svc.id);
  if (!src) continue; // no asset → renders lucide fallback, fine
  checked++;
  const path = join(publicDir, src);
  if (!existsSync(path)) {
    console.error(`MISSING asset for ${svc.provider}/${svc.id}: ${src}`);
    missing++;
  }
}

if (missing > 0) {
  console.error(`brand-icons.check: ${missing} missing asset(s)`);
  process.exit(1);
}
console.log(`brand-icons.check: OK — ${checked} service-icon assets present`);
