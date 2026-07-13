"use client";

import { useSyncExternalStore } from "react";

/**
 * Semantic breakpoint hook mirroring DESIGN_SYSTEM.md tiers.
 *
 * Uses `useSyncExternalStore` so subscription lives outside React state
 * — this is the React 19 canonical shape for external subscriptions and
 * silences the `set-state-in-effect` lint permanently.
 *
 * Prefer CSS (Tailwind `tablet:`/`desktop:`/`ultra:` variants) for layout;
 * use this hook ONLY when JS behavior must branch (e.g. mobile playground
 * switches to read-only overview per MVP.md §Responsive).
 */
export type Breakpoint = "mobile" | "tablet" | "desktop" | "ultra";

const QUERIES = {
  tablet: "(min-width: 768px)",
  desktop: "(min-width: 1280px)",
  ultra: "(min-width: 1920px)",
} as const;

function readClient(): Breakpoint {
  if (typeof window === "undefined") return "desktop";
  if (window.matchMedia(QUERIES.ultra).matches) return "ultra";
  if (window.matchMedia(QUERIES.desktop).matches) return "desktop";
  if (window.matchMedia(QUERIES.tablet).matches) return "tablet";
  return "mobile";
}

function subscribe(cb: () => void): () => void {
  const mqs = [
    window.matchMedia(QUERIES.tablet),
    window.matchMedia(QUERIES.desktop),
    window.matchMedia(QUERIES.ultra),
  ];
  mqs.forEach((mq) => mq.addEventListener("change", cb));
  return () => mqs.forEach((mq) => mq.removeEventListener("change", cb));
}

export function useBreakpoint(): Breakpoint {
  return useSyncExternalStore(
    subscribe,
    readClient,
    () => "desktop", // SSR snapshot — stable, hydrates to real value on client
  );
}

/** True when the viewport is at or above the given breakpoint. */
export function useMinBreakpoint(min: Exclude<Breakpoint, "mobile">): boolean {
  const bp = useBreakpoint();
  const order: Breakpoint[] = ["mobile", "tablet", "desktop", "ultra"];
  return order.indexOf(bp) >= order.indexOf(min);
}
