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
const browser = await chromium.launch({ executablePath: findChromium(), args: ["--no-sandbox", "--use-gl=swiftshader"] });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
for (const route of ROUTES) {
  const page = await ctx.newPage();
  const errs = [];
  page.on("console", m => { if (m.type() === "error") errs.push(m.text()); });
  page.on("pageerror", e => errs.push("PAGEERROR: " + e.message));
  try {
    await page.goto("http://localhost:3000" + route, { waitUntil: "networkidle", timeout: 30000 });
    await page.waitForTimeout(2500);
    const safe = route === "/" ? "home" : route.replace(/\//g, "_").replace(/^_/, "");
    await page.screenshot({ path: `/tmp/bc-shots/full_${safe}.png`, fullPage: true });
    // measure main content height
    const info = await page.evaluate(() => {
      const main = document.querySelector("main");
      return { bodyH: document.body.scrollHeight, mainH: main?.scrollHeight ?? -1, hasAside: !!document.querySelector("aside"), txtLen: document.body.innerText.length };
    });
    console.log(`${route} :: errs=${errs.length} bodyH=${info.bodyH} mainH=${info.mainH} aside=${info.hasAside} txt=${info.txtLen}`);
    errs.slice(0,5).forEach(e => console.log("   ! " + e.slice(0,160)));
  } catch (e) { console.log(`ERR ${route} :: ${e.message}`); }
  await page.close();
}
await ctx.close(); await browser.close();
