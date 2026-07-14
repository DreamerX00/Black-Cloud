"use client";
import { create } from "zustand";

export type Tier = "full" | "reduced" | "no-webgl";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Pure: map scroll progress to an act index. p=0 is the pre-scroll boot state. */
export function actForProgress(p: number): number {
  const c = clamp01(p);
  if (c === 0) return 0;
  if (c < 0.2) return 1;
  if (c < 0.5) return 2;
  if (c < 0.75) return 3;
  return 4;
}

interface ScrollState {
  progress: number;
  act: number;
  tier: Tier;
  setProgress: (p: number) => void;
  setTier: (t: Tier) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  act: 0,
  tier: "full",
  setProgress: (p) => set({ progress: clamp01(p), act: actForProgress(p) }),
  setTier: (t) => set({ tier: t }),
}));
