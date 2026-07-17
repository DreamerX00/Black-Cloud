"use client";

import { motion, useReducedMotion } from "motion/react";
import { Reveal } from "@/components/motion/reveal";
import { PROVIDER_META } from "@/lib/nodes/registry";
import { ClayOrb } from "@/components/ui/clay";
import { Sparkles, Cloud, Shield, DragHandle, ProviderMark } from "@/components/icons";

/**
 * Bento tile micro-visuals — claymorphic 2D compositions. The old R3F
 * per-tile canvases were removed because they consumed 4 WebGL contexts
 * beside the main landing scene canvas. Claymorphism carries the depth.
 */
const floatAnim = { y: [0, -8, 0] };
const floatTransition = { duration: 4, repeat: Infinity, ease: "easeInOut" as const };

const CopilotScene3D = () => (
  <div className="absolute inset-0 grid place-items-center">
    <motion.div animate={floatAnim} transition={floatTransition}>
      <ClayOrb size="lg" tone="ai" className="animate-[pulse-glow_3s_ease-in-out_infinite]">
        <Sparkles className="size-8" />
      </ClayOrb>
    </motion.div>
  </div>
);
const MultiCloudScene3D = () => (
  <div className="absolute inset-0 grid place-items-center">
    <div className="flex items-center gap-3">
      <motion.div animate={floatAnim} transition={floatTransition}>
        <ClayOrb size="md" tone="aws"><ProviderMark provider="aws" className="size-5" /></ClayOrb>
      </motion.div>
      <motion.div animate={floatAnim} transition={{ ...floatTransition, delay: 0.4 }}>
        <ClayOrb size="md" tone="azure"><ProviderMark provider="azure" className="size-5" /></ClayOrb>
      </motion.div>
      <motion.div animate={floatAnim} transition={{ ...floatTransition, delay: 0.8 }}>
        <ClayOrb size="md" tone="gcp"><ProviderMark provider="gcp" className="size-5" /></ClayOrb>
      </motion.div>
    </div>
  </div>
);
const ValidationScene3D = () => (
  <div className="absolute inset-0 grid place-items-center">
    <motion.div animate={floatAnim} transition={floatTransition}>
      <ClayOrb size="lg" tone="success">
        <Shield className="size-8" />
      </ClayOrb>
    </motion.div>
  </div>
);
const DragScene3D = () => (
  <div className="absolute inset-0 grid place-items-center">
    <motion.div animate={floatAnim} transition={floatTransition}>
      <ClayOrb size="lg" tone="default">
        <DragHandle className="size-8 text-ai" />
      </ClayOrb>
    </motion.div>
  </div>
);
// Cloud icon may be referenced by legacy tile JSX; keep it imported so
// tsc doesn't flag unused-var if we mid-refactor later.
void Cloud;

/**
 * BentoGrid — Act III of the landing scroll.
 *
 * Asymmetric 6-tile grid (Linear / Raycast / Vercel visual grammar).
 * Each tile carries its own kinetic micro-visual so the section rewards a
 * lingering eye. All tiles share the same corner-radius and border language
 * so the composition reads as one panel rather than a slideshow.
 *
 * Grid layout (desktop, 6 columns × 4 rows):
 *   ┌──────── validation (4×2) ──────────┬─── ai copilot (2×2) ───┐
 *   ├─── cost (2×2) ────┬─── export (2×2) ┼─── drag (2×2) ─────────┤
 *   └────────── multi-cloud (6×1 wide) ─────────────────────────────┘
 */
export function BentoGrid() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 tablet:px-10 tablet:py-32">
      <header className="mb-14 max-w-3xl">
        <Reveal>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            Act III · What it does
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-[-0.02em] tablet:text-6xl">
            One canvas.{" "}
            <span className="bg-gradient-to-r from-ai via-gcp to-aws bg-clip-text text-transparent">
              Every problem
            </span>
            {" "}an architect has, solved.
          </h2>
        </Reveal>
      </header>

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-6 tablet:grid-rows-[repeat(4,minmax(150px,auto))]">
        <BentoTile
          className="tablet:col-span-4 tablet:row-span-2"
          eyebrow="Real-time validation"
          title="Bad edges catch themselves."
          body="Every connection is checked the instant you draw it. Rules encode 12 years of production incidents so you never repeat them."
          accent="#22C55E"
        >
          <ValidationVisual />
        </BentoTile>

        <BentoTile
          className="tablet:col-span-2 tablet:row-span-2"
          eyebrow="AI copilot"
          title="Ask, don't hunt."
          body='"Where should this Lambda sit?" — the copilot reads your canvas and answers with a redraw.'
          accent="#8B5CF6"
        >
          <CopilotVisual />
        </BentoTile>

        <BentoTile
          className="tablet:col-span-2 tablet:row-span-1"
          eyebrow="Cost preview"
          title="See the bill before you build it."
          body="Live monthly estimate as you drop nodes."
          accent="#F59E0B"
        >
          <CostVisual />
        </BentoTile>

        <BentoTile
          className="tablet:col-span-2 tablet:row-span-1"
          eyebrow="One-click export"
          title="Terraform, out."
          body="PNG, SVG, JSON, Terraform — every canvas is portable."
          accent="#4285F4"
        >
          <ExportBadges />
        </BentoTile>

        <BentoTile
          className="tablet:col-span-2 tablet:row-span-1"
          eyebrow="Drag & drop"
          title="Zero-friction placement."
          body="Snap to grid, magnetic edges, palette that filters as you type."
          accent="#EDEDED"
        >
          <DragVisual />
        </BentoTile>

        <BentoTile
          className="tablet:col-span-6 tablet:row-span-1"
          eyebrow="Multi-cloud"
          title="AWS, Azure, GCP — same visual language."
          body="Every service across every provider speaks the same graph."
          accent="#8B5CF6"
        >
          <MultiCloudVisual />
        </BentoTile>
      </div>
    </section>
  );
}

/* ── Tile shell ─────────────────────────────────────────────────────────── */

function BentoTile({
  className = "",
  eyebrow,
  title,
  body,
  accent,
  children,
}: {
  className?: string;
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  children?: React.ReactNode;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-graphite/40 p-6 backdrop-blur transition-colors hover:border-border ${className}`}
    >
      {/* Accent glow — bloom on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${accent}22, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex-1">{children}</div>

      <div className="relative z-10 mt-6">
        <div
          className="text-[10px] uppercase tracking-[0.3em]"
          style={{ color: accent }}
        >
          {eyebrow}
        </div>
        <h3 className="mt-2 font-display text-xl font-medium leading-snug tracking-tight tablet:text-2xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{body}</p>
      </div>
    </motion.article>
  );
}

/* ── Tile visuals ───────────────────────────────────────────────────────── */

function ValidationVisual() {
  // R3F scene: cube + wobbling torus, with the SVG toast still overlaid so
  // the tile keeps its "validator flagged this" narrative.
  const reduce = useReducedMotion();
  return (
    <div className="relative h-44 w-full overflow-hidden rounded-lg">
      {reduce ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-14 w-14 rounded-lg bg-success/40" />
        </div>
      ) : (
        <ValidationScene3D />
      )}
      {/* Overlay toast — HTML on top of canvas so text stays crisp. */}
      <div className="pointer-events-none absolute right-3 top-3 rounded-md border border-danger/50 bg-danger/15 px-2 py-1 font-mono text-[10px] text-danger backdrop-blur">
        ! rule 24 · public RDS
      </div>
    </div>
  );
}

function CopilotVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-56 w-full overflow-hidden rounded-xl bg-void/40">
      {reduce ? (
        <div className="flex h-full items-center justify-center">
          <div className="h-16 w-16 animate-pulse rounded-full bg-ai/40" />
        </div>
      ) : (
        <CopilotScene3D />
      )}
      {/* Chat pop overlaid on the 3D orb — the orb IS the copilot. */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="pointer-events-none absolute bottom-3 left-3 right-3 rounded-lg border border-border/50 bg-graphite/70 px-3 py-2 font-mono text-[11px] text-muted-foreground backdrop-blur"
      >
        <span className="text-ink">Behind the ALB, inside VPC-A.</span>{" "}
        <span className="text-ai">Redraw?</span>
      </motion.div>
    </div>
  );
}

function CostVisual() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Est · Monthly
        </div>
        <div className="mt-1 font-display text-4xl font-semibold text-warning">
          $412
        </div>
        <div className="mt-1 text-[10px] text-muted-foreground">
          <span className="text-success">−18%</span> vs. last plan
        </div>
      </div>
    </div>
  );
}

function ExportBadges() {
  const formats = [
    { label: "PNG", color: "#8B5CF6" },
    { label: "SVG", color: "#4285F4" },
    { label: "JSON", color: "#22C55E" },
    { label: "TF", color: "#FF9900" },
  ];
  return (
    <div className="grid h-full grid-cols-2 gap-2">
      {formats.map((f) => (
        <div
          key={f.label}
          className="flex items-center justify-center rounded-md border border-border/50 bg-void/40 font-mono text-xs"
          style={{ boxShadow: `inset 2px 0 0 0 ${f.color}` }}
        >
          .{f.label.toLowerCase()}
        </div>
      ))}
    </div>
  );
}

function DragVisual() {
  const reduce = useReducedMotion();
  return (
    <div className="relative h-32 overflow-hidden rounded-lg border border-border/40 bg-void/40">
      {/* Grid backdrop first so the 3D cube reads as "on the canvas" */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      {reduce ? (
        <div className="absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-lg border border-ai/60 bg-ai/20" />
      ) : (
        <div className="absolute inset-0">
          <DragScene3D />
        </div>
      )}
    </div>
  );
}

function MultiCloudVisual() {
  const providers = (["aws", "azure", "gcp"] as const).map((k) => PROVIDER_META[k]);
  const reduce = useReducedMotion();
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-6">
      {/* Provider chip row */}
      <div className="flex flex-wrap items-center gap-3">
        {providers.map((p) => (
          <div
            key={p.label}
            className="flex shrink-0 items-center gap-3 rounded-lg border border-border/50 bg-void/40 px-4 py-2"
            style={{ boxShadow: `inset 3px 0 0 0 ${p.accent}` }}
          >
            <div className="font-display text-lg font-semibold" style={{ color: p.accent }}>
              {p.label}
            </div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {p.count} services
            </div>
          </div>
        ))}
      </div>

      {/* 3D torus-knot centerpiece on the right, hidden on narrow layouts */}
      <div className="hidden h-24 w-32 tablet:block">
        {reduce ? (
          <div className="h-full w-full rounded-lg bg-gradient-to-br from-ai/30 via-gcp/30 to-aws/30" />
        ) : (
          <MultiCloudScene3D />
        )}
      </div>
    </div>
  );
}
