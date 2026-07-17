"use client";

// Sets the render tier from prefers-reduced-motion on mount. The homepage does
// this inside ActsScroll; every other page calls this once so SceneShell can
// serve the static fallback to reduced-motion users. no-webgl is detected later
// by SceneShell's GLBoundary/onCreated.
import { useEffect } from "react";
import { useScrollStore } from "@/store/scroll-store";

export function useTierInit() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only downgrade; never override a no-webgl result set elsewhere.
    if (reduced) useScrollStore.getState().setTier("reduced");
    else if (useScrollStore.getState().tier === "reduced") {
      useScrollStore.getState().setTier("full");
    }
  }, []);
}
