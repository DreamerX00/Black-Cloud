"use client";

import { cn } from "@/lib/utils";

interface ScanLineProps {
  className?: string;
  speed?: number; // seconds per sweep, default 8
}

export function ScanLine({ className, speed = 8 }: ScanLineProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="animate-scan-sweep absolute left-0 h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,92,246,0.15) 50%, transparent 100%)",
          opacity: 0.04,
          boxShadow: "0 0 20px 2px rgba(139,92,246,0.08)",
        }}
      />
      <style jsx>{`
        @keyframes scan-sweep {
          0% { top: -2px; }
          100% { top: 100%; }
        }
        .animate-scan-sweep {
          animation: scan-sweep ${speed}s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scan-sweep { animation: none; display: none; }
        }
      `}</style>
    </div>
  );
}
