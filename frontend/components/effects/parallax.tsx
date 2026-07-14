"use client"

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

export function Parallax({
  children,
  speed = 0.3,
  className,
}: {
  children: ReactNode
  speed?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`${speed * 100}%`, `${-speed * 100}%`],
  )

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    )
  }

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  )
}
