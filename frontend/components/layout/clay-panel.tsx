"use client";

import { type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface ClayPanelProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hoverable?: boolean;
}

export function ClayPanel({
  children,
  className = "",
  glowColor,
  hoverable = false,
}: ClayPanelProps) {
  const style = glowColor
    ? {
        boxShadow: `0 0 24px 0 ${glowColor}20, inset 2px 2px 4px rgba(255,255,255,0.05), inset -2px -2px 4px rgba(0,0,0,0.3), 4px 4px 12px rgba(0,0,0,0.5)`,
        borderColor: `${glowColor}30`,
      }
    : undefined;

  if (hoverable) {
    return (
      <motion.div
        className={cn("clay-panel", className)}
        style={style}
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn("clay-panel", className)} style={style}>
      {children}
    </div>
  );
}
