import { Cinematic } from "@/features/landing/scenes/cinematic";
import { Aurora } from "@/features/landing/aurora";
import { SpotlightOverlay } from "@/features/landing/spotlight-overlay";
import { SiteHeader } from "@/features/landing/site-header";
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
import { Comparison } from "@/features/landing/comparison";
import { Trust } from "@/features/landing/trust";
import { Customers } from "@/features/landing/customers";
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
 * OPENING ACT — 5-scene Cinematic (per plan/VISION.md):
 *   1  Dark universe · single packet appears
 *   2  Packet moves Route53 → CF → ALB → ECS → RDS
 *   3  Architecture grows into a network
 *   4  Camera pulls back — universe revealed
 *   5  Enter the platform CTA
 *
 * Below the cinematic, the extended landing composition unfolds:
 *   VI    Globe           orbiting service constellation
 *   VII   Marquee         23-service dual-row ribbon
 *   VIII  Bento           6-tile asymmetric feature grid (clay tiles)
 *   IX    Architecture    claymorphic provider constellation
 *   X     Playground      live scripted three-tier canvas
 *   XI    Command         ⌘K palette showcase
 *   XII   Horizontal      pin-scroll gallery
 *   XIII  Chapters × 4    design · validate · export · multi-cloud
 *   XIV   Code Export     Terraform / CFN / JSON snippet tabs
 *   XV    Stack Builder   interactive assemble-your-stack canvas
 *   XVI   Timeline        5-step how-it-works rail
 *   XVII  Flip Cards      principle tiles
 *   XVIII Cost Calc       live sliders
 *   XIX   Integrations    24-tool constellation
 *   XX    Trust           SOC 2 / GDPR / ISO / HIPAA
 *   XXI   Cases           long-form stories
 *   XXII  Testimonials    pull-quotes
 *   XXIII Pricing         Free / Pro (highlighted) / Team
 *   XXIV  FAQ             native <details>
 *   —     Final CTA       conic aurora closer
 *   —     Footer          columns + big wordmark strip
 *
 * Global providers (SmoothScroll, CustomCursor, CommandPalette) live in
 * the root layout — they render on every route.
 */
export default function HomePage() {
  return (
    <>
      <Aurora />
      <SpotlightOverlay />
      <ScrollProgress />
      <SiteHeader />

      <main className="relative flex flex-1 flex-col">
        {/* Opening — the 5-scene R3F cinematic */}
        <Cinematic />

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

        <div id="compare">
          <Comparison />
        </div>

        <div id="trust">
          <Trust />
        </div>

        <div id="customers">
          <Customers />
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
