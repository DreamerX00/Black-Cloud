import Link from "next/link";
import type { ReactNode } from "react";
import { ClayBadge, ClayOrb } from "@/components/ui/clay";
import { ProviderMark, Sparkles, Compass, Network } from "@/components/icons";

/**
 * Auth route group layout — split portal shell.
 *
 * Left panel  (desktop only): a claymorphic universe glimpse — three
 *   provider orbs orbiting an AI core, with a rotating tagline. The
 *   marketing surface auth doesn't usually get.
 *
 * Right panel: the actual form, in its own claymorphic card.
 *
 * Mobile:  form stacks alone, nebula backdrop still on.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Universe backdrop */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 aurora" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-lines-fine opacity-40"
      />

      {/* Top nav — minimal, wordmark only */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-6 tablet:px-10">
        <Link
          href="/"
          data-magnetic
          className="inline-flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-ink"
        >
          <span
            aria-hidden
            className="grid place-items-center size-7 rounded-clay-sm bg-gradient-to-br from-void to-graphite border border-white/10 shadow-clay-1"
          >
            <span className="size-2 rounded-full bg-gradient-to-br from-ai to-azure animate-[pulse-glow_2s_ease-in-out_infinite]" />
          </span>
          Black<span className="text-ai-bright">Cloud</span>
        </Link>
        <Link
          href="/"
          className="text-xs uppercase tracking-widest text-ink-dim hover:text-ink transition-colors font-mono"
        >
          ← Back to site
        </Link>
      </header>

      <div className="relative grid min-h-screen desktop:grid-cols-2">
        {/* Left panel — universe glimpse (desktop only) */}
        <aside className="relative hidden desktop:flex flex-col justify-between overflow-hidden p-14">
          {/* Ambient tint */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ai/10 via-transparent to-azure/10"
          />

          <div className="relative z-10 max-w-md space-y-6 pt-16">
            <ClayBadge tone="ai" pulse>
              <Sparkles className="size-3" /> BlackCloud v1.0
            </ClayBadge>
            <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-[-0.03em]">
              Design cloud infra <br />
              <span className="italic text-gradient-provider">like a universe.</span>
            </h1>
            <p className="text-base text-ink-muted leading-relaxed">
              Own the graph. Every service across AWS, Azure, and GCP
              speaks the same visual language.
            </p>
          </div>

          {/* Constellation — three provider orbs around an AI core */}
          <div className="relative z-10 grid place-items-center py-10">
            <div className="relative size-[420px]">
              <ClayOrb
                size="xl"
                tone="ai"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <Compass className="size-14" />
              </ClayOrb>
              {(["aws", "azure", "gcp"] as const).map((p, i) => (
                <div
                  key={p}
                  className="absolute left-1/2 top-1/2"
                  style={{
                    transform: `translate(-50%, -50%) rotate(${i * 120}deg) translateY(-160px) rotate(-${i * 120}deg)`,
                  }}
                >
                  <ClayOrb
                    size="lg"
                    tone={p}
                    className="animate-[float-y_5s_ease-in-out_infinite]"
                  >
                    <ProviderMark provider={p} className="size-10" />
                  </ClayOrb>
                </div>
              ))}
              {/* Faint orbital rings */}
              {[160, 200, 240].map((r) => (
                <div
                  key={r}
                  aria-hidden
                  className="absolute left-1/2 top-1/2 rounded-full border border-white/[0.04]"
                  style={{
                    width: r * 2,
                    height: r * 2,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative z-10 flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            <span className="flex items-center gap-2">
              <Network className="size-3" />
              live twin
            </span>
            <span>·</span>
            <span>SOC 2 in progress</span>
            <span>·</span>
            <span>read-only default</span>
          </div>
        </aside>

        {/* Right panel — form */}
        <main className="relative flex items-center justify-center px-4 py-24 tablet:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
