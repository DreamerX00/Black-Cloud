"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * Chapter visuals — one 3D R3F scene per chapter, dynamically imported.
 *
 * Each visual is a fixed-size, bounded card. The 3D canvas fills its
 * card, sparkles + geometry stay inside the frustum, and nothing bleeds
 * into the parent Chapter's text column. Reduced-motion falls back to a
 * static gradient card so the layout still reads.
 */

const DesignScene3D = dynamic(
  () => import("./scene/chapter-3d").then((m) => m.DesignScene3D),
  { ssr: false, loading: () => null },
);
const ValidateScene3D = dynamic(
  () => import("./scene/chapter-3d").then((m) => m.ValidateScene3D),
  { ssr: false, loading: () => null },
);
const ExportScene3D = dynamic(
  () => import("./scene/chapter-3d").then((m) => m.ExportScene3D),
  { ssr: false, loading: () => null },
);
const ProvidersScene3D = dynamic(
  () => import("./scene/chapter-3d").then((m) => m.ProvidersScene3D),
  { ssr: false, loading: () => null },
);

const MQ = "(prefers-reduced-motion: reduce)";
function subscribe(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getSnapshot() {
  return window.matchMedia(MQ).matches;
}
function getServerSnapshot() {
  return false;
}

function VisualFrame({
  accent,
  children,
  fallbackLabel,
}: {
  accent: string;
  children: React.ReactNode;
  fallbackLabel: string;
}) {
  const reduce = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return (
    <div
      className="relative aspect-square w-full max-w-md overflow-hidden rounded-2xl border border-border/60 bg-graphite/40 backdrop-blur"
      style={{ boxShadow: `0 40px 120px -30px ${accent}55` }}
    >
      {/* Ambient glow behind the canvas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 55%, ${accent}22, transparent 65%)`,
        }}
      />

      {reduce ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div
              className="mx-auto h-16 w-16 rounded-full"
              style={{ background: accent, opacity: 0.6 }}
            />
            <div className="mt-4 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {fallbackLabel}
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0">{children}</div>
      )}

      {/* Inner corner-frame */}
      <div aria-hidden className="pointer-events-none absolute inset-3">
        <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-border/40" />
        <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-border/40" />
        <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-border/40" />
        <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-border/40" />
      </div>
    </div>
  );
}

export function DesignVisual() {
  return (
    <VisualFrame accent="#8B5CF6" fallbackLabel="Design · Every service">
      <DesignScene3D />
    </VisualFrame>
  );
}

export function ValidateVisual() {
  return (
    <VisualFrame accent="#22C55E" fallbackLabel="Validate · Live rules">
      <ValidateScene3D />
    </VisualFrame>
  );
}

export function ExportVisual() {
  return (
    <VisualFrame accent="#4285F4" fallbackLabel="Export · Portable">
      <ExportScene3D />
    </VisualFrame>
  );
}

export function ProvidersVisual() {
  return (
    <VisualFrame accent="#FF9900" fallbackLabel="Multi-cloud · Fluent">
      <ProvidersScene3D />
    </VisualFrame>
  );
}
