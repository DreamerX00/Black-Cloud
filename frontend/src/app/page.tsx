import { CustomCursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteHeader } from "@/features/landing/site-header";
import { Aurora } from "@/features/landing/aurora";
import { SpotlightOverlay } from "@/features/landing/spotlight-overlay";
import { Hero } from "@/features/landing/hero";
import { GlobeSection } from "@/features/landing/globe-section";
import { ProviderMarquee } from "@/features/landing/marquee";
import { BentoGrid } from "@/features/landing/bento";
import { Architecture3D } from "@/features/landing/architecture-3d";
import { PlaygroundPreview } from "@/features/landing/playground-preview";
import { CommandShowcase } from "@/features/landing/command-showcase";
import { HorizontalGallery } from "@/features/landing/horizontal-gallery";
import { Chapter } from "@/features/landing/chapter";
import {
  DesignVisual,
  ValidateVisual,
  ExportVisual,
  ProvidersVisual,
} from "@/features/landing/chapter-visuals";
import { Stats } from "@/features/landing/stats";
import { CodeExport } from "@/features/landing/code-export";
import { StackBuilder } from "@/features/landing/stack-builder";
import { Timeline } from "@/features/landing/timeline";
import { FlipCards } from "@/features/landing/flip-cards";
import { CostCalculator } from "@/features/landing/cost-calculator";
import { Integrations } from "@/features/landing/integrations";
import { Trust } from "@/features/landing/trust";
import { CaseStudies } from "@/features/landing/case-studies";
import { Testimonials } from "@/features/landing/testimonials";
import { Pricing } from "@/features/landing/pricing";
import { FAQ } from "@/features/landing/faq";
import { FinalCTA } from "@/features/landing/final-cta";
import { SiteFooter } from "@/features/landing/site-footer";
import { ScrollProgress } from "@/features/landing/scroll-progress";

/**
 * Landing page — the immersive AAAA-grade centerpiece.
 *
 * Nineteen-act composition, three WebGL scenes, one custom GLSL nebula,
 * two scroll-choreographed pin sections, one real interactive builder:
 *
 *   I     Hero            hero-scene WebGL universe · big display type
 *   II    Globe           R3F orbiting service constellation
 *   III   Marquee         23-service dual-row infinite ribbon
 *   IV    Bento           6-tile asymmetric feature grid
 *   V     Architecture    R3F 3D chips + fbm nebula shader
 *   VI    Playground      live scripted three-tier canvas demo
 *   VII   Command         ⌘K palette in motion
 *   VIII  Horizontal      pin-scroll gallery of 5 panels
 *   IX    Chapters × 4    parallax + tilt + spotlight
 *   X     Code Export     tabbed Terraform / CFN / JSON snippet
 *   XI    Stack Builder   real interactive assemble-your-stack canvas
 *   XII   Timeline        sticky rail 5-step how-it-works
 *   XIII  Flip Cards      3D CSS flip-on-hover principle tiles
 *   XIV   Cost Calc       live sliders + total
 *   XV    Integrations    24-tool constellation w/ hover connections
 *   XVI   Trust           SOC 2 / GDPR / ISO / HIPAA / AES / SSO
 *   XVII  Case Studies    three long-form stories with metrics
 *   XVIII Testimonials    pull-quotes with oversized quote glyph
 *   XIX   Pricing         Free / Pro (highlighted) / Team
 *   XX    FAQ             native <details> accordion
 *   —     Final CTA       conic aurora closer
 *   —     Footer          columns + full-bleed wordmark
 *
 * Global overlays: Aurora (weather), SmoothScroll (Lenis lerp),
 * CustomCursor (magnetic), SpotlightOverlay (cursor spotlight, screen blend),
 * ScrollProgress (top bar + dot rail), SiteHeader (condensing).
 *
 * Every WebGL section dynamic-imports its Canvas so initial bundle stays
 * lean and LCP is not blocked by three.js. All motion gates on
 * prefers-reduced-motion at the component level.
 */
export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <Aurora />
      <SpotlightOverlay />
      <CustomCursor />
      <ScrollProgress />
      <SiteHeader />

      <main className="relative flex flex-1 flex-col">
        <div id="hero">
          <Hero />
        </div>

        <div id="globe">
          <GlobeSection />
        </div>

        <div id="marquee">
          <ProviderMarquee />
        </div>

        <div id="bento">
          <BentoGrid />
        </div>

        <div id="architecture">
          <Architecture3D />
        </div>

        <div id="playground">
          <PlaygroundPreview />
        </div>

        <div id="command">
          <CommandShowcase />
        </div>

        <div id="gallery">
          <HorizontalGallery />
        </div>

        <div id="chapters">
          <div id="design">
            <Chapter
              eyebrow="01 · Design"
              headline="Every service, one canvas."
              body="AWS, Azure, and Google Cloud share one drag-and-drop workspace. Snap to grid, pan the infinite canvas, and let the architecture grow."
              visual={<DesignVisual />}
              align="left"
              accent="#8B5CF6"
            />
          </div>

          <div id="validate">
            <Chapter
              eyebrow="02 · Validate"
              headline="Mistakes catch themselves."
              body="Connect an ALB straight to RDS? BlackCloud flags it the instant you draw the edge — and proposes the right path. No documentation trawling. No 3am pages."
              visual={<ValidateVisual />}
              align="right"
              accent="#22C55E"
            />
          </div>

          <Stats />

          <div id="export">
            <Chapter
              eyebrow="03 · Export"
              headline="Ship the diagram. Keep the source."
              body="Export to PNG, SVG, or JSON. The graph you drew is the graph you keep — replay it, hand it off, or extend it later."
              visual={<ExportVisual />}
              align="left"
              accent="#4285F4"
            />
          </div>

          <div id="providers">
            <Chapter
              eyebrow="04 · Multi-cloud"
              headline="Fluent in every cloud."
              body="23 services across three providers at launch. Terraform, Cloud Run, ECS, GKE — all speak the same visual language, so your team does too."
              visual={<ProvidersVisual />}
              align="right"
              accent="#FF9900"
            />
          </div>
        </div>

        <div id="code">
          <CodeExport />
        </div>

        <div id="builder">
          <StackBuilder />
        </div>

        <div id="timeline">
          <Timeline />
        </div>

        <div id="principles">
          <FlipCards />
        </div>

        <div id="cost">
          <CostCalculator />
        </div>

        <div id="integrations">
          <Integrations />
        </div>

        <div id="trust">
          <Trust />
        </div>

        <div id="cases">
          <CaseStudies />
        </div>

        <div id="testimonials">
          <Testimonials />
        </div>

        <div id="pricing">
          <Pricing />
        </div>

        <div id="faq">
          <FAQ />
        </div>

        <FinalCTA />
      </main>

      <SiteFooter />
    </>
  );
}
