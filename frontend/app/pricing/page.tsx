import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { GridBackground } from "@/components/effects/grid-background";
import { Aurora } from "@/components/effects/aurora";
import { GlowOrb } from "@/components/effects/glow-orb";
import { PricingClient } from "./_client";

export const metadata = {
  title: "Pricing — BlackCloud",
  description:
    "Simple, transparent pricing for teams of all sizes. Start free, scale when ready.",
};

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen bg-void">
        {/* background effects */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <GridBackground />
          <Aurora />
          <GlowOrb className="left-1/4 top-1/4" color="#8b5cf6" size={600} />
          <GlowOrb className="right-1/4 bottom-1/3" color="#06b6d4" size={400} />
        </div>

        <div className="relative z-10 pt-24">
          <PageHero
            title="Simple, transparent pricing"
            subtitle="Start free and scale as your infrastructure grows. No hidden fees, no surprises — just powerful cloud design tools at every tier."
            badge="Pricing"
          />

          <PricingClient />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
