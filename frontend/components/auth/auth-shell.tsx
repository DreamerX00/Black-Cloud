"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { motion } from "motion/react";

// Ambient WebGL particle field behind the card (client-only, off SSR).
const Particles = dynamic(() => import("@/components/reactbits/Particles"), {
  ssr: false,
});

/** Centered card layout shared by login + register, with animated backdrop. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-6">
      {/* animated particle backdrop */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <Particles
          particleColors={["#8b5cf6", "#4285f4", "#ffffff"]}
          particleCount={220}
          particleSpread={12}
          speed={0.08}
          particleBaseSize={70}
          moveParticlesOnHover
          alphaParticles
          disableRotation={false}
        />
      </div>
      {/* radial vignette to keep the card legible */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, transparent 30%, rgba(5,5,5,0.85) 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <Link href="/" className="mb-8 block text-center">
          <span className="font-display text-2xl font-bold">
            Black<span className="text-primary">Cloud</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-border-strong bg-graphite/80 p-6 backdrop-blur-xl">
          <h1 className="font-display text-xl font-semibold text-fg">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-fg-muted">{subtitle}</p>
          {children}
        </div>

        <p className="mt-4 text-center text-sm text-fg-muted">{footer}</p>
      </motion.div>
    </main>
  );
}
