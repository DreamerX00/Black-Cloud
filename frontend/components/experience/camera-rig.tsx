"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { Vector3 } from "three";
import { useExperience } from "@/components/experience/store";
import { useFreeRoam } from "@/components/experience/free-roam-controls";
import { railPosition, railTarget } from "@/lib/experience/rail";

// Drives the camera in both modes. Cinematic = eased flight along the scroll-
// driven rail with mouse parallax; roam = handed off to useFreeRoam. Warp is a
// faster lunge toward the core.
export function CameraRig() {
  const { mode, warping } = useExperience();
  useFreeRoam(mode === "roam");

  const camera = useThree((s) => s.camera);

  // Scroll accumulates into railProgress (SSR-safe: listener lives in effect).
  useEffect(() => {
    let acc = useExperience.getState().railProgress;
    const onWheel = (e: WheelEvent) => {
      acc = Math.min(1, Math.max(0, acc + e.deltaY * 0.0004));
      useExperience.getState().setRailProgress(acc);
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Reused scratch vectors so the frame loop allocates nothing.
  const posTarget = useRef(new Vector3());
  const lookTarget = useRef(new Vector3());
  const warpTarget = useRef(new Vector3(0, 2, -9));

  useFrame((state, dt) => {
    if (mode !== "cinematic") return; // roam is driven by useFreeRoam

    const { railProgress } = useExperience.getState();

    if (warping) {
      railPosition(1, warpTarget.current);
      easing.damp3(camera.position, warpTarget.current, 0.18, dt);
      railTarget(1, lookTarget.current);
      camera.lookAt(lookTarget.current);
      return;
    }

    railPosition(railProgress, posTarget.current);
    easing.damp3(camera.position, posTarget.current, 0.4, dt);

    railTarget(railProgress, lookTarget.current);
    lookTarget.current.x += state.pointer.x * 1.5;
    lookTarget.current.y += state.pointer.y * 1.5;
    camera.lookAt(lookTarget.current);
  });

  return null;
}
