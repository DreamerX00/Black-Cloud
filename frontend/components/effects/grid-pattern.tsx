"use client"

import { useId } from "react"
import { cn } from "@/lib/utils"

export function GridPattern({ className }: { className?: string }) {
  const id = useId()

  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 h-full w-full",
        "[mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]",
        "text-white/10",
        className,
      )}
    >
      <defs>
        <pattern
          id={id}
          width={40}
          height={40}
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M40 0H0V40"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
