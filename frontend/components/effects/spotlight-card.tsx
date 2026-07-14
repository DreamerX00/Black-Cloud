"use client"

import { useReducedMotion } from "motion/react"
import type { MouseEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function SpotlightCard({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const reduced = useReducedMotion()

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (reduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`)
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`)
  }

  return (
    <div
      onMouseMove={handleMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]",
        className,
      )}
    >
      {!reduced && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(400px circle at var(--x,50%) var(--y,50%), color-mix(in oklch, var(--accent-violet) 25%, transparent), transparent 70%)",
          }}
        />
      )}
      <div className="relative">{children}</div>
    </div>
  )
}
