"use client"

import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export function SplitText({
  text,
  className,
  as = "span",
}: {
  text: string
  className?: string
  as?: "span" | "div" | "h1" | "h2" | "h3" | "p"
}) {
  const reduced = useReducedMotion()
  const Tag = as

  if (reduced) {
    return <Tag className={className}>{text}</Tag>
  }

  const words = text.split(" ")

  return (
    <Tag className={cn("inline-block", className)}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: "0.6em", opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{
                delay: (wi * 4 + ci) * 0.025,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}
