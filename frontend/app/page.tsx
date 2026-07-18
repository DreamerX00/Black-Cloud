import { LandingHero } from "@/components/landing/hero";
import { StatsBand } from "@/components/landing/stats-band";
import { PillarsSection } from "@/components/landing/pillars-section";
import { LiveTwinSection } from "@/components/landing/live-twin-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { MascotsSection } from "@/components/landing/mascots-section";
import { QuotesSection } from "@/components/landing/quotes-section";
import { RoadmapSection } from "@/components/landing/roadmap-section";
import { FinalCta } from "@/components/landing/final-cta";

export default function HomePage() {
  return (
    <>
      <LandingHero />
      <main className="relative flex flex-col items-center">
        <StatsBand />
        <PillarsSection />
        <LiveTwinSection />
        <HowItWorksSection />
        <MascotsSection />
        <QuotesSection />
        <RoadmapSection />
        <FinalCta />
      </main>
    </>
  );
}
