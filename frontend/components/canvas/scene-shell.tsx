"use client";

import React, { Component, Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useWebGL } from "@/lib/use-webgl";
import { cn } from "@/lib/utils";

/* ── Static fallback ─────────────────────────────────────────────── */

function StaticFallback({ children }: { children?: ReactNode }) {
  return (
    <div
      className="h-full w-full"
      style={{
        background:
          "linear-gradient(180deg, #050714 0%, #0a0a1a 40%, #000000 100%)",
      }}
    >
      {children}
    </div>
  );
}

/* ── Error boundary ──────────────────────────────────────────────── */

interface EBProps {
  fallback?: ReactNode;
  children: ReactNode;
}
interface EBState {
  hasError: boolean;
}

class SceneErrorBoundary extends Component<EBProps, EBState> {
  state: EBState = { hasError: false };

  static getDerivedStateFromError(): EBState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    // ponytail: log only, escalate when observability is wired
    console.error("[SceneShell]", error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <StaticFallback />;
    }
    return this.props.children;
  }
}

/* ── Scene lights ────────────────────────────────────────────────── */

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} />
    </>
  );
}

/* ── Loading state ───────────────────────────────────────────────── */

function SceneLoader() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-4 w-4 animate-pulse rounded-full bg-violet-500/40" />
    </div>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

interface SceneShellProps {
  children?: ReactNode;
  className?: string;
  fallback?: ReactNode;
  withStars?: boolean;
  withEnvironment?: boolean;
}

function SceneShell({
  children,
  className,
  fallback,
  withStars = false,
  withEnvironment = false,
}: SceneShellProps) {
  const reducedMotion = useReducedMotion();
  const webgl = useWebGL();

  // ponytail: useWebGL starts false on mount, so we gate on a "checked" flag
  // to avoid flashing the fallback for one frame on capable browsers.
  const [checked, setChecked] = React.useState(false);
  React.useEffect(() => setChecked(true), []);

  if (!checked) {
    return (
      <div className={cn("absolute inset-0 -z-10", className)}>
        <StaticFallback>{fallback}</StaticFallback>
      </div>
    );
  }

  if (!webgl || reducedMotion) {
    return (
      <div className={cn("absolute inset-0 -z-10", className)}>
        <StaticFallback>{fallback}</StaticFallback>
      </div>
    );
  }

  return (
    <div className={cn("absolute inset-0 -z-10", className)}>
      <SceneErrorBoundary fallback={<StaticFallback>{fallback}</StaticFallback>}>
        <Suspense fallback={<SceneLoader />}>
          <Canvas
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: "high-performance",
            }}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 5], fov: 60 }}
            performance={{ min: 0.5 }}
          >
            <SceneLights />
            {children}
          </Canvas>
        </Suspense>
      </SceneErrorBoundary>
    </div>
  );
}

export default SceneShell;
