"use client";
import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Stars } from "@react-three/drei";
import { useScrollStore } from "@/store/scroll-store";
import { CameraRig } from "./camera-rig";
import { ServerGalaxy } from "./server-galaxy";
import { ReactorCore } from "./reactor-core";
import { PostFX } from "./post-fx";

class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: unknown) { console.error("[GLBoundary] caught:", error, info); this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function ExperienceCanvas() {
  const tier = useScrollStore((s) => s.tier);
  const setTier = useScrollStore((s) => s.setTier);
  if (tier !== "full") return null;

  return (
    <div className="fixed inset-0 z-0">
      <GLBoundary onError={() => setTier("no-webgl")}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 14, 32], fov: 55 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => { if (!gl.getContext()) setTier("no-webgl"); }}>
          <color attach="background" args={["#05060a"]} />
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 6, -9]} intensity={40} color="#22d3ee" />
          <Stars radius={120} depth={60} count={6000} factor={4} fade speed={1} />
          {/* Procedural IBL — no external HDRI fetch (raw.githack.com preset CDN 403s at runtime). */}
          <Environment resolution={256}>
            <Lightformer intensity={2} form="ring" color="#22d3ee" scale={12} position={[0, 6, -9]} />
            <Lightformer intensity={0.6} form="rect" color="#8b5cf6" scale={20} position={[-14, 4, 6]} rotation={[0, Math.PI / 4, 0]} />
            <Lightformer intensity={0.4} form="rect" color="#ffffff" scale={20} position={[14, 4, 6]} rotation={[0, -Math.PI / 4, 0]} />
          </Environment>
          <CameraRig />
          <ServerGalaxy />
          <ReactorCore />
          <PostFX />
        </Canvas>
      </GLBoundary>
    </div>
  );
}
