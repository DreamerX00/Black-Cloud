"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { Cloud, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/effects/magnetic";
import { ThemeToggle } from "@/components/theme-toggle";

const LINKS = [
  { label: "Galaxy", href: "#galaxy" },
  { label: "Core", href: "#core" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "#docs" },
] as const;

function NavLink({
  href,
  label,
  reduced,
  onClick,
}: {
  href: string;
  label: string;
  reduced: boolean;
  onClick?: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="relative rounded-sm px-1 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
    >
      {label}
      <motion.span
        className="absolute inset-x-1 -bottom-0.5 h-px origin-left bg-gradient-to-r from-accent-violet to-accent-cyan"
        initial={false}
        animate={{ scaleX: hover ? 1 : 0 }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
      />
    </Link>
  );
}

export function Navbar() {
  const reduced = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 40);
  });

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 top-0 z-50"
    >
      <motion.div
        initial={false}
        animate={{
          backgroundColor: scrolled
            ? "color-mix(in oklch, var(--background) 82%, transparent)"
            : "color-mix(in oklch, var(--background) 40%, transparent)",
          paddingTop: scrolled ? 8 : 16,
          paddingBottom: scrolled ? 8 : 16,
        }}
        transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 300, damping: 34 }}
        className={cn(
          "border-b transition-[backdrop-filter,box-shadow,border-color] duration-300",
          scrolled
            ? "border-border/60 shadow-lg shadow-black/5 backdrop-blur-xl"
            : "border-transparent backdrop-blur-sm"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="#top"
            className="group flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-violet"
          >
            <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-accent-violet to-accent-cyan text-white shadow-sm">
              <Cloud className="size-4" />
            </span>
            <span className="bg-gradient-to-r from-accent-violet to-accent-cyan bg-clip-text text-lg font-bold tracking-tight text-transparent">
              BLACKCLOUD
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <NavLink key={l.href} href={l.href} label={l.label} reduced={reduced} />
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            <Magnetic strength={0.3}>
              <Button asChild size="lg" className="bg-gradient-to-r from-accent-violet to-accent-cyan text-white hover:opacity-90">
                <Link href="#console">Launch console</Link>
              </Button>
            </Magnetic>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.28, ease: "easeInOut" }}
            className="overflow-hidden border-b border-border/60 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {LINKS.map((l) => (
                <NavLink
                  key={l.href}
                  href={l.href}
                  label={l.label}
                  reduced={reduced}
                  onClick={() => setOpen(false)}
                />
              ))}
              <Magnetic strength={0.2}>
                <Button
                  asChild
                  size="lg"
                  className="mt-3 w-full bg-gradient-to-r from-accent-violet to-accent-cyan text-white hover:opacity-90"
                >
                  <Link href="#console" onClick={() => setOpen(false)}>
                    Launch console
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
