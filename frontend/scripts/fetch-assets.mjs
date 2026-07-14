// Build-time asset fetch for the cinematic 3D experience.
// Downloads license-clear GLB models + a Poly Haven HDRI into public/experience/.
// Network-tolerant: any failure is logged and skipped; the scene falls back to
// procedural geometry when a file is missing. Run: node scripts/fetch-assets.mjs
import { mkdir, writeFile, access } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "public/experience");

// CC0 (Poly Haven) + Khronos CC-BY sample assets. Direct, versioned URLs.
const KHRONOS =
  "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Assets/main/Models";
const ASSETS = [
  { name: "helmet.glb", url: `${KHRONOS}/DamagedHelmet/glTF-Binary/DamagedHelmet.glb`, credit: "DamagedHelmet — Khronos glTF Sample Assets (CC-BY 4.0)" },
  { name: "boombox.glb", url: `${KHRONOS}/BoomBox/glTF-Binary/BoomBox.glb`, credit: "BoomBox — Khronos glTF Sample Assets (CC0)" },
  { name: "env.hdr", url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/dikhololo_night_2k.hdr", credit: "dikhololo_night HDRI — Poly Haven (CC0)" },
];

async function exists(p) {
  try { await access(p); return true; } catch { return false; }
}

async function download(asset) {
  const dest = path.join(OUT, asset.name);
  if (await exists(dest)) {
    console.log(`✓ ${asset.name} already present, skipping`);
    return { ...asset, ok: true };
  }
  try {
    const res = await fetch(asset.url, { redirect: "follow" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
    console.log(`✓ downloaded ${asset.name}`);
    return { ...asset, ok: true };
  } catch (err) {
    console.warn(`✗ ${asset.name} failed (${err.message}) — scene will use procedural fallback`);
    return { ...asset, ok: false };
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const results = [];
  for (const a of ASSETS) results.push(await download(a));

  const credits =
    "# Experience assets — credits & licenses\n\n" +
    results.map((r) => `- ${r.name}: ${r.credit}${r.ok ? "" : " (NOT downloaded — using procedural fallback)"}`).join("\n") +
    "\n";
  await writeFile(path.join(OUT, "CREDITS.md"), credits);

  const okCount = results.filter((r) => r.ok).length;
  console.log(`\nDone: ${okCount}/${results.length} assets available in public/experience/`);
}

main();
