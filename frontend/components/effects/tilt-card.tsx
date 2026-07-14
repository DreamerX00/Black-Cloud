"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import type { MouseEvent, ReactNode } from "react"
import { cn } from "@/lib/utils"

export function TiltCard({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 20 })
  const springY = useSpring(y, { stiffness: 200, damping: 20 })
  const rotateX = useTransform(springY, [-0.5, 0.5], ["10deg", "-10deg"])
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-10deg", "10deg"])

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  if (reduced) {
    return <div className={cn("rounded-2xl", className)}>{children}</div>
  }

  return (
    <motion.div
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={cn("rounded-2xl [perspective:1000px]", className)}
    >
      {children}
    </motion.div>
  )
}
