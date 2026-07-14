"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ShieldCheck } from "lucide-react";
import SplitText from "@/components/reactbits/SplitText";
import ShinyText from "@/components/reactbits/ShinyText";
import RotatingText from "@/components/reactbits/RotatingText";
import Magnet from "@/components/reactbits/Magnet";
import StarBorder from "@/components/reactbits/StarBorder";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// WebGL beams pull a renderer — keep off SSR / first paint.
const Beams = dynamic(() => import("@/components/reactbits/Beams"), { ssr: false });
const LightRays = dynamic(() => import("@/components/reactbits/LightRays"), { ssr: false });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Hero() {
  const reduced = useReducedMotion();
  const [webgl] = useState(() => (typeof window !== "undefined" ? hasWebGL() : false));
  const enabled = webgl && !reduced;

  return (
    <section
      id="top"
      className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* ── WebGL backdrop (with static fallback) ─────────────── */}
      {enabled ? (
        <>
          <div className="pointer-events-none absolute inset-0 z-0">
            <Beams
              beamNumber={14}
              beamWidth={2.2}
              lightColor="#8b5cf6"
              speed={1.6}
              noiseIntensity={1.5}
              scale={0.25}
              rotation={30}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 z-0 opacity-60">
            <LightRays
              raysOrigin="top-center"
              raysColor="#8b5cf6"
              raysSpeed={1.1}
              lightSpread={1.5}
              rayLength={2.2}
              followMouse
              mouseInfluence={0.12}
              fadeDistance={1.3}
            />
          </div>
        </>
      ) : (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(60% 50% at 50% 20%, rgba(139,92,246,0.22), transparent 70%)," +
              "radial-gradient(50% 40% at 75% 60%, rgba(66,133,244,0.14), transparent 70%)",
          }}
        />
      )}
      {/* Vignette so text stays legible over the beams */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-void/40 via-transparent to-void" />

      {/* ── Content ───────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="mb-8"
        >
          <Badge variant="outline" className="gap-2 px-4 py-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            <ShinyText
              text="Live architecture validation"
              speed={4}
              className="text-xs uppercase tracking-[0.3em]"
            />
          </Badge>
        </motion.div>

        <SplitText
          text="BlackCloud"
          tag="h1"
          className="font-display text-7xl font-bold tracking-tight sm:text-9xl"
          delay={60}
          duration={1.2}
          ease="power4.out"
          splitType="chars"
          from={{ opacity: 0, y: 120, rotateX: -90 }}
          to={{ opacity: 1, y: 0, rotateX: 0 }}
        />

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-2xl text-fg-muted sm:text-3xl">
          <span>Design infrastructure that</span>
          <RotatingText
            texts={["validates itself", "flows", "scales", "just works"]}
            mainClassName="rounded-lg bg-primary/15 px-3 py-1 font-display font-semibold text-primary"
            rotationInterval={2200}
            staggerFrom="last"
            staggerDuration={0.02}
            splitLevelClassName="overflow-hidden"
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
          />
        </div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="mt-6 max-w-xl text-balance text-lg text-fg-muted"
        >
          Drag AWS, Azure, and GCP services onto one canvas. Connect them, catch
          mistakes as you draw, and export the whole architecture in a click.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-5"
        >
          <Magnet padding={120} magnetStrength={3}>
            <StarBorder as={Link} href="/dashboard" color="#8b5cf6" speed="4s" className="cursor-target">
              <span className="flex items-center gap-2 font-medium">
                Launch the playground <ArrowRight className="size-4" />
              </span>
            </StarBorder>
          </Magnet>

          <Magnet padding={100} magnetStrength={4}>
            <Button asChild variant="outline" size="lg" className="cursor-target rounded-full">
              <Link href="/login">Sign in</Link>
            </Button>
          </Magnet>
        </motion.div>
      </div>

      {/* ── Scroll cue ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-8 z-10 flex flex-col items-center gap-2 text-fg-subtle"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6 }}
          className="block h-8 w-px bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
