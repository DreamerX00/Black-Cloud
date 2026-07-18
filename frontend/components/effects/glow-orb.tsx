"use client";

import { cn } from "@/lib/utils";

interface GlowOrbProps {
  color?: string;
  size?: number;
  className?: string;
}

export function GlowOrb({
  color = "rgba(139,92,246,0.3)",
  size = 300,
  className,
}: GlowOrbProps) {
  return (
    <div
      className={cn("pointer-events-none absolute animate-glow-float", className)}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(60px)",
      }}
    >
      {/* ponytail: keyframes inline, one element */}
      <style jsx>{`
        @keyframes glow-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animate-glow-float { animation: glow-float 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-glow-float { animation: none; }
        }
      `}</style>
    </div>
  );
}
