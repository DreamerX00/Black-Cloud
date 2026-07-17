"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Rss, ArrowUpRight } from "@/components/icons";
import { PROVIDER_META } from "@/lib/nodes/registry";
import { ClayDivider } from "@/components/ui/clay";
import { cn } from "@/lib/utils";

/**
 * Site footer — signature closing statement.
 *
 * Structure:
 *   1. Ambient nebula halo strip (visual bridge from body to footer)
 *   2. 6-col grid: wordmark + tagline (2 wide) / Product / Providers / Resources / Legal
 *   3. Meta row (copyright + stack credits)
 *   4. Full-bleed wordmark reveal — outline-only, ~14vw display type
 *
 * All social/nav rows use claymorphic capsules so the footer stays in the
 * same tactile language as the rest of the site.
 */

const PRODUCT = [
  { label: "Playground", href: "/playground" },
  { label: "Migrate", href: "/migrate" },
  { label: "Simulate", href: "/simulate" },
  { label: "AI Architect", href: "/architect" },
  { label: "Pricing", href: "/pricing" },
  { label: "Changelog", href: "/changelog" },
];

const RESOURCES = [
  { label: "Docs", href: "/docs" },
  { label: "API Reference", href: "/docs/api" },
  { label: "Blueprints", href: "/blueprints" },
  { label: "Blog", href: "/blog" },
  { label: "Status", href: "https://status.blackcloud.io" },
];

const LEGAL = [
  { label: "Terms", href: "/legal/terms" },
  { label: "Privacy", href: "/legal/privacy" },
  { label: "DPA", href: "/legal/dpa" },
  { label: "Security", href: "/legal/security" },
];

export function SiteFooter() {
  return (
    <footer className="relative isolate mt-32 border-t border-white/5">
      {/* Nebula halo — visual bridge from page content into the footer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-gradient-to-b from-transparent via-ai/10 to-transparent blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-20 tablet:grid-cols-6 tablet:px-10">
        {/* Wordmark + tagline */}
        <div className="tablet:col-span-2 flex flex-col gap-5">
          <Link
            href="/"
            data-magnetic
            className="inline-flex items-center gap-2.5 font-display text-xl font-semibold tracking-tight text-ink"
          >
            <span
              aria-hidden
              className={cn(
                "grid place-items-center size-8 rounded-clay-sm",
                "bg-gradient-to-br from-void to-graphite border border-white/10",
                "shadow-clay-2",
              )}
            >
              <span className="size-2.5 rounded-full bg-gradient-to-br from-ai to-azure animate-[pulse-glow_2s_ease-in-out_infinite]" />
            </span>
            Black<span className="text-ai-bright">Cloud</span>
          </Link>

          <p className="max-w-sm text-sm text-ink-muted leading-relaxed">
            The cloud decision intelligence platform. Design, validate,
            simulate, migrate, and govern multi-cloud infrastructure — before
            a single resource exists.
          </p>

          {/* Social row — claymorphic capsules */}
          <div className="mt-2 flex items-center gap-2">
            <FooterSocial href="https://github.com/blackcloud" label="GitHub">
              <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.45-1.11-1.45-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.93.84.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.93 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.6 9.6 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.83-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
            </FooterSocial>
            <FooterSocial href="https://x.com/blackcloud" label="X">
              <path d="M18.244 2H21l-6.53 7.46L22 22h-6.844l-4.83-6.315L4.6 22H1.844l6.985-7.98L2 2h6.984l4.362 5.77L18.244 2Zm-1.2 18.35h1.72L7.03 3.55H5.19l11.855 16.8Z" />
            </FooterSocial>
            <FooterSocial href="https://linkedin.com/company/blackcloud" label="LinkedIn">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.13 1 2.5 1s2.48 1.12 2.48 2.5ZM.24 8h4.51v14H.24V8Zm7.7 0h4.33v2.12h.07c.6-1.14 2.08-2.35 4.29-2.35 4.6 0 5.44 3.03 5.44 6.97V22h-4.51v-6.34c0-1.51-.03-3.45-2.1-3.45-2.1 0-2.43 1.65-2.43 3.35V22H7.94V8Z" />
            </FooterSocial>
            <FooterSocialLucide href="/rss.xml" label="RSS feed" icon={Rss} />
          </div>

          {/* Newsletter */}
          <form
            className="mt-4 flex max-w-sm items-center gap-2 clay-pressed rounded-clay-sm p-1.5"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Get infrastructure ideas monthly"
              className="flex-1 bg-transparent px-3 py-1.5 text-sm text-ink placeholder:text-ink-dim outline-none"
            />
            <button
              type="submit"
              data-magnetic
              className="clay clay-bump rounded-clay-sm bg-gradient-to-br from-ai to-azure px-3 py-1.5 text-xs font-medium text-void shadow-clay-ai"
            >
              Subscribe
            </button>
          </form>
        </div>

        <FooterCol title="Product" items={PRODUCT} />
        <FooterCol
          title="Providers"
          items={(["aws", "azure", "gcp"] as const).map((p) => ({
            label: PROVIDER_META[p].label,
            href: `/providers/${p}`,
            meta: `${PROVIDER_META[p].count}`,
            accent: PROVIDER_META[p].accent,
          }))}
        />
        <FooterCol title="Resources" items={RESOURCES} />
        <FooterCol title="Legal" items={LEGAL} />
      </div>

      <ClayDivider />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-ink-dim tablet:flex-row tablet:px-10">
        <p>© {new Date().getFullYear()} BlackCloud — Own the graph.</p>
        <p className="font-mono">
          Next.js 16 · React 19 · Three.js · Motion · Theatre.js
        </p>
      </div>

      {/* Big outlined wordmark — cinematic closer */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-none select-none overflow-hidden border-t border-white/5 py-10"
      >
        <div
          className="text-center font-display font-semibold leading-[0.85] tracking-[-0.06em] text-transparent"
          style={{
            WebkitTextStroke: "1px rgba(255,255,255,0.08)",
            fontSize: "clamp(4rem, 18vw, 20rem)",
          }}
        >
          BLACKCLOUD
        </div>
      </motion.div>
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
      <h3 className="mb-4 text-[10px] font-mono uppercase tracking-[0.2em] text-ink-dim">
        {title}
      </h3>
      <ul className="space-y-2 text-sm">
        {items.map((it) => {
          const external = it.href.startsWith("http");
          return (
            <li key={it.label}>
              <Link
                href={it.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-2 text-ink-muted transition-colors hover:text-ink"
              >
                {it.accent && (
                  <span
                    className="size-1.5 rounded-full shadow-[0_0_8px_currentColor]"
                    style={{ backgroundColor: it.accent, color: it.accent }}
                  />
                )}
                <span className="flex-1">{it.label}</span>
                {it.meta && (
                  <span className="text-[10px] font-mono text-ink-dim">
                    {it.meta}
                  </span>
                )}
                {external && (
                  <ArrowUpRight className="size-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                )}
              </Link>
            </li>
          );
        })}
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
      data-magnetic
      className={cn(
        "clay clay-bump grid place-items-center size-9 rounded-clay-sm",
        "text-ink-muted hover:text-ink transition-colors",
      )}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        {children}
      </svg>
    </a>
  );
}

function FooterSocialLucide({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      data-magnetic
      className={cn(
        "clay clay-bump grid place-items-center size-9 rounded-clay-sm",
        "text-ink-muted hover:text-ink transition-colors",
      )}
    >
      <Icon className="size-4" />
    </a>
  );
}
