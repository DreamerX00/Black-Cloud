import { cn } from "@/lib/cn";

/**
 * BlackCloud symbol: three overlapping node-orbits — the graph made mark.
 * Pure SVG, no client bundle cost, tints from `currentColor`.
 */
export function BlackCloudMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("block", className)}
    >
      <defs>
        <linearGradient id="bcm-a" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0" stopColor="#8b5cf6" />
          <stop offset="0.5" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#ff9900" />
        </linearGradient>
        <radialGradient id="bcm-b" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="20" cy="20" r="18" stroke="url(#bcm-a)" strokeWidth="1.5" opacity="0.9" />
      <ellipse cx="20" cy="20" rx="18" ry="8" stroke="url(#bcm-a)" strokeWidth="1" opacity="0.7" transform="rotate(30 20 20)" />
      <ellipse cx="20" cy="20" rx="18" ry="8" stroke="url(#bcm-a)" strokeWidth="1" opacity="0.7" transform="rotate(-30 20 20)" />
      <circle cx="20" cy="20" r="5" fill="url(#bcm-b)" />
      <circle cx="20" cy="20" r="2" fill="#fff" />
    </svg>
  );
}
