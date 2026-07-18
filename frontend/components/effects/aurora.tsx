"use client";

import { cn } from "@/lib/utils";

interface AuroraProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

const INTENSITY_MAP = {
  low: "opacity-20",
  medium: "opacity-40",
  high: "opacity-60",
} as const;

export function Aurora({ className, intensity = "medium" }: AuroraProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        INTENSITY_MAP[intensity],
        className
      )}
      aria-hidden="true"
    >
      {/* Blob 1 — violet */}
      <div
        className="absolute -left-1/4 -top-1/4 h-[60%] w-[60%] animate-aurora-1 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      {/* Blob 2 — cyan */}
      <div
        className="absolute -right-1/4 top-1/4 h-[50%] w-[50%] animate-aurora-2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(circle, rgba(6,182,212,0.4) 0%, transparent 70%)",
          filter: "blur(90px)",
        }}
      />
      {/* Blob 3 — blue */}
      <div
        className="absolute -bottom-1/4 left-1/3 h-[55%] w-[55%] animate-aurora-3 rounded-full opacity-50"
        style={{
          background:
            "radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)",
          filter: "blur(100px)",
        }}
      />
      {/* Blob 4 — dark purple */}
      <div
        className="absolute right-1/4 top-1/2 h-[45%] w-[45%] animate-aurora-4 rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(circle, rgba(88,28,135,0.5) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* ponytail: keyframes injected via style tag, avoids tailwind config coupling */}
      <style jsx>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15%, 10%) scale(1.1); }
          66% { transform: translate(-10%, 15%) scale(0.95); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-20%, -10%) scale(1.05); }
          66% { transform: translate(10%, -15%) scale(1.1); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(10%, -20%) scale(1.08); }
          66% { transform: translate(-15%, 5%) scale(0.97); }
        }
        @keyframes aurora-4 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-10%, 10%) scale(1.05); }
          66% { transform: translate(20%, -10%) scale(1.1); }
        }
        .animate-aurora-1 { animation: aurora-1 15s ease-in-out infinite; }
        .animate-aurora-2 { animation: aurora-2 18s ease-in-out infinite; }
        .animate-aurora-3 { animation: aurora-3 20s ease-in-out infinite; }
        .animate-aurora-4 { animation: aurora-4 22s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .animate-aurora-1, .animate-aurora-2, .animate-aurora-3, .animate-aurora-4 {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
