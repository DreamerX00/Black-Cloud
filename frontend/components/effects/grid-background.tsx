"use client";

import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  variant?: "dots" | "lines" | "cross";
  className?: string;
}

function pattern(variant: "dots" | "lines" | "cross") {
  const size = 24;
  const stroke = "rgba(139,92,246,0.25)";

  if (variant === "dots") {
    return (
      <pattern id="grid-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
        <circle cx={size / 2} cy={size / 2} r={1} fill={stroke} />
      </pattern>
    );
  }

  if (variant === "lines") {
    return (
      <pattern id="grid-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
        <line x1={0} y1={size} x2={size} y2={size} stroke={stroke} strokeWidth={0.5} />
        <line x1={size} y1={0} x2={size} y2={size} stroke={stroke} strokeWidth={0.5} />
      </pattern>
    );
  }

  // cross
  const half = size / 2;
  const arm = 3;
  return (
    <pattern id="grid-pattern" width={size} height={size} patternUnits="userSpaceOnUse">
      <line x1={half - arm} y1={half} x2={half + arm} y2={half} stroke={stroke} strokeWidth={0.5} />
      <line x1={half} y1={half - arm} x2={half} y2={half + arm} stroke={stroke} strokeWidth={0.5} />
    </pattern>
  );
}

export function GridBackground({ variant = "dots", className }: GridBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
      style={{
        maskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
        opacity: 0.2,
      }}
    >
      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
        {pattern(variant)}
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>
  );
}
