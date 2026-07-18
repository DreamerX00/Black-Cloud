import { createElement, type HTMLAttributes, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "sm" | "md" | "lg" | "inset";

type ClayCardProps = {
  as?: ElementType;
  variant?: Variant;
  glow?: "ai" | "aws" | "azure" | "gcp" | "info" | "success" | "danger";
  interactive?: boolean;
  className?: string;
  children?: ReactNode;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

/**
 * Claymorphic surface. Every panel, card, sidebar and floating tool
 * in the app should ultimately render one of these.
 */
export function ClayCard({
  as: Tag = "div",
  variant = "md",
  glow,
  interactive,
  className,
  children,
  ...rest
}: ClayCardProps) {
  const base =
    variant === "sm" ? "clay-sm" : variant === "lg" ? "clay-lg" : variant === "inset" ? "clay-inset" : "clay";
  const glowClass =
    glow === "ai" ? "shadow-glow-ai" :
    glow === "aws" ? "shadow-glow-aws" :
    glow === "azure" ? "shadow-glow-azure" :
    glow === "gcp" ? "shadow-glow-gcp" :
    glow === "info" ? "shadow-[0_0_40px_rgba(56,189,248,0.35)]" :
    glow === "success" ? "shadow-[0_0_40px_rgba(34,197,94,0.35)]" :
    glow === "danger" ? "shadow-[0_0_40px_rgba(239,68,68,0.35)]" : "";
  const inter = interactive
    ? "transition-transform duration-300 will-change-transform hover:-translate-y-0.5 hover:shadow-clay-lg"
    : "";
  // Polymorphic Tag with children — createElement dodges the JSX-union
  // `children: never` narrowing under React 19 types.
  return createElement(
    Tag,
    { className: cn(base, glowClass, inter, className), ...rest },
    children
  );
}
