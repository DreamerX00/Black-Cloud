import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Eyebrow({
  children,
  tone = "ai",
  className,
}: {
  children: ReactNode;
  tone?: "ai" | "aws" | "azure" | "gcp" | "success" | "danger";
  className?: string;
}) {
  const dot = {
    ai: "bg-ai",
    aws: "bg-aws",
    azure: "bg-azure",
    gcp: "bg-gcp",
    success: "bg-success",
    danger: "bg-danger",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-ink-dim",
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-slow", dot)} />
      {children}
    </span>
  );
}
