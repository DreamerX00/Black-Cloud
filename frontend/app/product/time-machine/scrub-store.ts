"use client";
// Local bridge between the timeline slider (React) and the R3F scene. Kept in the
// route folder so it isn't a shared file — the scene reads scrub imperatively in
// useFrame (no re-render), the slider writes it on change.
import { create } from "zustand";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

interface ScrubState {
  scrub: number; // 0 = oldest snapshot, 1 = newest
  setScrub: (n: number) => void;
}

export const useScrubStore = create<ScrubState>((set) => ({
  scrub: 1,
  setScrub: (n) => set({ scrub: clamp01(n) }),
}));
