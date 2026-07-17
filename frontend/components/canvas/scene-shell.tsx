"use client";

// Reusable R3F stage for per-page bespoke scenes. Generalizes the homepage
// experience-canvas pattern: WebGL error boundary, tier gating (reduced/no-webgl
// users never mount a canvas), procedural IBL (no runtime HDRI/CDN fetch), and an
// optional starfield. Pages supply their own 3D via children + a camera.
import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, Stars } from "@react-three/drei";
import { useScrollStore } from "@/store/scroll-store";

class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: unknown) {
    console.error("[SceneShell/GLBoundary] caught:", error, info);
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export interface SceneShellProps {
  children: ReactNode;
  /** Camera position, defaults to a mid-distance orbit spot. */
  camera?: { position?: [number, number, number]; fov?: number };
  /** Background clear color; defaults to the void. */
  background?: string;
  /** Two accent lights (violet/cyan by default) tint the procedural IBL. */
  keyColor?: string;
  fillColor?: string;
  /** Starfield density; 0 disables. */
  stars?: number;
  /** Static fallback rendered for reduced-motion / no-WebGL tiers. */
  fallback?: ReactNode;
  className?: string;
}

export function SceneShell({
  children,
  camera,
  background = "#05060a",
  keyColor = "#22d3ee",
  fillColor = "#8b5cf6",
  stars = 4000,
  fallback = null,
  className = "fixed inset-0 -z-0",
}: SceneShellProps) {
  const tier = useScrollStore((s) => s.tier);
  const setTier = useScrollStore((s) => s.setTier);

  // Non-full tiers get the static fallback — never a live canvas.
  if (tier !== "full") return <>{fallback}</>;

  return (
    <div className={className}>
      <GLBoundary onError={() => setTier("no-webgl")}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: camera?.position ?? [0, 4, 14], fov: camera?.fov ?? 50 }}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          onCreated={({ gl }) => {
            if (!gl.getContext()) setTier("no-webgl");
          }}
        >
          <color attach="background" args={[background]} />
          <ambientLight intensity={0.22} />
          <pointLight position={[0, 6, -9]} intensity={40} color={keyColor} />
          {stars > 0 && <Stars radius={120} depth={60} count={stars} factor={4} fade speed={1} />}
          {/* Procedural IBL — matches experience-canvas: no external HDRI fetch. */}
          <Environment resolution={256}>
            <Lightformer intensity={2} form="ring" color={keyColor} scale={12} position={[0, 6, -9]} />
            <Lightformer
              intensity={0.6}
              form="rect"
              color={fillColor}
              scale={20}
              position={[-14, 4, 6]}
              rotation={[0, Math.PI / 4, 0]}
            />
            <Lightformer
              intensity={0.4}
              form="rect"
              color="#ffffff"
              scale={20}
              position={[14, 4, 6]}
              rotation={[0, -Math.PI / 4, 0]}
            />
          </Environment>
          {children}
        </Canvas>
      </GLBoundary>
    </div>
  );
}
