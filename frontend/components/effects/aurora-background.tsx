"use client"

import { useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function AuroraBackground({
  className,
  children,
}: {
  className?: string
  children?: ReactNode
}) {
  const reduced = useReducedMotion()

  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div
          className={cn(
            "absolute -left-1/4 -top-1/4 h-[60vh] w-[60vh] rounded-full opacity-60 blur-3xl",
            "bg-[radial-gradient(circle_at_center,var(--accent-violet),transparent_60%)]",
            !reduced && "animate-[aurora-drift-a_18s_ease-in-out_infinite]",
          )}
        />
        <div
          className={cn(
            "absolute -right-1/4 top-1/3 h-[55vh] w-[55vh] rounded-full opacity-50 blur-3xl",
            "bg-[radial-gradient(circle_at_center,var(--accent-cyan),transparent_60%)]",
            !reduced && "animate-[aurora-drift-b_22s_ease-in-out_infinite]",
          )}
        />
        <div
          className={cn(
            "absolute bottom-0 left-1/3 h-[50vh] w-[50vh] rounded-full opacity-40 blur-3xl",
            "bg-[radial-gradient(circle_at_center,#6366f1,transparent_60%)]",
            !reduced && "animate-[aurora-drift-c_26s_ease-in-out_infinite]",
          )}
        />
      </div>
      <style>{`
        @keyframes aurora-drift-a {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20vw,12vh) scale(1.2); }
        }
        @keyframes aurora-drift-b {
          0%,100% { transform: translate(0,0) scale(1.1); }
          50% { transform: translate(-16vw,-10vh) scale(0.9); }
        }
        @keyframes aurora-drift-c {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(10vw,-14vh) scale(1.25); }
        }
      `}</style>
      {children}
    </div>
  )
}
