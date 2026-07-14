import ClickSpark from "@/components/reactbits/ClickSpark";
import { ExperienceRoot } from "@/components/experience/experience-root";
import { Nav } from "@/components/landing/nav";
import { ProviderMarquee } from "@/components/landing/provider-marquee";
import { BentoFeatures } from "@/components/landing/bento-features";
import { ValidationShowcase } from "@/components/landing/validation-showcase";
import { CanvasTeaser } from "@/components/landing/canvas-teaser";
import { StatsBand } from "@/components/landing/stats-band";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CatalogTabs } from "@/components/landing/catalog-tabs";
import { Faq } from "@/components/landing/faq";
import { ClosingCta } from "@/components/landing/closing-cta";
import { Footer } from "@/components/landing/footer";

// ExperienceRoot is a "use client" component; its own WebGL layers are the ones
// gated with next/dynamic ssr:false (inside a Client Component, which Next 16
// requires). Importing it directly from this Server Component is fine.

/**
 * Homepage = a fullscreen cinematic 3D "universe" (ExperienceRoot). The classic
 * marketing landing lives directly below it, reachable via the HUD "Skip to site"
 * link (#site) or by scrolling past the fixed experience layer.
 */
export default function Home() {
  return (
    <>
      <ExperienceRoot />

      {/* The fixed experience covers the first viewport; this spacer lets the
          page scroll down to the marketing site beneath it. */}
      <div className="pointer-events-none h-dvh" aria-hidden />

      <section id="site" className="relative z-10 bg-void">
        <ClickSpark sparkColor="#8b5cf6" sparkCount={10} sparkRadius={22} duration={500}>
          <Nav />
          <main className="relative">
            <ProviderMarquee />
            <BentoFeatures />
            <ValidationShowcase />
            <CanvasTeaser />
            <StatsBand />
            <HowItWorks />
            <CatalogTabs />
            <Faq />
            <ClosingCta />
          </main>
          <Footer />
        </ClickSpark>
      </section>
    </>
  );
}
