import { cn } from "@/lib/cn";

const map = {
  aws:   { dot: "bg-aws", ring: "border-aws/40", tint: "text-aws" },
  azure: { dot: "bg-azure", ring: "border-azure/40", tint: "text-azure" },
  gcp:   { dot: "bg-gcp", ring: "border-gcp/40", tint: "text-gcp" },
} as const;

export function ProviderChip({
  provider,
  label,
  className,
}: {
  provider: keyof typeof map;
  label?: string;
  className?: string;
}) {
  const c = map[provider];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border bg-white/[0.02] px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest",
        c.ring,
        c.tint,
        className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full animate-pulse-slow", c.dot)} />
      {label ?? provider}
    </span>
  );
}
