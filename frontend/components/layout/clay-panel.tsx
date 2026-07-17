import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

// Standardized claymorphism surface. `variant` maps to the globals.css clay
// classes so every panel across the universe stays consistent.
type ClayVariant = "raised" | "inset" | "pressable";

const VARIANT_CLASS: Record<ClayVariant, string> = {
  raised: "clay",
  inset: "clay-inset",
  pressable: "clay-pressable",
};

export function ClayPanel({
  children,
  className,
  variant = "raised",
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  variant?: ClayVariant;
  as?: "div" | "section" | "article" | "aside" | "li";
}) {
  return (
    <Tag className={cn(VARIANT_CLASS[variant], "p-6", className)}>{children}</Tag>
  );
}
