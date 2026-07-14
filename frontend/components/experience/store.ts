"use client";

import { create } from "zustand";

// Shared experience state. One camera scene, two modes. The camera-rig reads
// `mode` + `railProgress`; the HUD reads `focusedService`; free-roam controls
// write movement-derived state. Kept tiny + framework-agnostic.
export type ExperienceMode = "cinematic" | "roam";

interface ExperienceState {
  mode: ExperienceMode;
  /** 0..1 progress along the cinematic spline (scroll-driven). */
  railProgress: number;
  /** Service id the player is near / looking at in free-roam, or null. */
  focusedService: string | null;
  /** True while the Enter→roam "warp" transition is animating. */
  warping: boolean;

  enterWorld: () => void;
  exitToCinematic: () => void;
  setRailProgress: (p: number) => void;
  setFocusedService: (id: string | null) => void;
  setWarping: (w: boolean) => void;
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export const useExperience = create<ExperienceState>((set) => ({
  mode: "cinematic",
  railProgress: 0,
  focusedService: null,
  warping: false,

  enterWorld: () => set({ mode: "roam", focusedService: null }),
  exitToCinematic: () => set({ mode: "cinematic", focusedService: null }),
  setRailProgress: (p) => set({ railProgress: clamp01(p) }),
  setFocusedService: (id) => set({ focusedService: id }),
  setWarping: (w) => set({ warping: w }),
}));
