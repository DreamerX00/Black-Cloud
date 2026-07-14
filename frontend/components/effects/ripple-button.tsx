"use client"

import { useReducedMotion } from "motion/react"
import { useState, type ComponentProps, type MouseEvent } from "react"
import { cn } from "@/lib/utils"

type Ripple = { id: number; x: number; y: number; size: number }

export function RippleButton({
  className,
  children,
  onClick,
  ...props
}: ComponentProps<"button">) {
  const reduced = useReducedMotion()
  const [ripples, setRipples] = useState<Ripple[]>([])

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    if (!reduced) {
      const rect = e.currentTarget.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const id = Date.now()
      setRipples((r) => [
        ...r,
        {
          id,
          x: e.clientX - rect.left - size / 2,
          y: e.clientY - rect.top - size / 2,
          size,
        },
      ])
      setTimeout(() => {
        setRipples((r) => r.filter((rp) => rp.id !== id))
      }, 600)
    }
    onClick?.(e)
  }

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        "relative overflow-hidden rounded-lg px-4 py-2 isolate",
        className,
      )}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          aria-hidden
          className="pointer-events-none absolute rounded-full bg-white/40"
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
            animation: "ripple-expand 0.6s ease-out forwards",
          }}
        />
      ))}
      <span className="relative">{children}</span>
      <style>{`
        @keyframes ripple-expand {
          from { transform: scale(0); opacity: 0.6; }
          to { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </button>
  )
}
