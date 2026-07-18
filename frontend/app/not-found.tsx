import Link from "next/link";
import type { Metadata } from "next";
import { ClayCard } from "@/components/ui/clay-card";
import { PillButton } from "@/components/ui/pill-button";
import { Compass, Home, LifeBuoy, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Lost in the void · 404",
  description: "The route you requested drifted out of orbit. Let the Council guide you back.",
};

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0 nebula opacity-40" />
      <div aria-hidden className="pointer-events-none absolute inset-0 aurora opacity-25" />
      <div className="relative w-full max-w-3xl">
        <ClayCard variant="lg" glow="ai" className="p-10 md:p-14 text-center">
          <div className="text-mono-caps text-ai">Error · 404</div>
          <div className="mt-4 font-display text-[clamp(3.5rem,10vw,7rem)] font-semibold leading-none text-gradient-ai">
            Lost signal.
          </div>
          <p className="mx-auto mt-4 max-w-lg text-lg text-ink-dim">
            The route you asked for isn&apos;t on this graph. Somewhere between your intent and our
            index, a packet drifted out of orbit.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/">
              <PillButton icon={<Home className="h-4 w-4" />}>Back to Earth</PillButton>
            </Link>
            <Link href="/docs">
              <PillButton variant="ghost" icon={<Compass className="h-4 w-4" />}>Read the docs</PillButton>
            </Link>
            <Link href="/dashboard">
              <PillButton variant="ghost" icon={<ArrowLeft className="h-4 w-4" />}>Open workspace</PillButton>
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { icon: LifeBuoy, title: "Ask the Council", body: "Describe what you were looking for. Aria will route you." },
              { icon: Compass, title: "Popular starts", body: "Pricing · Playground · Manifesto · Live Twin" },
              { icon: Home, title: "Status page", body: "All systems nominal · 99.98% uptime" },
            ].map(c => {
              const Icon = c.icon;
              return (
                <ClayCard key={c.title} variant="sm" className="p-4 text-left">
                  <Icon className="h-4 w-4 text-ai" />
                  <div className="mt-2 font-display text-sm font-semibold">{c.title}</div>
                  <div className="mt-1 text-xs text-ink-mute">{c.body}</div>
                </ClayCard>
              );
            })}
          </div>
        </ClayCard>
      </div>
    </div>
  );
}
