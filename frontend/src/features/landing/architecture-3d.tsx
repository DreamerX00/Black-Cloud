"use client";

import { useSyncExternalStore } from "react";
import { Reveal } from "@/components/motion/reveal";
import { ClayOrb } from "@/components/ui/clay";
import { ProviderMark } from "@/components/icons";

/**
 * Architecture scene — was a nebula-shader R3F canvas; superseded by the
 * always-visible Cinematic (5-scene) canvas at the top of the page. Here
 * we render a claymorphic constellation of provider marks that reads as
 * "walk inside your stack" without a second WebGL context.
 */
const ArchitectureScene = () => (
  <div className="absolute inset-0 grid place-items-center">
    <div className="relative size-[520px]">
      {[
        { p: "aws", angle: 0, tone: "aws" as const },
        { p: "azure", angle: 120, tone: "azure" as const },
        { p: "gcp", angle: 240, tone: "gcp" as const },
      ].map(({ p, angle, tone }) => (
        <div
          key={p}
          className="absolute left-1/2 top-1/2"
          style={{
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-200px) rotate(${-angle}deg)`,
          }}
        >
          <ClayOrb size="lg" tone={tone} className="animate-[float-y_5s_ease-in-out_infinite]">
            <ProviderMark provider={p as "aws" | "azure" | "gcp"} className="size-10" />
          </ClayOrb>
        </div>
      ))}
    </div>
  </div>
);

const MQ = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSnapshot() {
  return window.matchMedia(MQ).matches;
}
function getServerSnapshot() {
  return false;
}

/**
 * Architecture 3D — full-bleed act.
 *
 * Two stacked canvases:
 *   - Nebula shader plane (fbm swirl backdrop)
 *   - Architecture chips with pointer-tracked parallax camera
 *
 * Headline sits above both, letting the depth sell the section.
 */
export function Architecture3D() {
  const reduce = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <section className="relative h-[120vh] overflow-hidden bg-void">
      {/* Single Canvas hosts both the nebula shader plane and the 3D chips.
          Splitting them into two stacked <Canvas> caused Chrome to hit its
          WebGL-context cap (esp. under swiftshader) and both silently failed —
          the section rendered pure white. One context, one fix. */}
      <div className="absolute inset-0">{!reduce && <ArchitectureScene />}</div>

      {/* Bottom fade so the section blends into the next act */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-void to-transparent"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col justify-between px-6 py-16 tablet:px-10 tablet:py-24">
        <header className="max-w-3xl">
          <Reveal>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Act IV · Depth
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.98] tracking-[-0.03em] tablet:text-7xl desktop:text-[8rem]">
              Walk inside{" "}
              <span className="italic bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent">
                your stack.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Every node breathes. Every edge carries live traffic. Move your
              cursor — the camera follows. This is what your architecture
              looks like when it&rsquo;s alive.
            </p>
          </Reveal>
        </header>

        {/* Bottom hint strip */}
        <div className="flex items-center justify-between gap-6 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>· cursor drives camera</span>
          <span className="hidden tablet:inline">
            12 nodes · 4 planes · 60fps target
          </span>
          <span>real-time</span>
        </div>
      </div>
    </section>
  );
}
