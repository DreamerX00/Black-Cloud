"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useAuth } from "@/store/auth";

/**
 * Landing header — floats over the hero, condenses on scroll.
 * Pattern lifted from Apple Vision Pro / Stripe: transparent at top,
 * frosted panel once the user starts scrolling.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  // Auth state so the header shows "Open dashboard" when a session already
  // exists — the biggest friction point was landing pages hiding the app
  // from visitors who had already signed in.
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
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6 tablet:px-10">
        <Link
          href="/"
          data-magnetic
          className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
        >
          <span aria-hidden className="text-xl">⚫</span>
          BlackCloud
        </Link>

        <nav className="hidden items-center gap-1 text-sm tablet:flex">
          <a
            href="#design"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Design
          </a>
          <a
            href="#validate"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Validate
          </a>
          <a
            href="#export"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Export
          </a>
          <a
            href="#providers"
            className="rounded-md px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            Multi-cloud
          </a>
        </nav>

        <div className="flex items-center gap-2">
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
