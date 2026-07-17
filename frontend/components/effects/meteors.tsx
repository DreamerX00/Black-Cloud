"use client"

import { useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

// deterministic pseudo-random in [0,1) from an index (no Math.random for SSR stability)
function frac(i: number, seed: number) {
  const x = Math.sin((i + 1) * seed) * 43758.5453
  return x - Math.floor(x)
}

export function Meteors({ count = 20 }: { count?: number }) {
  const reduced = useReducedMotion()

  if (reduced) return null

  // Round to fixed precision so SSR and client serialize the identical style
  // string (full-precision floats round differently across the boundary → hydration mismatch).
  const meteors = Array.from({ length: count }, (_, i) => {
    const left = (frac(i, 12.9898) * 100).toFixed(3)
    const delay = (frac(i, 78.233) * 5).toFixed(3)
    const duration = (3 + frac(i, 37.719) * 5).toFixed(3)
    return { left, delay, duration }
  })

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {meteors.map((m, i) => (
        <span
          key={i}
          className={cn(
            "absolute top-0 h-0.5 w-0.5 rotate-[215deg] rounded-full",
            "bg-slate-200 shadow-[0_0_0_1px_#ffffff20]",
            "before:absolute before:top-1/2 before:h-px before:w-[60px]",
            "before:-translate-y-1/2 before:bg-gradient-to-r",
            "before:from-slate-300 before:to-transparent before:content-['']",
          )}
          style={{
            left: `${m.left}%`,
            animation: `meteor-fall ${m.duration}s linear ${m.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes meteor-fall {
          0% { transform: rotate(215deg) translateX(0); opacity: 1; }
          70% { opacity: 1; }
          100% { transform: rotate(215deg) translateX(-800px); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
