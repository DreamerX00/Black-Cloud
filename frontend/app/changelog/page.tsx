import { type Metadata } from "next";
import { Navbar } from "@/components/nav/navbar";
import { PageHero } from "@/components/layout/page-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { CHANGELOGS } from "@/lib/mock";
import { SubscribeBanner, ChangelogTimeline } from "./_client";

export const metadata: Metadata = {
  title: "Changelog | BlackCloud",
  description: "What's new in BlackCloud — features, fixes, and improvements.",
};

export default function ChangelogPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-void pt-20">
        <PageHero
          title="Changelog"
          subtitle="What's new in BlackCloud"
          badge="Product Updates"
        />

        <SubscribeBanner />
        <ChangelogTimeline entries={CHANGELOGS} />
      </main>

      <SiteFooter />
    </>
  );
}
