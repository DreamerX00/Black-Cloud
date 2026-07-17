/**
 * Claymorphism surface primitives.
 *
 * Every panel/card/sidebar in BlackCloud composes these atoms so the elevation
 * ladder and provider-glow language stay consistent across pages.
 *
 * Elevation ladder (per DESIGN_SYSTEM §Elevation System):
 *   Level 0  Canvas             (no clay — bare background)
 *   Level 1  Cards              <ClayCard elevation="1">
 *   Level 2  Floating panels    <ClayPanel elevation="2">
 *   Level 3  Dialogs            <ClayPanel elevation="3">
 *   Level 4  Critical modals    <ClayPanel elevation="4">
 *
 * Provider variants light the surface with the cloud's brand glow — used on
 * dashboard project cards, node inspectors, and hero moments.
 */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────
 * ClayPanel — the workhorse surface. Bigger than a card, smaller than a sheet.
 * Used for sidebars, inspectors, modal bodies, section containers.
 * ──────────────────────────────────────────────────────────────────── */
const clayPanelVariants = cva(
  "clay relative isolate",
  {
    variants: {
      elevation: {
        1: "shadow-clay-1 rounded-clay-sm",
        2: "shadow-clay-2 rounded-clay",
        3: "shadow-clay-3 rounded-clay-lg",
        4: "shadow-clay-4 rounded-clay-lg",
        5: "shadow-clay-5 rounded-clay-xl",
      },
      tone: {
        default: "bg-[--clay-bg]",
        raised: "bg-[--clay-bg-2]",
        deep: "bg-[--clay-bg-3]",
        void: "bg-void border-white/[0.04]",
        aws: "bg-[--clay-bg] shadow-clay-aws",
        azure: "bg-[--clay-bg] shadow-clay-azure",
        gcp: "bg-[--clay-bg] shadow-clay-gcp",
        ai: "bg-[--clay-bg] shadow-clay-ai",
      },
      interactive: {
        true: "clay-bump cursor-pointer hover:bg-[--clay-bg-hover]",
        false: "",
      },
    },
    defaultVariants: {
      elevation: 2,
      tone: "default",
      interactive: false,
    },
  }
);

type ClayPanelProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof clayPanelVariants>;

const ClayPanel = React.forwardRef<HTMLDivElement, ClayPanelProps>(
  ({ className, elevation, tone, interactive, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="clay-panel"
      className={cn(
        clayPanelVariants({ elevation, tone, interactive }),
        className
      )}
      {...props}
    />
  )
);
ClayPanel.displayName = "ClayPanel";

/* ────────────────────────────────────────────────────────────────────────
 * ClayCard — smaller than a panel. Dashboard tiles, feature cards, node
 * previews. Anatomy: Header (label + optional icon) / Body / Footer.
 * ──────────────────────────────────────────────────────────────────── */
const ClayCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { interactive?: boolean }
>(({ className, interactive = false, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="clay-card"
    className={cn(
      "clay shadow-clay-2 rounded-clay bg-[--clay-bg]",
      "p-6 flex flex-col gap-4",
      interactive && "clay-bump cursor-pointer hover:bg-[--clay-bg-hover]",
      className
    )}
    {...props}
  />
));
ClayCard.displayName = "ClayCard";

const ClayCardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex items-start justify-between gap-4", className)} {...props} />
);
ClayCardHeader.displayName = "ClayCardHeader";

const ClayCardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("font-display text-lg font-semibold text-ink tracking-tight", className)}
    {...props}
  />
);
ClayCardTitle.displayName = "ClayCardTitle";

const ClayCardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-ink-muted leading-relaxed", className)}
    {...props}
  />
);
ClayCardDescription.displayName = "ClayCardDescription";

const ClayCardBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex-1", className)} {...props} />
);
ClayCardBody.displayName = "ClayCardBody";

const ClayCardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex items-center justify-between gap-3 pt-2", className)}
    {...props}
  />
);
ClayCardFooter.displayName = "ClayCardFooter";

/* ────────────────────────────────────────────────────────────────────────
 * ClayBadge — provider tag / status pill. Compact, high-contrast.
 * Composes with claymorphism at the smallest scale — no shadow ladder.
 * ──────────────────────────────────────────────────────────────────── */
const clayBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-mono uppercase tracking-wider",
  {
    variants: {
      tone: {
        default: "bg-graphite-2 text-ink-muted border border-white/5",
        aws: "bg-aws/10 text-aws border border-aws/30",
        azure: "bg-azure/10 text-azure border border-azure/30",
        gcp: "bg-gcp/10 text-gcp border border-gcp/30",
        ai: "bg-ai/10 text-ai border border-ai/30",
        success: "bg-success/10 text-success border border-success/30",
        warning: "bg-warning/10 text-warning border border-warning/30",
        danger: "bg-danger/10 text-danger border border-danger/30",
        info: "bg-info/10 text-info border border-info/30",
      },
      pulse: {
        true: "animate-[pulse-glow_2s_ease-in-out_infinite]",
        false: "",
      },
    },
    defaultVariants: {
      tone: "default",
      pulse: false,
    },
  }
);

type ClayBadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof clayBadgeVariants>;

const ClayBadge = React.forwardRef<HTMLSpanElement, ClayBadgeProps>(
  ({ className, tone, pulse, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(clayBadgeVariants({ tone, pulse }), className)}
      {...props}
    />
  )
);
ClayBadge.displayName = "ClayBadge";

/* ────────────────────────────────────────────────────────────────────────
 * ClayOrb — the signature interactive element. A round claymorphic surface
 * with a provider glow, used for dashboard project representations, feature
 * bullets, and the landing constellation.
 * ──────────────────────────────────────────────────────────────────── */
const clayOrbVariants = cva(
  [
    "clay clay-bump rounded-clay-full grid place-items-center",
    "relative isolate",
    "before:absolute before:inset-0 before:rounded-full",
    "before:bg-gradient-to-br before:from-white/10 before:to-transparent",
    "before:pointer-events-none",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "size-10 text-sm",
        md: "size-14 text-base",
        lg: "size-20 text-lg",
        xl: "size-32 text-2xl",
        hero: "size-48 text-4xl",
      },
      tone: {
        default: "bg-[--clay-bg-2] shadow-clay-2",
        aws: "bg-[--clay-bg] shadow-clay-aws text-aws",
        azure: "bg-[--clay-bg] shadow-clay-azure text-azure",
        gcp: "bg-[--clay-bg] shadow-clay-gcp text-gcp",
        ai: "bg-[--clay-bg] shadow-clay-ai text-ai",
        success: "bg-[--clay-bg] text-success shadow-clay-2 border border-success/30",
        warning: "bg-[--clay-bg] text-warning shadow-clay-2 border border-warning/30",
        danger: "bg-[--clay-bg] text-danger shadow-clay-2 border border-danger/30",
      },
    },
    defaultVariants: {
      size: "md",
      tone: "default",
    },
  }
);

type ClayOrbProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof clayOrbVariants>;

const ClayOrb = React.forwardRef<HTMLDivElement, ClayOrbProps>(
  ({ className, size, tone, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(clayOrbVariants({ size, tone }), className)}
      {...props}
    />
  )
);
ClayOrb.displayName = "ClayOrb";

/* ────────────────────────────────────────────────────────────────────────
 * ClayDivider — soft inset separator that reads as a valley pressed into
 * the claymorphic surface, not a hard line.
 * ──────────────────────────────────────────────────────────────────── */
const ClayDivider = ({
  className,
  orientation = "horizontal",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
}) => (
  <div
    aria-orientation={orientation}
    className={cn(
      "shrink-0",
      orientation === "horizontal"
        ? "h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        : "w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent",
      className
    )}
    {...props}
  />
);
ClayDivider.displayName = "ClayDivider";

/* ────────────────────────────────────────────────────────────────────────
 * HUD (glass floater) — used for canvas toolbars, inspector overlays,
 * anything that must float ABOVE claymorphic surfaces (per Surface Style
 * rules in DESIGN_SYSTEM).
 * ──────────────────────────────────────────────────────────────────── */
const HUD = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { tone?: "default" | "ai" }
>(({ className, tone = "default", ...props }, ref) => (
  <div
    ref={ref}
    data-slot="hud"
    className={cn(
      tone === "ai" ? "glass-ai" : "glass",
      "p-3 flex items-center gap-2",
      className
    )}
    {...props}
  />
));
HUD.displayName = "HUD";

/* ────────────────────────────────────────────────────────────────────────
 * BrutAlert — used ONLY for warnings/critical/destructive per DESIGN_SYSTEM.
 * Sharp, high-contrast, mono-caps. This exists as a deliberate visual
 * interrupt against the surrounding claymorphism.
 * ──────────────────────────────────────────────────────────────────── */
const BrutAlert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    tone?: "warning" | "danger" | "info";
  }
>(({ className, tone = "warning", children, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="brut-alert"
    role="alert"
    className={cn(
      "brut px-4 py-3 flex items-start gap-3 text-xs",
      tone === "warning" && "brut-warning bg-warning/[0.06] text-warning",
      tone === "danger" && "brut-danger bg-danger/[0.06] text-danger",
      tone === "info" && "border-info bg-info/[0.06] text-info shadow-[4px_4px_0_var(--bc-info)]",
      className
    )}
    {...props}
  >
    {children}
  </div>
));
BrutAlert.displayName = "BrutAlert";

export {
  ClayPanel,
  ClayCard,
  ClayCardHeader,
  ClayCardTitle,
  ClayCardDescription,
  ClayCardBody,
  ClayCardFooter,
  ClayBadge,
  ClayOrb,
  ClayDivider,
  HUD,
  BrutAlert,
  clayPanelVariants,
  clayBadgeVariants,
  clayOrbVariants,
};
