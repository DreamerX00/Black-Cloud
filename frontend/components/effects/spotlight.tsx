"use client";
import { cn } from "@/lib/utils";

export function Spotlight({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-40 left-0 h-[80vh] w-[60vw]",
        "bg-[radial-gradient(closest-side,rgba(139,92,246,0.25),transparent)]",
        "blur-3xl animate-pulse",
        className,
      )}
      aria-hidden
    />
  );
}
