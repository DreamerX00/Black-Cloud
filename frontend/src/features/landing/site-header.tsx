"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Sparkles, ArrowUpRight } from "@/components/icons";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

/**
 * Site header — the anchor point during ALL page navigations.
 *
 * Design intent (DESIGN_SYSTEM §Surface Styles + view-transitions):
 *   - Glass-morphic capsule that floats above the universe backdrop.
 *   - Pinned via `viewTransitionName: 'site-header'` so it never slides
 *     during nav-fwd/nav-back transitions — content slides, header stays.
 *   - Compresses to a tighter shape on scroll (>24px).
 *   - Nav uses SEMANTIC routes (not hash anchors), because the whole site
 *     is now multi-page world-based navigation, not a single scroll.
 *   - Every nav link opts into `transitionTypes` so the directional slide
 *     animations know which way to go.
 */

type NavItem = {
  label: string;
  href: string;
  hint?: string;
};

const PRIMARY_NAV: NavItem[] = [
  { label: "Playground", href: "/playground", hint: "Design infra visually" },
  { label: "Migrate", href: "/migrate", hint: "AWS ↔ Azure ↔ GCP" },
  { label: "Simulate", href: "/simulate", hint: "Failure & scale scenarios" },
  { label: "Pricing", href: "/pricing" },
  { label: "Docs", href: "/docs" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { user, hydrated, hydrate } = useAuth();
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  const isRoot = pathname === "/";

  return (
    <motion.header
      initial={reduce ? { opacity: 1, y: 0 } : { y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      style={{ viewTransitionName: "site-header" }}
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-all duration-500",
        scrolled ? "pt-3" : "pt-6",
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-4 transition-all duration-500",
          "px-6 tablet:px-8",
          scrolled
            ? "max-w-4xl h-12 rounded-clay-full glass-strong shadow-clay-2"
            : "max-w-6xl h-14 rounded-clay-lg glass",
        )}
      >
        {/* Wordmark */}
        <Link
          href="/"
          data-magnetic
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink hover:text-ai-bright transition-colors"
        >
          <span
            aria-hidden
            className={cn(
              "grid place-items-center size-7 rounded-clay-sm",
              "bg-gradient-to-br from-void to-graphite border border-white/10",
              "shadow-clay-1",
            )}
          >
            <span className="size-2 rounded-full bg-gradient-to-br from-ai to-azure animate-[pulse-glow_2s_ease-in-out_infinite]" />
          </span>
          <span>
            Black<span className="text-ai-bright">Cloud</span>
          </span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden items-center gap-0.5 text-sm tablet:flex">
          {PRIMARY_NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                data-magnetic
                className={cn(
                  "relative px-3 py-1.5 rounded-full transition-colors",
                  "text-ink-muted hover:text-ink",
                  active && "text-ink",
                )}
                title={n.hint}
              >
                {n.label}
                {active && !reduce && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-white/[0.06] border border-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right cluster */}
        <div className="flex items-center gap-2">
          {/* ⌘K hint */}
          <button
            type="button"
            data-magnetic
            data-cmdk-trigger
            className={cn(
              "hidden desktop:flex items-center gap-2 rounded-full",
              "border border-white/8 bg-white/[0.03] px-3 py-1.5 text-xs",
              "text-ink-dim hover:text-ink hover:bg-white/[0.06] transition-colors",
            )}
            aria-label="Open command palette"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("bc:cmdk-toggle"))
            }
          >
            <Sparkles className="size-3.5 text-ai" />
            <span>Ask BlackCloud</span>
            <kbd className="ml-1 font-mono text-[10px] rounded bg-white/5 px-1.5 py-0.5">
              ⌘K
            </kbd>
          </button>

          {user ? (
            <Link
              href="/dashboard"
              data-magnetic
              className={cn(
                "clay clay-bump rounded-full px-4 py-1.5 text-sm font-medium",
                "bg-gradient-to-br from-ai to-azure text-void shadow-clay-ai",
                "flex items-center gap-1.5",
              )}
            >
              Dashboard
              <ArrowUpRight className="size-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                data-magnetic
                className="hidden tablet:inline-flex rounded-full px-3 py-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                data-magnetic
                className={cn(
                  "clay clay-bump rounded-full px-4 py-1.5 text-sm font-medium",
                  "bg-gradient-to-br from-ai to-azure text-void shadow-clay-ai",
                  "flex items-center gap-1.5",
                )}
              >
                Start free
                <ArrowUpRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Ambient glow trail under the header — reads only on landing */}
      {isRoot && !scrolled && (
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 h-24 w-[80%] max-w-3xl bg-gradient-to-b from-ai/10 via-transparent to-transparent blur-2xl"
        />
      )}
    </motion.header>
  );
}
