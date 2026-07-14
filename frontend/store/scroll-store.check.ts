// frontend/store/scroll-store.check.ts
// Run: bunx tsx store/scroll-store.check.ts
import { actForProgress, useScrollStore } from "./scroll-store";

const assert = (c: boolean, m: string) => { if (!c) throw new Error(`FAIL: ${m}`); };

// Act boundaries.
assert(actForProgress(0) === 0, "p=0 is boot (act 0)");
assert(actForProgress(0.1) === 1, "p=0.1 is approach (act 1)");
assert(actForProgress(0.19) === 1, "p=0.19 stays act 1");
assert(actForProgress(0.2) === 2, "p=0.2 enters galaxy (act 2)");
assert(actForProgress(0.49) === 2, "p=0.49 stays act 2");
assert(actForProgress(0.5) === 3, "p=0.5 enters core (act 3)");
assert(actForProgress(0.74) === 3, "p=0.74 stays act 3");
assert(actForProgress(0.75) === 4, "p=0.75 emerges (act 4)");
assert(actForProgress(1) === 4, "p=1 is act 4");

// Clamp + derive via the store.
const s = useScrollStore.getState();
s.setProgress(-1);
assert(useScrollStore.getState().progress === 0, "progress clamps low");
assert(useScrollStore.getState().act === 0, "act derives to 0 at p=0");
s.setProgress(2);
assert(useScrollStore.getState().progress === 1, "progress clamps high");
assert(useScrollStore.getState().act === 4, "act derives to 4 at p=1");

console.log("OK — scroll store clamps and derives acts at all boundaries.");
