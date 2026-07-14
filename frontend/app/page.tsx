import ClickSpark from "@/components/reactbits/ClickSpark";
import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
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

/**
 * Maximalist marketing homepage — a long scroll composed of isolated section
 * components (components/landing/*). Each section is self-contained; this file
 * only orders them. WebGL/heavy layers self-gate on reduced-motion + WebGL
 * support inside their own components.
 */
export default function Home() {
  return (
    <ClickSpark sparkColor="#8b5cf6" sparkCount={10} sparkRadius={22} duration={500}>
      <Nav />
      <main className="relative">
        <Hero />
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
  );
}
