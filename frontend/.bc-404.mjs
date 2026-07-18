import { chromium } from "playwright-core";
import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
function findChromium(){const b=join(homedir(),".cache/ms-playwright");if(existsSync(b))for(const d of readdirSync(b))if(d.startsWith("chromium-")){const p=join(b,d,"chrome-linux/chrome");if(existsSync(p))return p;}return "/usr/bin/google-chrome";}
const browser = await chromium.launch({ executablePath: findChromium(), args:["--no-sandbox","--use-gl=swiftshader"] });
const ctx = await browser.newContext({ viewport:{width:1440,height:900} });
const page = await ctx.newPage();
const errs=[]; page.on("pageerror",e=>errs.push("PAGEERROR: "+e.message));
const r = await page.goto("http://localhost:3000/zzz-still-nope",{waitUntil:"domcontentloaded",timeout:30000});
await page.waitForTimeout(2500);
await page.screenshot({path:"/tmp/bc-shots/desktop_404.png"});
const h1 = await page.locator("h1").first().textContent().catch(()=>null);
console.log("status", r?.status());
console.log("h1:", h1);
console.log("pageerrors:", errs.length ? errs.join(" | ") : "none");
await browser.close();
