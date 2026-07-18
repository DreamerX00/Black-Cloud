// Walks every route, screenshots each, and reports console errors.
// Output: /tmp/audit/<route>.png and /tmp/audit/report.json
import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "fs";

const ROUTES = [
  "/",
  "/manifesto",
  "/mascots",
  "/pricing",
  "/blog",
  "/blog/why-blackcloud",
  "/changelog",
  "/docs",
  "/docs/getting-started",
  "/product/cloud-playground",
  "/product/ai-architect",
  "/product/migration-ground",
  "/product/failure-simulator",
  "/product/cost-simulator",
  "/product/time-machine",
  "/product/architecture-intelligence",
  "/login",
  "/signup",
  "/forgot",
  "/onboarding",
  "/dashboard",
  "/projects",
  "/projects/new",
  "/projects/demo",
  "/playground",
  "/playground/demo",
  "/migration",
  "/ai-architect",
  "/simulator",
  "/cost",
  "/time-machine",
  "/health-score",
  "/settings",
  "/settings/profile",
  "/settings/team",
  "/settings/billing",
  "/settings/api-keys",
  "/settings/notifications",
  "/settings/integrations",
  "/settings/security",
];

const OUT = "/tmp/audit";
mkdirSync(OUT, { recursive: true });

const report: Record<string, {
  status: number | null;
  errors: string[];
  ms: number;
}> = {};

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

for (const route of ROUTES) {
  const errors: string[] = [];
  page.removeAllListeners("pageerror");
  page.removeAllListeners("console");
  page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(`console.error: ${msg.text().slice(0, 300)}`);
  });

  const t0 = Date.now();
  let status: number | null = null;
  try {
    const resp = await page.goto(`http://localhost:${process.env.AUDIT_PORT ?? 3000}${route}`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    status = resp?.status() ?? null;
    await page.waitForTimeout(600);
  } catch (e) {
    errors.push(`nav: ${(e as Error).message.slice(0, 200)}`);
  }
  const ms = Date.now() - t0;

  const safe = route === "/" ? "_home" : route.replace(/\//g, "_").replace(/^_/, "");
  try {
    await page.screenshot({ path: `${OUT}/${safe}.png`, fullPage: true });
  } catch (e) {
    errors.push(`screenshot: ${(e as Error).message.slice(0, 200)}`);
  }

  report[route] = { status, errors, ms };
  const badge = status === 200 && errors.length === 0 ? "✓" : status === 200 ? "!" : "✗";
  console.log(`${badge} ${status ?? "?"} ${ms}ms ${route}${errors.length ? ` (${errors.length} err)` : ""}`);
}

writeFileSync(`${OUT}/report.json`, JSON.stringify(report, null, 2));
await browser.close();

const totals = Object.values(report);
const ok = totals.filter((r) => r.status === 200 && r.errors.length === 0).length;
const warn = totals.filter((r) => r.status === 200 && r.errors.length > 0).length;
const fail = totals.filter((r) => r.status !== 200).length;
console.log(`\nSUMMARY  ok=${ok} warn=${warn} fail=${fail} total=${totals.length}`);
