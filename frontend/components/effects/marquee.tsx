"use client"

import { useReducedMotion } from "motion/react"
import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Marquee({
  children,
  reverse,
  speed = 30,
  className,
}: {
  children: ReactNode
  reverse?: boolean
  speed?: number
  className?: string
}) {
  const reduced = useReducedMotion()

  return (
    <div
      className={cn(
        "group flex w-full overflow-hidden [--gap:2rem]",
        className,
      )}
    >
      {[0, 1].map((k) => (
        <div
          key={k}
          aria-hidden={k === 1 || undefined}
          className={cn(
            "flex shrink-0 items-center gap-[var(--gap)] pr-[var(--gap)]",
            !reduced && "animate-[marquee-scroll_linear_infinite]",
            !reduced && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            animationDuration: reduced ? undefined : `${speed}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
      <style>{`
        @keyframes marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-100% - var(--gap))); }
        }
      `}</style>
    </div>
  )
}
