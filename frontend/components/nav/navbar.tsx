"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu,
  X,
  ChevronDown,
  Workflow,
  Brain,
  ArrowRightLeft,
  Zap,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MARKETING_NAV } from "@/lib/nav";
import { Button } from "@/components/ui/button";

// ponytail: icon map mirrors app-frame.tsx pattern
const PRODUCT_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/product/playground": Workflow,
  "/product/ai-architect": Brain,
  "/product/migration": ArrowRightLeft,
  "/product/simulator": Zap,
  "/product/time-machine": History,
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productOpen, setProductOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const productNav = MARKETING_NAV.find((n) => n.children);
  const plainLinks = MARKETING_NAV.filter((n) => !n.children);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-4 left-4 right-4 z-50 rounded-2xl border transition-all duration-300",
          scrolled
            ? "border-white/10 bg-graphite/80 shadow-[var(--shadow-clay)] backdrop-blur-xl"
            : "border-white/5 bg-graphite/40 backdrop-blur-md"
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="font-display text-xl font-bold bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
              BlackCloud
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {/* Product dropdown */}
            {productNav && (
              <div
                className="relative"
                onMouseEnter={() => setProductOpen(true)}
                onMouseLeave={() => setProductOpen(false)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
                    productOpen && "text-foreground"
                  )}
                  onClick={() => setProductOpen((v) => !v)}
                  aria-expanded={productOpen}
                >
                  {productNav.label}
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      productOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {productOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[420px] rounded-xl border border-white/5 bg-graphite/95 p-2 shadow-[var(--shadow-clay)] backdrop-blur-xl"
                    >
                      {productNav.children!.map((item) => {
                        const Icon = PRODUCT_ICONS[item.href] ?? Workflow;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setProductOpen(false)}
                            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-white/5 group"
                          >
                            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/5 shadow-[var(--shadow-clay-sm)] group-hover:border-primary/30">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">
                                {item.label}
                              </div>
                              {item.description && (
                                <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Plain links */}
            {plainLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={closeMobile}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-[280px] border-l border-white/5 bg-graphite/95 backdrop-blur-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1 mt-16">
                {/* Product group */}
                {productNav && (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {productNav.label}
                    </div>
                    {productNav.children!.map((item) => {
                      const Icon = PRODUCT_ICONS[item.href] ?? Workflow;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobile}
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5"
                        >
                          <Icon className="h-4 w-4 text-primary" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}

                <div className="h-px bg-white/5 my-2" />

                {/* Plain links */}
                {plainLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobile}
                    className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:bg-white/5"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="h-px bg-white/5 my-2" />

                {/* CTA */}
                <div className="flex flex-col gap-2 mt-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login" onClick={closeMobile}>
                      Sign In
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" onClick={closeMobile}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
