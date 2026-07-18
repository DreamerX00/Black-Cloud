import Link from "next/link";
import { Radio } from "lucide-react";
import { BlackCloudMark } from "../brand/mark";
import { MarqueeStrip } from "../fx/marquee-strip";

// lucide-react v1 dropped brand icons; inline SVG keeps us dep-free.
const Github = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5z"/></svg>
);
const Twitter = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M18.244 2H21.5l-7.5 8.57L23 22h-6.828l-5.34-6.98L4.7 22H1.44l8.02-9.17L1 2h6.914l4.83 6.39L18.244 2zm-1.196 18h1.88L7.06 4H5.06l11.988 16z"/></svg>
);
const Youtube = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.6 12 3.6 12 3.6s-7.6 0-9.4.5A3 3 0 0 0 .5 6.2C0 8 0 12 0 12s0 4 .5 5.8a3 3 0 0 0 2.1 2.1c1.8.5 9.4.5 9.4.5s7.6 0 9.4-.5a3 3 0 0 0 2.1-2.1C24 16 24 12 24 12s0-4-.5-5.8zM9.6 15.6V8.4L15.8 12l-6.2 3.6z"/></svg>
);
const Linkedin = (p: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.44-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/></svg>
);

const columns: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
  {
    title: "Product",
    links: [
      { label: "Cloud Playground", href: "/product/cloud-playground" },
      { label: "AI Architect", href: "/product/ai-architect" },
      { label: "Migration Ground", href: "/product/migration-ground" },
      { label: "Failure Simulator", href: "/product/failure-simulator" },
      { label: "Time Machine", href: "/product/time-machine" },
      { label: "Cost Simulator", href: "/product/cost-simulator" },
      { label: "Architecture Intelligence", href: "/product/architecture-intelligence" },
    ],
  },
  {
    title: "Universe",
    links: [
      { label: "Manifesto", href: "/manifesto" },
      { label: "The Council", href: "/mascots" },
      { label: "Blueprint Exchange", href: "/blueprints" },
      { label: "Cloud Academy", href: "/academy" },
      { label: "Field Notes", href: "/blog" },
      { label: "Changelog", href: "/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
      { label: "Security", href: "/security" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "CLI", href: "/docs/cli" },
      { label: "API", href: "/docs/api" },
      { label: "Status", href: "/status" },
      { label: "Community", href: "/community" },
    ],
  },
];

export function GlobalFooter() {
  return (
    <footer className="relative z-10 mt-32 border-t border-white/5 bg-void/60">
      <MarqueeStrip />

      <div className="section-shell mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-3">
              <BlackCloudMark className="h-8 w-8" />
              <span className="font-display text-2xl font-semibold tracking-tight">BlackCloud</span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-ink-mute">
              Cloud infrastructure is not a diagram. It is a living universe you can
              design, simulate, migrate, and understand — all in the same frame.
            </p>

            <div className="mt-8 flex items-center gap-3">
              {[
                { href: "https://github.com", Icon: Github, label: "GitHub" },
                { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
                { href: "https://linkedin.com", Icon: Linkedin, label: "LinkedIn" },
                { href: "https://youtube.com", Icon: Youtube, label: "YouTube" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  data-cursor="magnet"
                  className="clay-sm inline-flex h-10 w-10 items-center justify-center rounded-full text-ink-dim hover:text-ink"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs text-ink-dim">
              <Radio className="h-3.5 w-3.5 text-success animate-pulse-slow" />
              All systems nominal · v0.1.0
            </div>
          </div>

          {columns.map(col => (
            <div key={col.title} className="md:col-span-2">
              <div className="text-mono-caps text-ink-mute">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-dim transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 border-t border-white/5 pt-8 text-xs text-ink-mute md:grid-cols-3">
          <div>© {new Date().getFullYear()} BlackCloud Labs — Built for the engineers who own the graph.</div>
          <div className="md:text-center">
            <Link href="/privacy" className="hover:text-ink">Privacy</Link>
            <span className="mx-3">·</span>
            <Link href="/terms" className="hover:text-ink">Terms</Link>
            <span className="mx-3">·</span>
            <Link href="/security" className="hover:text-ink">Security</Link>
          </div>
          <div className="font-mono text-[10px] tracking-widest text-ink-faint md:text-right">
            LAT 51.5074 · LNG -0.1278 · REGION eu-west-1
          </div>
        </div>
      </div>
    </footer>
  );
}
