"use client";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function ShimmerButton({ className, children, ...props }: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className={cn(
        "relative overflow-hidden rounded-full border border-white/15 bg-zinc-900 px-8 py-3 font-medium text-white",
        "transition-transform hover:scale-[1.03] active:scale-95",
        "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r",
        "before:from-transparent before:via-white/25 before:to-transparent before:transition-transform",
        "before:duration-1000 hover:before:translate-x-full",
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
}
