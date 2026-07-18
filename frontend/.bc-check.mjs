import { chromium } from "playwright-core";
import { existsSync } from "node:fs";

// Find an installed chromium from the ms-playwright cache, else system chrome.
import { readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function findChromium() {
  const base = join(homedir(), ".cache/ms-playwright");
  if (existsSync(base)) {
    for (const d of readdirSync(base)) {
      if (d.startsWith("chromium-")) {
        const p = join(base, d, "chrome-linux/chrome");
        if (existsSync(p)) return p;
      }
    }
  }
  return "/usr/bin/google-chrome";
}

const ROUTES = process.argv.slice(2);
const BASE = "http://localhost:3000";
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox", "--use-gl=swiftshader"] });
let anyFail = false;

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  for (const route of ROUTES) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
    page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
    let status = "?";
    try {
      const resp = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 30000 });
      status = resp?.status();
      await page.waitForTimeout(2500); // let R3F/motion settle (networkidle hangs on live canvases)
      const safe = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
      await page.screenshot({ path: `/tmp/bc-shots/${vp.name}_${safe}.png`, fullPage: false });
    } catch (e) {
      errors.push("NAV: " + e.message);
    }
    // Ignore benign 404-favicon and known WebGL swiftshader perf warnings.
    const real = errors.filter((e) => !/favicon|WebGL|SwiftShader|GroupMarkerNotSet|Automatic fallback/i.test(e));
    const ok = status === 200 && real.length === 0;
    if (!ok) anyFail = true;
    console.log(`${ok ? "OK " : "FAIL"} [${vp.name}] ${route} (${status})${real.length ? " :: " + real.slice(0, 3).join(" | ") : ""}`);
    await page.close(); // ponytail: free the tab + its swiftshader GPU ctx so 30 heavy pages don't exhaust one browser
  }
  await ctx.close();
}
await browser.close();
process.exit(anyFail ? 1 : 0);
