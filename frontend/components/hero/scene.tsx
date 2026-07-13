"use client";

import { useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, PerformanceMonitor, Stars } from "@react-three/drei";
import * as THREE from "three";
import { buildConstellation } from "@/lib/hero/constellation";
import { Edges } from "./edges";
import { Nodes } from "./nodes";

/**
 * The WebGL constellation scene.
 *
 * Camera choreography: scroll progress (ref) defines a target position along a
 * curved fly-through path; the camera is damped toward it each frame so scroll
 * feels like gliding, not snapping. Mouse also adds a subtle parallax tilt.
 *
 * Performance: AdaptiveDpr + PerformanceMonitor drop pixel ratio if the GPU
 * struggles, protecting the 60fps feel on weaker hardware.
 */

function Rig({ progress }: { progress: MutableRefObject<number> }) {
  const mouse = useRef({ x: 0, y: 0 });

  // pointer parallax
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Drive the camera imperatively via the frame `state` (R3F-idiomatic; the
  // camera is meant to be mutated each frame here).
  useFrame((state, dt) => {
    const t = progress.current;
    const cam = state.camera;
    // Fly from outside the cloud, in through it, then pull back and around.
    const tx = Math.sin(t * Math.PI * 1.5) * 10 + mouse.current.x * 1.5;
    const ty = 2 + t * 4 - mouse.current.y * 1.0;
    const tz = 22 - t * 30; // 22 → -8 : dive through the constellation

    // critically-damped follow (frame-rate independent)
    cam.position.x = THREE.MathUtils.damp(cam.position.x, tx, 3, dt);
    cam.position.y = THREE.MathUtils.damp(cam.position.y, ty, 3, dt);
    cam.position.z = THREE.MathUtils.damp(cam.position.z, tz, 3, dt);
    cam.lookAt(0, 1, 0);
  });

  return null;
}

function Scene({ progress }: { progress: MutableRefObject<number> }) {
  const constellation = useMemo(() => buildConstellation(1337), []);
  const group = useRef<THREE.Group>(null);

  // slow global rotation so the field is never static
  useFrame((_, dt) => {
    if (group.current) group.current.rotation.y += dt * 0.04;
  });

  return (
    <>
      <color attach="background" args={["#050505"]} />
      <fog attach="fog" args={["#050505", 20, 55]} />
      <ambientLight intensity={0.6} />

      <Stars radius={80} depth={40} count={1200} factor={3} saturation={0} fade speed={0.5} />

      <group ref={group}>
        <Edges constellation={constellation} />
        <Nodes constellation={constellation} />
      </group>

      <Rig progress={progress} />
    </>
  );
}

export function ConstellationScene({
  progress,
}: {
  progress: MutableRefObject<number>;
}) {
  // PerformanceMonitor lowers DPR when frame time slips, protecting 60fps.
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  return (
    <Canvas
      camera={{ position: [0, 2, 22], fov: 55 }}
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      className="!fixed inset-0"
    >
      <PerformanceMonitor
        onDecline={() => setDpr([1, 1])}
        onIncline={() => setDpr([1, 2])}
      />
      <AdaptiveDpr pixelated />
      <Scene progress={progress} />
    </Canvas>
  );
}
