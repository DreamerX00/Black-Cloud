"use client";

// Site-wide footer, extracted from act4-emergence and given real routes. Aurora +
// meteors ambience, claymorphism-adjacent, link columns. Used across marketing pages.
import Link from "next/link";
import { AuroraBackground } from "@/components/effects/aurora-background";
import { Meteors } from "@/components/effects/meteors";

const FOOTER_COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Playground", href: "/product/playground" },
      { label: "AI Architect", href: "/product/ai-architect" },
      { label: "Migration", href: "/product/migration" },
      { label: "Simulator", href: "/product/simulator" },
      { label: "Time Machine", href: "/product/time-machine" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Changelog", href: "/changelog" },
      { label: "Contact", href: "/contact" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "Dashboard", href: "/dashboard" },
      { label: "Console", href: "/playground" },
      { label: "Status", href: "/changelog" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Terms", href: "/legal/terms" },
      { label: "Security", href: "/legal/privacy" },
      { label: "Log in", href: "/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border bg-gradient-to-b from-background/80 to-background">
      <AuroraBackground className="pointer-events-none absolute inset-0 -z-10 opacity-30" />
      <Meteors count={12} />
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-display text-lg font-bold tracking-tight text-foreground">
              BLACKCLOUD
            </Link>
            <p className="mt-3 max-w-[16rem] text-sm text-muted-foreground">
              Descend, deploy, dominate — one control plane for every cloud.
            </p>
          </div>
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          {/* Static year — avoids new Date() (SSR hydration + blocked in this env); bump annually */}
          <span>© 2026 BlackCloud, Inc. All rights reserved.</span>
          <span>Made for teams that ship across clouds.</span>
        </div>
      </div>
    </footer>
  );
}
