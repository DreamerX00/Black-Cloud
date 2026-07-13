"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Starfield } from "./starfield";
import { Network } from "./network";

/**
 * Landing WebGL scene — scroll-choreographed cinematic camera.
 *
 * Camera path is a hand-authored Catmull-Rom curve through 4 keyframes
 * corresponding to Vision.md's opening scenes:
 *   K0 → close on the origin (single packet)
 *   K1 → alongside the primary path (Route53→RDS revealing)
 *   K2 → high pull-back (whole network in frame)
 *   K3 → universe wide (network becomes a constellation among stars)
 *
 * Scroll progress 0→1 across ~2× viewport heights maps to camera parameter t.
 * Read from `window.scrollY` inside useFrame (no React state, no re-renders).
 */

// Camera keyframe path (worldspace).
const CAMERA_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 6),      // K0 — close, at packet's shoulder
    new THREE.Vector3(-2, 1.2, 9),   // K1 — moving along the line
    new THREE.Vector3(2, 3, 14),     // K2 — pulling up and out
    new THREE.Vector3(0, 5, 22),     // K3 — universe wide
  ],
  false,
  "catmullrom",
  0.4,
);

// LookAt targets that ease with the camera — camera doesn't stare at origin
// the whole time; it tracks the emerging network then releases into space.
const LOOK_PATH = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, -0.5, 0),
    new THREE.Vector3(0, -1, 0),
  ],
  false,
  "catmullrom",
  0.4,
);

const SCROLL_DISTANCE_VH = 2; // Progress 0→1 over this many viewports.

function CameraRig() {
  const progress = useRef(0);
  const smoothed = useRef(0);
  const tmpPos = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      const vh = window.innerHeight;
      progress.current = Math.min(
        1,
        Math.max(0, window.scrollY / (vh * SCROLL_DISTANCE_VH)),
      );
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(({ camera, clock }, dt) => {
    // Ease actual towards target progress — makes scrub feel weighty.
    smoothed.current += (progress.current - smoothed.current) * Math.min(1, dt * 4);

    const t = smoothed.current;
    CAMERA_PATH.getPoint(t, tmpPos.current);
    LOOK_PATH.getPoint(t, tmpLook.current);

    // Idle micro-drift so even at rest the frame isn't dead-still.
    const idle = 1 - Math.min(t * 3, 1); // fades to 0 after ~33% scroll
    const drift = clock.elapsedTime;
    tmpPos.current.x += Math.sin(drift * 0.3) * 0.25 * idle;
    tmpPos.current.y += Math.cos(drift * 0.22) * 0.15 * idle;

    camera.position.copy(tmpPos.current);
    camera.lookAt(tmpLook.current);
  });

  return null;
}

export function LandingScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6], fov: 55, near: 0.1, far: 200 }}
      style={{ background: "transparent" }}
    >
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 12, 55]} />

      <ambientLight intensity={0.35} />
      <pointLight position={[0, 4, 6]} intensity={45} color="#8B5CF6" distance={40} />
      <pointLight position={[-8, -2, 4]} intensity={22} color="#4285F4" distance={30} />
      <pointLight position={[8, 2, 4]} intensity={22} color="#FF9900" distance={30} />

      <Suspense fallback={null}>
        <Starfield count={2200} />
        <Network />
      </Suspense>

      <CameraRig />
    </Canvas>
  );
}

// Prevent tree-shaking of THREE side effect (JSX types).
export const __THREE_PIN__ = THREE;
