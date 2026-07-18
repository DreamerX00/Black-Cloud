"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Boxes,
  Sparkles,
  ArrowLeftRight,
  ShieldAlert,
  Clock3,
  Coins,
  BrainCircuit,
  Command,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { BlackCloudMark } from "../brand/mark";

const PRODUCT_LINKS = [
  { href: "/product/cloud-playground", label: "Cloud Playground", desc: "Design cloud worlds on an infinite canvas.", icon: Boxes, tint: "text-info" },
  { href: "/product/ai-architect", label: "AI Architect", desc: "Generate architectures from a sentence.", icon: Sparkles, tint: "text-ai" },
  { href: "/product/migration-ground", label: "Migration Ground", desc: "Watch EC2 morph into Compute Engine.", icon: ArrowLeftRight, tint: "text-aws" },
  { href: "/product/failure-simulator", label: "Failure Simulator", desc: "Pull a plug — see everything flex.", icon: ShieldAlert, tint: "text-danger" },
  { href: "/product/time-machine", label: "Time Machine", desc: "Replay infrastructure over time.", icon: Clock3, tint: "text-warn" },
  { href: "/product/cost-simulator", label: "Cost Simulator", desc: "Delta cost before you commit.", icon: Coins, tint: "text-success" },
  { href: "/product/architecture-intelligence", label: "Architecture Intelligence", desc: "Live scores on every graph.", icon: BrainCircuit, tint: "text-gcp" },
];

const TOP_LEVEL = [
  { href: "/manifesto", label: "Manifesto" },
  { href: "/mascots", label: "Council" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Field Notes" },
  { href: "/docs", label: "Docs" },
];

export function GlobalNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const lastPathRef = useRef(pathname);
  if (lastPathRef.current !== pathname) {
    lastPathRef.current = pathname;
    if (mobile) setMobile(false);
    if (openProduct) setOpenProduct(false);
  }

  const openCommand = () => {
    window.dispatchEvent(new CustomEvent("blackcloud:open-command"));
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "pt-2" : "pt-4"
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4">
        <nav
          className={cn(
            "glass flex items-center gap-1 rounded-full px-2 py-2 transition-all",
            scrolled ? "shadow-clay-sm" : ""
          )}
        >
          <Link
            href="/"
            data-cursor="magnet"
            className="group flex items-center gap-2 rounded-full px-3 py-1.5"
          >
            <BlackCloudMark className="h-5 w-5" />
            <span className="font-display text-[15px] font-semibold tracking-tight">
              BlackCloud
            </span>
          </Link>

          <div className="mx-1 hidden h-6 w-px bg-white/10 md:block" />

          <button
            data-cursor="magnet"
            onMouseEnter={() => setOpenProduct(true)}
            onMouseLeave={() => setOpenProduct(false)}
            onClick={() => setOpenProduct(v => !v)}
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-ink-dim transition-colors hover:text-ink md:inline-flex"
          >
            Product
            <span className={cn("inline-block h-1 w-1 rounded-full bg-ai transition-transform", openProduct && "scale-150")} />
          </button>

          {TOP_LEVEL.map(l => (
            <Link
              key={l.href}
              href={l.href}
              data-cursor="magnet"
              className={cn(
                "hidden rounded-full px-3 py-1.5 text-sm transition-colors md:inline-block",
                pathname.startsWith(l.href) ? "text-ink" : "text-ink-dim hover:text-ink"
              )}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            data-cursor="magnet"
            onClick={openCommand}
            className="glass hidden items-center gap-3 rounded-full px-4 py-2 text-xs text-ink-dim transition-colors hover:text-ink md:inline-flex"
            aria-label="Open command palette"
          >
            <Command className="h-3.5 w-3.5" />
            <span>Jump anywhere</span>
            <kbd className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
          </button>

          <Link
            href="/login"
            data-cursor="magnet"
            className="hidden rounded-full px-4 py-2 text-sm text-ink-dim transition-colors hover:text-ink md:inline-block"
          >
            Sign in
          </Link>

          <Link
            href="/signup"
            data-cursor="grow"
            className="clay group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2 text-sm font-medium text-ink transition-transform hover:-translate-y-0.5"
          >
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            Enter the universe
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-ai animate-pulse-slow" />
          </Link>

          <button
            className="glass inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden"
            aria-label={mobile ? "Close menu" : "Open menu"}
            onClick={() => setMobile(v => !v)}
          >
            {mobile ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Product mega menu */}
      <AnimatePresence>
        {openProduct && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            onMouseEnter={() => setOpenProduct(true)}
            onMouseLeave={() => setOpenProduct(false)}
            className="pointer-events-auto mx-auto mt-3 hidden max-w-[1200px] px-4 md:block"
          >
            <div className="clay-lg grid grid-cols-1 gap-2 p-4 md:grid-cols-2 lg:grid-cols-3">
              {PRODUCT_LINKS.map(p => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.href}
                    href={p.href}
                    data-cursor="magnet"
                    className="group flex items-start gap-3 rounded-2xl p-3 transition-colors hover:bg-white/[0.04]"
                  >
                    <div className={cn("clay-sm inline-flex h-10 w-10 items-center justify-center rounded-xl", p.tint)}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-ink">
                        {p.label}
                        <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                      </div>
                      <div className="mt-0.5 text-xs text-ink-mute line-clamp-2">{p.desc}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-4 mt-3 md:hidden"
          >
            <div className="clay-lg space-y-3 p-4">
              <div className="grid grid-cols-1 gap-1">
                {PRODUCT_LINKS.map(p => {
                  const Icon = p.icon;
                  return (
                    <Link key={p.href} href={p.href} className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-dim hover:bg-white/5 hover:text-ink">
                      <Icon className={cn("h-4 w-4", p.tint)} />
                      {p.label}
                    </Link>
                  );
                })}
              </div>
              <div className="h-px bg-white/8" />
              <div className="grid grid-cols-2 gap-1">
                {TOP_LEVEL.map(l => (
                  <Link key={l.href} href={l.href} className="rounded-xl px-3 py-2 text-sm text-ink-dim hover:bg-white/5 hover:text-ink">
                    {l.label}
                  </Link>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link href="/login" className="glass rounded-full py-2 text-center text-sm">Sign in</Link>
                <Link href="/signup" className="clay rounded-full py-2 text-center text-sm">Enter</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
