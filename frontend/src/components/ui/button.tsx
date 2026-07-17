import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

/**
 * BlackCloud Button — surface-role aware.
 *
 * Variants map to the three DESIGN_SYSTEM.md surface roles:
 *   - clay*   → claymorphism (panels, primary CTAs, provider actions)
 *   - glass*  → glassmorphism (floating controls, toolbars)
 *   - brut*   → brutalism (warnings, destructive confirmations)
 *   - default/outline/ghost/link → traditional shadcn variants (kept for
 *     forms, dropdowns, and small controls where clay would be overkill)
 *
 * All clay variants use physics-spring easing on hover/active so buttons
 * feel like they're being pressed into and popping out of the surface.
 */
const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2",
    "rounded-md text-sm font-medium whitespace-nowrap",
    "transition-all outline-none",
    "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        // ── Traditional shadcn variants (kept for compatibility) ──────
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:bg-destructive/60 dark:focus-visible:ring-destructive/40",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        // ── Claymorphism ─────────────────────────────────────────────
        // Base clay button — soft, elevated, physics-spring press.
        clay: [
          "clay clay-bump rounded-clay-sm",
          "bg-[--clay-bg] text-ink",
          "hover:bg-[--clay-bg-hover] active:bg-[--clay-bg-active]",
          "active:shadow-[var(--clay-shadow-inset)]",
        ].join(" "),

        // Primary AI action — the "generate", "run architect" moment.
        "clay-primary": [
          "clay clay-bump rounded-clay-sm relative overflow-hidden",
          "bg-gradient-to-br from-ai to-azure text-void font-semibold",
          "shadow-clay-ai hover:shadow-clay-ai",
          "hover:brightness-110 active:brightness-95",
          "before:absolute before:inset-0 before:bg-[var(--bc-grad-shimmer)] before:bg-[length:200%_100%]",
          "before:animate-[shimmer_3s_linear_infinite] before:opacity-0 hover:before:opacity-100",
          "before:transition-opacity before:duration-300",
        ].join(" "),

        // Provider-flavored claymorphic actions.
        "clay-aws": [
          "clay clay-bump rounded-clay-sm",
          "bg-[--clay-bg] text-aws border border-aws/40",
          "hover:shadow-clay-aws hover:text-white hover:bg-aws/10",
        ].join(" "),
        "clay-azure": [
          "clay clay-bump rounded-clay-sm",
          "bg-[--clay-bg] text-azure border border-azure/40",
          "hover:shadow-clay-azure hover:text-white hover:bg-azure/10",
        ].join(" "),
        "clay-gcp": [
          "clay clay-bump rounded-clay-sm",
          "bg-[--clay-bg] text-gcp border border-gcp/40",
          "hover:shadow-clay-gcp hover:text-white hover:bg-gcp/10",
        ].join(" "),

        // Ghost clay — inset instead of raised. For toggles, secondary actions.
        "clay-ghost": [
          "rounded-clay-sm bg-transparent text-ink-muted",
          "hover:bg-[--clay-bg-hover] hover:text-ink hover:shadow-clay-1",
          "active:shadow-[var(--clay-shadow-inset)]",
          "transition-all duration-200",
        ].join(" "),

        // ── Glassmorphism ────────────────────────────────────────────
        glass: [
          "glass rounded-lg text-ink",
          "hover:bg-[var(--glass-bg-strong)] hover:border-[var(--glass-border-strong)]",
          "backdrop-blur-xl",
        ].join(" "),
        "glass-ai": [
          "glass-ai rounded-lg text-ink font-medium",
          "hover:brightness-125",
        ].join(" "),

        // ── Brutalism ────────────────────────────────────────────────
        // Reserved for warnings/destructive/critical actions per DESIGN_SYSTEM.
        "brut-warning": [
          "brut brut-warning bg-warning/10 text-warning",
          "hover:translate-x-[-2px] hover:translate-y-[-2px]",
          "hover:shadow-[6px_6px_0_var(--bc-warning)]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--bc-warning)]",
          "transition-all duration-100",
        ].join(" "),
        "brut-danger": [
          "brut brut-danger bg-danger/10 text-danger",
          "hover:translate-x-[-2px] hover:translate-y-[-2px]",
          "hover:shadow-[6px_6px_0_var(--bc-danger)]",
          "active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0_var(--bc-danger)]",
          "transition-all duration-100",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-md px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-clay-sm px-6 text-base has-[>svg]:px-4",
        xl: "h-14 rounded-clay px-8 text-base has-[>svg]:px-6",
        hero: "h-16 rounded-clay px-10 text-lg has-[>svg]:px-8",
        icon: "size-9",
        "icon-xs": "size-6 rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
        "icon-xl": "size-14",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
