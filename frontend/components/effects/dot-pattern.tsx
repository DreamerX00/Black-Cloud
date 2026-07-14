"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

export function DotPattern({ className }: { className?: string }) {
  const id = useId()

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 h-full w-full",
        "[mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)]",
        "text-foreground/15",
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          width={24}
          height={24}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={2} cy={2} r={1.4} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
