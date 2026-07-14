"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Cloud } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const COLUMNS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Playground", href: "/dashboard" },
      { label: "Sign in", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Features", href: "#features" },
      { label: "Catalog", href: "#catalog" },
      { label: "FAQ", href: "#faq" },
    ],
  },
];

const linkClass = "text-sm text-fg-muted transition-colors hover:text-fg";

export function Footer() {
  return (
    <footer className="relative border-t border-border-strong bg-void/60 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-7xl"
      >
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <Cloud className="size-6 text-primary" />
              <span className="font-display text-xl font-bold text-fg">BlackCloud</span>
            </div>
            <p className="mt-4 text-sm text-fg-muted">
              Design, validate, and export cloud infrastructure visually.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge variant="outline">AWS</Badge>
              <Badge variant="outline">Azure</Badge>
              <Badge variant="outline">GCP</Badge>
            </div>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-12 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                  {col.title}
                </h3>
                <ul className="mt-4 space-y-3">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("#") ? (
                        <a href={link.href} className={linkClass}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className={linkClass}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className={cn(
          "mt-12 flex flex-col gap-2 border-t border-border pt-8",
          "sm:flex-row sm:items-center sm:justify-between",
        )}>
          <p className="font-mono text-xs text-fg-subtle">© 2026 BlackCloud</p>
          <p className="font-mono text-xs text-fg-subtle">
            Built with Next.js, Three.js &amp; Framer Motion
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
