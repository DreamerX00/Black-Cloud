import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd className={cn("inline-flex min-w-[1.5rem] items-center justify-center rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] uppercase text-ink-dim", className)}>
      {children}
    </kbd>
  );
}
