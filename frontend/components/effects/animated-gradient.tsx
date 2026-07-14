"use client"

import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export function AnimatedGradient({ className }: { className?: string }) {
  const reduced = useReducedMotion()

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 opacity-70",
        className,
      )}
      style={{
        backgroundImage:
          "conic-gradient(from var(--ag-angle,0deg) at 50% 50%, var(--accent-violet), var(--accent-cyan), #6366f1, #a855f7, var(--accent-violet))",
        backgroundSize: "180% 180%",
        filter: "blur(80px) saturate(1.3)",
        animation: reduced
          ? undefined
          : "ag-spin 24s linear infinite, ag-shift 16s ease-in-out infinite alternate",
      }}
    >
      <style>{`
        @property --ag-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes ag-spin { to { --ag-angle: 360deg; } }
        @keyframes ag-shift {
          from { background-position: 0% 50%; }
          to { background-position: 100% 50%; }
        }
      `}</style>
    </div>
  )
}
