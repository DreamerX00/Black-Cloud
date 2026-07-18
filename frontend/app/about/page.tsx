import { Navbar } from "@/components/nav/navbar";
import { SiteFooter } from "@/components/layout/site-footer";
import { PageHero } from "@/components/layout/page-hero";
import { Aurora } from "@/components/effects/aurora";
import { GridBackground } from "@/components/effects/grid-background";
import { Separator } from "@/components/ui/separator";
import { TEAM_MEMBERS } from "@/lib/mock";

import {
  MissionSection,
  StorySection,
  TeamSection,
  ValuesSection,
  StatsSection,
  CareersSection,
} from "./_client";

export const metadata = {
  title: "About — BlackCloud",
  description:
    "Meet the team behind BlackCloud — the visual cloud infrastructure platform trusted by engineers worldwide.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-void">
      {/* background effects */}
      <Aurora intensity="low" className="z-0" />
      <GridBackground variant="dots" className="z-0" />

      <div className="relative z-10">
        <Navbar />

        <main className="mx-auto max-w-7xl pt-24">
          <PageHero
            badge="About BlackCloud"
            title="Building the Future of Cloud Infrastructure"
            subtitle="We are on a mission to make cloud architecture visual, collaborative, and intelligent — so every engineer can design production-ready systems in minutes, not months."
          />

          <MissionSection />

          <Separator className="mx-auto max-w-xs opacity-20" />

          <StorySection />

          <Separator className="mx-auto max-w-xs opacity-20" />

          <TeamSection members={TEAM_MEMBERS} />

          <Separator className="mx-auto max-w-xs opacity-20" />

          <ValuesSection />

          <StatsSection />

          <CareersSection />
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
