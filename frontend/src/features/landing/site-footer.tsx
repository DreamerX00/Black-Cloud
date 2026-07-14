import Link from "next/link";
import { PROVIDER_META } from "@/lib/nodes/registry";

/**
 * Site footer — agency-tier composition.
 *
 * Five columns: wordmark + tagline (2 wide), Product, Providers, Resources,
 * Legal. Followed by a full-bleed footer wordmark reveal (big display type
 * that fills the strip below).
 */

const PRODUCT = [
  { label: "Playground", href: "#playground" },
  { label: "Features", href: "#bento" },
  { label: "Pricing", href: "#pricing" },
  { label: "Changelog", href: "/changelog" },
];

const RESOURCES = [
  { label: "Docs", href: "/docs" },
  { label: "API", href: "/docs/api" },
  { label: "Blog", href: "/blog" },
  { label: "Status", href: "https://status.blackcloud.io" },
];

const LEGAL = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "DPA", href: "/dpa" },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border/60 bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-16 tablet:grid-cols-6 tablet:px-10 tablet:py-20">
        <div className="tablet:col-span-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
            <span aria-hidden className="text-xl">⚫</span>
            BlackCloud
          </div>
          <p className="max-w-sm text-sm text-muted-foreground">
            Multi-cloud architecture, reimagined. Design, validate, and export
            infrastructure diagrams — right in the browser.
          </p>

          {/* Social row — placeholder handles; icons are inline SVG so no extra dep */}
          <div className="mt-4 flex items-center gap-3">
            <FooterSocial href="https://github.com/blackcloud" label="GitHub">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.45-1.11-1.45-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.93.84.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </FooterSocial>
            <FooterSocial href="https://x.com/blackcloud" label="X">
              <path d="M18.244 2H21l-6.53 7.46L22 22h-6.844l-4.83-6.315L4.6 22H1.844l6.985-7.98L2 2h6.984l4.362 5.77L18.244 2Zm-1.2 18.35h1.72L7.03 3.55H5.19l11.855 16.8Z" />
            </FooterSocial>
            <FooterSocial href="https://linkedin.com/company/blackcloud" label="LinkedIn">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8h4.51v14H.24V8Zm7.7 0h4.33v2.12h.07c.6-1.14 2.08-2.35 4.29-2.35 4.6 0 5.44 3.03 5.44 6.97V22h-4.51v-6.34c0-1.51-.03-3.45-2.1-3.45-2.1 0-2.43 1.65-2.43 3.35V22H7.94V8Z" />
            </FooterSocial>
          </div>
        </div>

        <FooterCol title="Product" items={PRODUCT} />
        <FooterCol
          title="Providers"
          items={(["aws", "azure", "gcp"] as const).map((p) => ({
            label: PROVIDER_META[p].label,
            href: `#providers`,
            meta: `${PROVIDER_META[p].count}`,
            accent: PROVIDER_META[p].accent,
          }))}
        />
        <FooterCol title="Resources" items={RESOURCES} />
        <FooterCol title="Legal" items={LEGAL} />
      </div>

      <div className="border-t border-border/40">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs text-muted-foreground tablet:flex-row tablet:px-10">
          <p>© BlackCloud · Multi-cloud architecture, reimagined.</p>
          <p>Built with Next.js 16 · React 19 · Three.js · Motion</p>
        </div>
      </div>

      {/* Big wordmark strip — used as a signature at the end of the page. */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden border-t border-border/30 py-8"
      >
        <div className="text-center font-display text-[18vw] font-semibold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.08)] tablet:text-[14vw]">
          BLACKCLOUD
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; href: string; meta?: string; accent?: string }>;
}) {
  return (
    <div>
      <h3 className="mb-3 text-xs uppercase tracking-widest text-muted-foreground">
        {title}
      </h3>
      <ul className="space-y-1.5 text-sm">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
              {it.accent && (
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: it.accent }}
                />
              )}
              {it.label}
              {it.meta && (
                <span className="ml-auto text-xs text-muted-foreground/70">
                  {it.meta}
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterSocial({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border/50 bg-graphite/30 text-muted-foreground transition-colors hover:border-border hover:text-foreground"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}
