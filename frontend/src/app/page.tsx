import { CustomCursor } from "@/components/motion/cursor";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteHeader } from "@/features/landing/site-header";
import { Aurora } from "@/features/landing/aurora";
import { Hero } from "@/features/landing/hero";
import { ProviderMarquee } from "@/features/landing/marquee";
import { Stats } from "@/features/landing/stats";
import { PlaygroundPreview } from "@/features/landing/playground-preview";
import { Chapter } from "@/features/landing/chapter";
import {
  DesignVisual,
  ValidateVisual,
  ExportVisual,
  ProvidersVisual,
} from "@/features/landing/chapter-visuals";
import { FinalCTA } from "@/features/landing/final-cta";
import { SiteFooter } from "@/features/landing/site-footer";

/**
 * Landing page — the immersive centerpiece.
 *
 * Composition — award-tier reference stack in the visible order:
 *   Aurora        (fixed background weather layer)
 *   SmoothScroll  (Lenis lerp, no visual — must mount above everything)
 *   CustomCursor  (with magnetic pull to `[data-magnetic]`)
 *   SiteHeader    (condensing floating header)
 *
 *   Act I    — Hero: WebGL universe + display headline + magnetic CTAs
 *   Act II   — ProviderMarquee: infinite dual-row of the 23 services
 *   Act III  — Startframe: choreographed playground preview
 *   Act IV   — Chapters × 4 with parallax + pointer-tilt + spotlight
 *   Act V    — Stats: count-up credibility beat
 *   Act VI   — Closing CTA with conic aurora
 *   Footer   — refined agency-tier
 *
 * All motion gates on `prefers-reduced-motion` in the individual components.
 * References: Lando Norris, Igloo Inc, Lusion, Resn, Active Theory,
 * Apple Vision Pro, Stripe Sessions.
 */
export default function HomePage() {
  return (
    <>
      <SmoothScroll />
      <Aurora />
      <CustomCursor />
      <SiteHeader />

      <main className="relative flex flex-1 flex-col">
        <Hero />

        <ProviderMarquee />

        <PlaygroundPreview />

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

        <FinalCTA />
      </main>

      <SiteFooter />
    </>
  );
}
