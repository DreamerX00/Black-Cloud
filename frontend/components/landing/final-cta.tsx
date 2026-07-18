import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ClayCard } from "@/components/ui/clay-card";

export function FinalCta() {
  return (
    <Section className="!pb-32">
      <ClayCard variant="lg" glow="ai" className="relative mx-auto w-full max-w-5xl overflow-hidden p-10 md:p-16 lg:p-20">
        <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-50" />
        <div aria-hidden className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="relative flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-dim">
            <Sparkles className="h-3.5 w-3.5 text-ai animate-pulse-slow" />
            Free during Phase 2 · No card required
          </div>
          <h2 className="mx-auto max-w-3xl font-display text-[clamp(2rem,5.5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight">
            Stop drawing your infrastructure.
            <br className="hidden sm:block" />{" "}
            <span className="text-gradient-nebula">Start living inside it.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-ink-dim md:text-lg">
            Ninety seconds from signup to your first animated architecture. Sixty seconds after that, your first Health Score.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              data-cursor="grow"
              className="clay group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-base font-medium"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              Enter the universe
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/docs" className="glass rounded-full px-5 py-3 text-sm text-ink-dim hover:text-ink">
              Read the docs first
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-mono uppercase tracking-widest text-ink-mute">
            <span>◆ SOC2 Type II</span>
            <span>◆ Least-privilege by default</span>
            <span>◆ Export anytime · no lock-in</span>
            <span>◆ Multi-cloud from day one</span>
          </div>
        </div>
      </ClayCard>
    </Section>
  );
}
