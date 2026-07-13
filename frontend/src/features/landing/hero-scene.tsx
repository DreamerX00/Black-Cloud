"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

/**
 * Client-side dynamic import of the WebGL scene.
 * Keeps three/@react-three out of the initial bundle so LCP stays snappy;
 * the canvas mounts after paint.
 *
 * Reduced-motion is read via `useSyncExternalStore` — the React 19 primitive
 * for subscribing to browser APIs without a `setState`-in-effect (which the
 * `react-hooks/set-state-in-effect` rule now flags). Server renders the
 * wrapper unconditionally with `reduce=false` (its server snapshot); the
 * client swaps to the real media-query value on hydration and re-subscribes
 * to `change` events. DOM shape is stable across the boundary.
 */
const LandingScene = dynamic(
  () => import("./scene/scene").then((m) => m.LandingScene),
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
  // ponytail: SSR default = full motion. Client hydration corrects it before
  // the R3F canvas mounts (it's inside a suspense/dynamic boundary anyway).
  return false;
}

export function HeroScene() {
  const reduce = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <div
      aria-hidden
      className="absolute inset-0 -z-10"
      style={{
        maskImage:
          "radial-gradient(ellipse 90% 70% at 50% 40%, black 55%, transparent 85%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 70% at 50% 40%, black 55%, transparent 85%)",
      }}
    >
      {!reduce && <LandingScene />}
    </div>
  );
}
