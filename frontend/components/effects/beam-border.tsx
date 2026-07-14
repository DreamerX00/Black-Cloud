"use client"

import { useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function BeamBorder({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const reduced = useReducedMotion()

  return (
    <div className={cn("relative rounded-2xl p-px", className)}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-[inherit] overflow-hidden"
      >
        <div
          className="absolute inset-[-100%]"
          style={{
            backgroundImage:
              "conic-gradient(from var(--beam-angle,0deg), transparent 0deg, var(--accent-violet) 60deg, var(--accent-cyan) 120deg, transparent 180deg)",
            animation: reduced
              ? undefined
              : "beam-spin 4s linear infinite",
          }}
        />
      </div>
      <div className="relative h-full rounded-[inherit] bg-background/90 backdrop-blur-sm">
        {children}
      </div>
      <style>{`
        @property --beam-angle {
          syntax: '<angle>';
          inherits: false;
          initial-value: 0deg;
        }
        @keyframes beam-spin { to { --beam-angle: 360deg; } }
      `}</style>
    </div>
  )
}
