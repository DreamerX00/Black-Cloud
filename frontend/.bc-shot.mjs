import { chromium } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

function findChromium() {
  const base = join(homedir(), ".cache/ms-playwright");
  if (existsSync(base)) for (const d of readdirSync(base)) if (d.startsWith("chromium-")) { const p = join(base, d, "chrome-linux/chrome"); if (existsSync(p)) return p; }
  return "/usr/bin/google-chrome";
}

const ROUTES = process.argv.slice(2);
const BASE = "http://localhost:3000";
const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox", "--use-gl=swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
for (const route of ROUTES) {
  const page = await ctx.newPage();
  try {
    // networkidle so client components hydrate+paint before capture; domcontentloaded
    // fires pre-hydration on App Router client pages and catches a blank frame.
    await page.goto(BASE + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2500);
    const safe = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
    await page.screenshot({ path: `/tmp/bc-shots/full_${safe}.png`, fullPage: true });
    console.log(`shot ${route}`);
  } catch (e) { console.log(`ERR ${route} :: ${e.message}`); }
  await page.close();
}
await ctx.close();
await browser.close();
