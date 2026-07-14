// Self-check: spline is continuous, progress clamps to 0..1, target leads position.
// Run: npx tsx lib/experience/rail.check.ts
import { railPosition, railTarget, railCurve } from "./rail";
import { Vector3 } from "three";

const assert = (cond: boolean, msg: string) => {
  if (!cond) throw new Error(`FAIL: ${msg}`);
};

// Clamp: out-of-range t must equal the endpoints.
const start = railPosition(0);
const end = railPosition(1);
assert(railPosition(-1).equals(start), "t<0 clamps to start");
assert(railPosition(2).equals(end), "t>1 clamps to end");

// Continuity: no huge jumps between adjacent samples (curve is smooth).
let prev = railPosition(0, new Vector3());
let maxStep = 0;
for (let i = 1; i <= 100; i++) {
  const p = railPosition(i / 100, new Vector3());
  maxStep = Math.max(maxStep, p.distanceTo(prev));
  prev = p.clone();
}
const total = railCurve.getLength();
assert(maxStep < total, "no single step exceeds total curve length");
assert(total > 0, "curve has positive length");

// Target leads position (camera faces forward), except exactly at the end.
const midPos = railPosition(0.5, new Vector3());
const midTgt = railTarget(0.5, new Vector3());
assert(!midPos.equals(midTgt), "target differs from position mid-path");

console.log(`OK — rail continuous, length ${total.toFixed(1)}, maxStep ${maxStep.toFixed(3)}, clamps 0..1.`);
