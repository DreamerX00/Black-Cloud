"use client";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { railPosition, railTarget } from "@/lib/experience/rail";
import { useScrollStore } from "@/store/scroll-store";

const pos = new Vector3();
const tgt = new Vector3();
const smoothed = new Vector3(0, 14, 32); // rail start

export function CameraRig() {
  useFrame((state, dt) => {
    const p = useScrollStore.getState().progress;
    railPosition(p, pos);
    railTarget(p, tgt);
    // Critically damped follow so scrubbing feels weighty, not snappy.
    const k = 1 - Math.pow(0.0001, dt);
    smoothed.lerp(pos, k);
    state.camera.position.copy(smoothed);
    state.camera.lookAt(tgt);
  });
  return null;
}
