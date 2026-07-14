import { CatmullRomCurve3, Vector3 } from "three";

// The cinematic camera path — a Catmull-Rom spline flying through the server
// galaxy toward its core. Pure geometry (no React/three-scene deps) so it can be
// unit-checked and consumed by the camera rig identically.

// Control points: start high + wide, sweep down and inward, end near the core.
const CONTROL_POINTS: [number, number, number][] = [
  [0, 14, 32],
  [-10, 8, 20],
  [8, 5, 10],
  [-4, 3, 2],
  [2, 2.2, -4],
  [0, 2, -9], // core
];

export const railCurve = new CatmullRomCurve3(
  CONTROL_POINTS.map(([x, y, z]) => new Vector3(x, y, z)),
  false,
  "catmullrom",
  0.5,
);

/** Camera position at progress t (0..1) along the rail. */
export function railPosition(t: number, out = new Vector3()): Vector3 {
  return railCurve.getPointAt(clamp01(t), out);
}

/** A look-at target slightly ahead on the path (so the camera faces travel). */
export function railTarget(t: number, out = new Vector3()): Vector3 {
  return railCurve.getPointAt(clamp01(t + 0.04), out);
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}
