"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/store/auth";

/**
 * Landing header — floats over the hero, condenses on scroll.
 * Now carries an inline ⌘K hint so the command-palette showcase further
 * down doesn't feel unmotivated.
 */
const NAV = [
  { label: "Features", href: "#bento" },
  { label: "Playground", href: "#playground" },
  { label: "Export", href: "#code" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { user, hydrated, hydrate } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-[background,backdrop-filter,border] duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-6 tablet:px-10">
        <Link
          href="/"
          data-magnetic
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span aria-hidden className="text-xl">⚫</span>
          BlackCloud
        </Link>

        <nav className="hidden items-center gap-0.5 text-sm tablet:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* ⌘K hint — decorative, mirrors the palette showcase further down */}
          <div className="hidden items-center gap-1.5 rounded-md border border-border/50 bg-graphite/40 px-2 py-1 desktop:flex">
            <kbd className="font-mono text-[10px] text-muted-foreground">⌘K</kbd>
            <span className="text-[11px] text-muted-foreground">Search</span>
          </div>

          {user ? (
            <Link
              href="/dashboard"
              data-magnetic
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Open dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                data-magnetic
                className="hidden rounded-md px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground tablet:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                data-magnetic
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
}
