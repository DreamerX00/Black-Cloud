# Descent into the Black Cloud — Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single scroll-driven cinematic homepage where the camera falls through a 3D "server galaxy" while five marketing acts materialize over it.

**Architecture:** One fixed full-viewport R3F `<Canvas>` behind a normal scrollable DOM column. The two layers communicate through a single zustand store holding `progress` (0→1), derived `act` (0–4), and `tier` ("full" | "reduced" | "no-webgl"). The 3D layer reads the store inside `useFrame` via `getState()` (no re-render on scroll); the DOM layer writes progress via GSAP ScrollTrigger.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4, R3F + drei + postprocessing + rapier, theatre.js, GSAP + @gsap/react, motion (Framer Motion 12), ogl, pixi.js, maath, meshline, zustand, TanStack Query, Radix (shadcn), sonner, next-themes, lucide.

## Global Constraints

- All heavy libraries are ALREADY installed (see `frontend/package.json`). Do NOT add MUI, Ant, Skeleton, Konsta, HeroUI, Preline, Flowbite, HyperUI, Meraki, DaisyUI, Float, Kokonut, SyntaxUI, Origin, Animata, Motion-Primitives, or Motion One — each duplicates a job an installed lib already owns.
- Aceternity / Magic UI / React Bits are used by pasting component SOURCE into `components/effects/`, not as packages.
- Package manager is **bun** (`bun.lock` present). Use `bun run` / `bunx`.
- Every client component using hooks/three/gsap must start with `"use client"`.
- Reduced-motion is a non-negotiable accessibility floor: when `prefers-reduced-motion: reduce`, the canvas must NOT mount and content fades in with opacity only.
- Pixel ratio is clamped `dpr={[1, 2]}`. This is the single deliberate clamp (`ponytail:` raise only if 3x is explicitly wanted).
- Path alias `@/*` maps to `frontend/*` (see `tsconfig.json`). Use it for imports.
- Pure-logic units ship an assert-based `.check.ts` run with `bunx tsx`. Visual units are gated by `bun run build` + manual verify, not unit tests.
- Reuse verbatim from git commit `2c62cb9`: `lib/experience/rail.ts`, `lib/experience/rail.check.ts`.

---

### Task 1: Scroll store (the layer interface)

**Files:**
- Create: `frontend/store/scroll-store.ts`
- Test: `frontend/store/scroll-store.check.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Tier = "full" | "reduced" | "no-webgl"`
  - `useScrollStore` — zustand store with:
    - `progress: number` (0..1), `act: number` (0..4), `tier: Tier`
    - `setProgress(p: number): void` — clamps to [0,1], recomputes `act`
    - `setTier(t: Tier): void`
  - `actForProgress(p: number): number` — pure; boundaries: `[0,0.2)→0`? NO. Act mapping: `p<0.2→1`, `<0.5→2`, `<0.75→3`, else `4`; act 0 is the pre-scroll boot state, represented by `progress===0 → act 0`.

- [ ] **Step 1: Write the failing self-check**

```typescript
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
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd frontend && bunx tsx store/scroll-store.check.ts`
Expected: FAIL — cannot find module `./scroll-store`.

- [ ] **Step 3: Implement the store**

```typescript
// frontend/store/scroll-store.ts
"use client";
import { create } from "zustand";

export type Tier = "full" | "reduced" | "no-webgl";

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Pure: map scroll progress to an act index. p=0 is the pre-scroll boot state. */
export function actForProgress(p: number): number {
  const c = clamp01(p);
  if (c === 0) return 0;
  if (c < 0.2) return 1;
  if (c < 0.5) return 2;
  if (c < 0.75) return 3;
  return 4;
}

interface ScrollState {
  progress: number;
  act: number;
  tier: Tier;
  setProgress: (p: number) => void;
  setTier: (t: Tier) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  progress: 0,
  act: 0,
  tier: "full",
  setProgress: (p) => set({ progress: clamp01(p), act: actForProgress(p) }),
  setTier: (t) => set({ tier: t }),
}));
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd frontend && bunx tsx store/scroll-store.check.ts`
Expected: `OK — scroll store clamps and derives acts at all boundaries.`

- [ ] **Step 5: Commit**

```bash
git add frontend/store/scroll-store.ts frontend/store/scroll-store.check.ts
git commit -m "feat(home): scroll store — single-number interface between 3D and DOM layers"
```

---

### Task 2: Reuse the camera rail + recover its self-check

**Files:**
- Create: `frontend/lib/experience/rail.ts` (verbatim from commit `2c62cb9`)
- Create: `frontend/lib/experience/rail.check.ts` (verbatim from commit `2c62cb9`)

**Interfaces:**
- Produces:
  - `railPosition(t: number, out?: Vector3): Vector3` — camera position at progress t.
  - `railTarget(t: number, out?: Vector3): Vector3` — look-at point leading the position.
  - `railCurve: CatmullRomCurve3`.

- [ ] **Step 1: Recover both files from git**

Run:
```bash
cd /home/akash-singh/Black-Cloud-2
mkdir -p frontend/lib/experience
git show 2c62cb9:frontend/lib/experience/rail.ts > frontend/lib/experience/rail.ts
git show 2c62cb9:frontend/lib/experience/rail.check.ts > frontend/lib/experience/rail.check.ts
```

- [ ] **Step 2: Run the recovered self-check**

Run: `cd frontend && bunx tsx lib/experience/rail.check.ts`
Expected: `OK — rail continuous, length ...` (no assertion failure).

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/experience/rail.ts frontend/lib/experience/rail.check.ts
git commit -m "feat(home): reuse Catmull-Rom camera rail from prior galaxy experience"
```

---

### Task 3: Service catalog data + fallback

**Files:**
- Create: `frontend/lib/catalog/nodes.ts`
- Test: `frontend/lib/catalog/nodes.check.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `type Provider = "aws" | "azure" | "gcp"`
  - `interface Service { id: string; name: string; provider: Provider; blurb: string }`
  - `const CATALOG: Service[]` — exactly 23 entries.
  - `const PROVIDER_META: Record<Provider, { label: string }>`.

- [ ] **Step 1: Write the failing self-check**

```typescript
// frontend/lib/catalog/nodes.check.ts
// Run: bunx tsx lib/catalog/nodes.check.ts
import { CATALOG, PROVIDER_META } from "./nodes";

const assert = (c: boolean, m: string) => { if (!c) throw new Error(`FAIL: ${m}`); };

assert(CATALOG.length === 23, `catalog has 23 services (got ${CATALOG.length})`);
const ids = new Set(CATALOG.map((s) => s.id));
assert(ids.size === 23, "all service ids are unique");
for (const s of CATALOG) {
  assert(!!s.id && !!s.name && !!s.blurb, `service ${s.id} has id/name/blurb`);
  assert(!!PROVIDER_META[s.provider], `service ${s.id} has a known provider`);
}
console.log("OK — 23 unique services, all fields present, providers known.");
```

- [ ] **Step 2: Run to verify it fails**

Run: `cd frontend && bunx tsx lib/catalog/nodes.check.ts`
Expected: FAIL — cannot find module `./nodes`.

- [ ] **Step 3: Implement the catalog**

```typescript
// frontend/lib/catalog/nodes.ts
export type Provider = "aws" | "azure" | "gcp";

export interface Service {
  id: string;
  name: string;
  provider: Provider;
  blurb: string;
}

export const PROVIDER_META: Record<Provider, { label: string }> = {
  aws: { label: "AWS" },
  azure: { label: "Azure" },
  gcp: { label: "Google Cloud" },
};

export const CATALOG: Service[] = [
  { id: "ec2", name: "Compute", provider: "aws", blurb: "Elastic virtual machines that scale on demand." },
  { id: "s3", name: "Object Storage", provider: "aws", blurb: "Durable, infinitely scalable object store." },
  { id: "lambda", name: "Functions", provider: "aws", blurb: "Run code without provisioning servers." },
  { id: "rds", name: "Managed SQL", provider: "aws", blurb: "Managed relational databases, six engines." },
  { id: "dynamodb", name: "NoSQL", provider: "aws", blurb: "Single-digit-ms key-value at any scale." },
  { id: "eks", name: "Kubernetes", provider: "aws", blurb: "Managed control plane for containers." },
  { id: "sqs", name: "Queues", provider: "aws", blurb: "Decoupled, durable message queues." },
  { id: "cloudfront", name: "CDN", provider: "aws", blurb: "Low-latency global content delivery." },
  { id: "vm", name: "Virtual Machines", provider: "azure", blurb: "On-demand Windows and Linux compute." },
  { id: "blob", name: "Blob Storage", provider: "azure", blurb: "Massively scalable object storage." },
  { id: "aci", name: "Containers", provider: "azure", blurb: "Serverless containers, per-second billing." },
  { id: "cosmos", name: "Cosmos DB", provider: "azure", blurb: "Globally distributed multi-model database." },
  { id: "functions", name: "Functions", provider: "azure", blurb: "Event-driven serverless compute." },
  { id: "aks", name: "Kubernetes", provider: "azure", blurb: "Managed Kubernetes with autoscaling." },
  { id: "servicebus", name: "Service Bus", provider: "azure", blurb: "Enterprise messaging with topics." },
  { id: "cdn", name: "CDN", provider: "azure", blurb: "Cache content at the network edge." },
  { id: "gce", name: "Compute Engine", provider: "gcp", blurb: "High-performance configurable VMs." },
  { id: "gcs", name: "Cloud Storage", provider: "gcp", blurb: "Unified object storage, any class." },
  { id: "run", name: "Cloud Run", provider: "gcp", blurb: "Serverless containers that scale to zero." },
  { id: "spanner", name: "Spanner", provider: "gcp", blurb: "Horizontally scalable, strongly consistent SQL." },
  { id: "bigquery", name: "BigQuery", provider: "gcp", blurb: "Serverless petabyte-scale analytics." },
  { id: "gke", name: "GKE", provider: "gcp", blurb: "The Kubernetes platform, fully managed." },
  { id: "pubsub", name: "Pub/Sub", provider: "gcp", blurb: "Global real-time messaging bus." },
];
```

- [ ] **Step 4: Run to verify it passes**

Run: `cd frontend && bunx tsx lib/catalog/nodes.check.ts`
Expected: `OK — 23 unique services, all fields present, providers known.`

- [ ] **Step 5: Commit**

```bash
git add frontend/lib/catalog/nodes.ts frontend/lib/catalog/nodes.check.ts
git commit -m "feat(home): 23-service catalog with provider metadata"
```

---

### Task 4: shadcn utils + base theme, providers, layout metadata

**Files:**
- Create: `frontend/lib/utils.ts`
- Create: `frontend/app/providers.tsx`
- Modify: `frontend/app/layout.tsx`
- Modify: `frontend/app/globals.css`

**Interfaces:**
- Produces:
  - `cn(...inputs: ClassValue[]): string` — clsx + tailwind-merge.
  - `<Providers>` — wraps children in TanStack `QueryClientProvider`, `next-themes` `ThemeProvider` (dark), and mounts `<Toaster/>` from sonner.

- [ ] **Step 1: Create `cn` helper**

```typescript
// frontend/lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

- [ ] **Step 2: Create providers**

```tsx
// frontend/app/providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {children}
        <Toaster theme="dark" position="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

- [ ] **Step 3: Rewrite layout metadata + wrap in providers**

```tsx
// frontend/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BlackCloud — one control plane for every cloud",
  description: "Descend through the server galaxy. Deploy across AWS, Azure, and GCP from a single cinematic control plane.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-zinc-100`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Replace globals.css theme with a dark space palette**

```css
/* frontend/app/globals.css */
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --background: #05060a;
  --foreground: #ededed;
  --accent-violet: #8b5cf6;
  --accent-cyan: #22d3ee;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-accent-violet: var(--accent-violet);
  --color-accent-cyan: var(--accent-cyan);
  --font-sans: var(--font-geist-sans);
  --font-mono: var(--font-geist-mono);
}

html, body { background: var(--background); color: var(--foreground); }

/* Accessibility floor: kill non-essential motion when the OS asks. */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 5: Verify build compiles**

Run: `cd frontend && bun run build`
Expected: build succeeds (page is still the default starter — that's fine).

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/utils.ts frontend/app/providers.tsx frontend/app/layout.tsx frontend/app/globals.css
git commit -m "feat(home): dark space theme, providers (query/theme/toast), cn helper"
```

---

### Task 5: Generate shadcn primitives

**Files:**
- Create: `frontend/components/ui/button.tsx`, `card.tsx`, `tabs.tsx`, `accordion.tsx`, `separator.tsx` (via shadcn CLI)
- Create/Modify: `frontend/components.json` (shadcn config)

**Interfaces:**
- Produces: shadcn `Button`, `Card`/`CardHeader`/`CardTitle`/`CardContent`, `Tabs`, `Accordion`, `Separator` from `@/components/ui/*`.

- [ ] **Step 1: Init shadcn (non-interactive)**

Run: `cd frontend && bunx shadcn@latest init -d`
Expected: creates `components.json`, wires `@/components/ui`. If it prompts, accept defaults (dark, slate/zinc base, CSS variables).

- [ ] **Step 2: Add the components we use**

Run: `cd frontend && bunx shadcn@latest add button card tabs accordion separator`
Expected: files created under `components/ui/`.

- [ ] **Step 3: Verify build compiles**

Run: `cd frontend && bun run build`
Expected: build succeeds.

- [ ] **Step 4: Commit**

```bash
git add frontend/components.json frontend/components/ui
git commit -m "feat(home): shadcn ui primitives (button/card/tabs/accordion/separator)"
```

---

### Task 6: 3D layer — post-fx + galaxy scene (reuse/adapt from git)

**Files:**
- Create: `frontend/components/experience/post-fx.tsx` (verbatim from `2c62cb9`)
- Create: `frontend/components/experience/server-galaxy.tsx` (adapt from `2c62cb9`)

**Interfaces:**
- Consumes: `CATALOG`, `PROVIDER_META` from `@/lib/catalog/nodes` (Task 3).
- Produces: `<PostFX/>`, `<ServerGalaxy/>` — both render inside a `<Canvas>`.

- [ ] **Step 1: Recover post-fx verbatim**

Run:
```bash
cd /home/akash-singh/Black-Cloud-2
mkdir -p frontend/components/experience
git show 2c62cb9:frontend/components/experience/post-fx.tsx > frontend/components/experience/post-fx.tsx
```

- [ ] **Step 2: Recover galaxy, then remove the free-roam store dependency**

Run: `git show 2c62cb9:frontend/components/experience/server-galaxy.tsx > frontend/components/experience/server-galaxy.tsx`

Then edit `server-galaxy.tsx`: remove the `useExperience` import and the two `useExperience.getState().setFocusedService(...)` calls inside `onPointerOver`/`onPointerOut` (keep the cursor + hover-scale behavior). The old store is not used in this rebuild.

Resulting handlers:
```tsx
      onPointerOver={(e) => {
        e.stopPropagation();
        hovered.current = true;
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        hovered.current = false;
        document.body.style.cursor = "auto";
      }}
```

- [ ] **Step 3: Verify both files typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors referencing `post-fx.tsx` or `server-galaxy.tsx`.

- [ ] **Step 4: Commit**

```bash
git add frontend/components/experience/post-fx.tsx frontend/components/experience/server-galaxy.tsx
git commit -m "feat(home): reuse postFX pipeline + galaxy scene, drop old free-roam store"
```

---

### Task 7: 3D layer — camera rig driven by scroll store

**Files:**
- Create: `frontend/components/experience/camera-rig.tsx`

**Interfaces:**
- Consumes: `railPosition`, `railTarget` (Task 2); `useScrollStore` (Task 1).
- Produces: `<CameraRig/>` — updates `state.camera` each frame from `railPosition(progress)`; reads progress via `useScrollStore.getState()` (no re-render).

- [ ] **Step 1: Implement the rig**

```tsx
// frontend/components/experience/camera-rig.tsx
"use client";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { railPosition, railTarget } from "@/lib/experience/rail";
import { useScrollStore } from "@/store/scroll-store";

const pos = new Vector3();
const tgt = new Vector3();
const smoothed = new Vector3(0, 14, 32); // rail start

export function CameraRig() {
  useFrame((state, dt) => {
    const p = useScrollStore.getState().progress;
    railPosition(p, pos);
    railTarget(p, tgt);
    // Critically damped follow so scrubbing feels weighty, not snappy.
    const k = 1 - Math.pow(0.0001, dt);
    smoothed.lerp(pos, k);
    state.camera.position.copy(smoothed);
    state.camera.lookAt(tgt);
  });
  return null;
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/components/experience/camera-rig.tsx
git commit -m "feat(home): scroll-driven camera rig (reads store in useFrame, no re-render)"
```

---

### Task 8: 3D layer — reactor core with rapier debris

**Files:**
- Create: `frontend/components/experience/reactor-core.tsx`

**Interfaces:**
- Consumes: nothing beyond three/rapier/drei.
- Produces: `<ReactorCore/>` — a pulsing emissive core + a small `@react-three/rapier` debris field. Renders inside a `<Physics>` provider that the caller supplies.

- [ ] **Step 1: Implement the core**

```tsx
// frontend/components/experience/reactor-core.tsx
"use client";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import type { Mesh } from "three";

function frac(i: number) {
  const s = Math.sin(i * 91.7) * 43758.5453;
  return s - Math.floor(s);
}

export function ReactorCore() {
  const core = useRef<Mesh>(null);
  useFrame((state) => {
    if (!core.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
    core.current.scale.setScalar(pulse);
  });
  return (
    <group position={[0, 2, -9]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.4, 4]} />
        <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} roughness={0.1} />
      </mesh>
      {Array.from({ length: 18 }, (_, i) => (
        <RigidBody key={i} colliders="ball" linearDamping={0.6} angularDamping={0.5}
          position={[(frac(i) - 0.5) * 6, (frac(i + 10) - 0.5) * 5 + 2, (frac(i + 20) - 0.5) * 6]}>
          <mesh>
            <dodecahedronGeometry args={[0.18 + frac(i + 30) * 0.15]} />
            <meshStandardMaterial color="#8b5cf6" emissive="#8b5cf6" emissiveIntensity={1.2} />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/components/experience/reactor-core.tsx
git commit -m "feat(home): reactor core with rapier debris field for the core act"
```

---

### Task 9: 3D layer — the Canvas shell with tier gating + error boundary

**Files:**
- Create: `frontend/components/experience/experience-canvas.tsx`

**Interfaces:**
- Consumes: `useScrollStore` (Task 1); `<PostFX/>`, `<ServerGalaxy/>` (Task 6); `<CameraRig/>` (Task 7); `<ReactorCore/>` (Task 8).
- Produces: `<ExperienceCanvas/>` — fixed full-viewport. Returns `null` when `tier !== "full"`. Wraps the R3F tree in a class error boundary that calls `setTier("no-webgl")` on error. `dpr={[1, 2]}`. Includes `<Physics>` around the reactor core, HDRI environment (`<Environment preset="night"/>`), and `<Stars/>` from drei.

- [ ] **Step 1: Implement the canvas + boundary**

```tsx
// frontend/components/experience/experience-canvas.tsx
"use client";
import { Component, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Stars } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { useScrollStore } from "@/store/scroll-store";
import { CameraRig } from "./camera-rig";
import { ServerGalaxy } from "./server-galaxy";
import { ReactorCore } from "./reactor-core";
import { PostFX } from "./post-fx";

class GLBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
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
          <Environment preset="night" />
          <CameraRig />
          <ServerGalaxy />
          <Physics gravity={[0, 0, 0]}>
            <ReactorCore />
          </Physics>
          <PostFX />
        </Canvas>
      </GLBoundary>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/components/experience/experience-canvas.tsx
git commit -m "feat(home): experience canvas shell — tier gating, GL error boundary, dpr clamp"
```

---

### Task 10: Effects — paste-in Aceternity/Magic UI/React Bits sources

**Files:**
- Create: `frontend/components/effects/spotlight.tsx` (Aceternity Spotlight)
- Create: `frontend/components/effects/shimmer-button.tsx` (Magic UI shimmer button)
- Create: `frontend/components/effects/number-ticker.tsx` (Magic UI number ticker)
- Create: `frontend/components/effects/particle-logo.tsx` (React Bits / ogl particle text)

**Interfaces:**
- Produces:
  - `<Spotlight className?/>` — absolutely-positioned animated radial glow.
  - `<ShimmerButton>{children}</ShimmerButton>` — CTA with a sweeping shine.
  - `<NumberTicker value={number} />` — counts up on view using `motion`.
  - `<ParticleLogo text={string} />` — ogl canvas that assembles particles into text.

- [ ] **Step 1: Spotlight (Aceternity source, adapted to Tailwind v4)**

```tsx
// frontend/components/effects/spotlight.tsx
"use client";
import { cn } from "@/lib/utils";

export function Spotlight({ className }: { className?: string }) {
  return (
    <div className={cn(
      "pointer-events-none absolute -top-40 left-0 h-[80vh] w-[60vw]",
      "bg-[radial-gradient(closest-side,rgba(139,92,246,0.25),transparent)]",
      "blur-3xl animate-pulse", className,
    )} aria-hidden />
  );
}
```

- [ ] **Step 2: Shimmer button (Magic UI source)**

```tsx
// frontend/components/effects/shimmer-button.tsx
"use client";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";

export function ShimmerButton({ className, children, ...props }: ComponentProps<"button">) {
  return (
    <button {...props} className={cn(
      "relative overflow-hidden rounded-full border border-white/15 bg-zinc-900 px-8 py-3 font-medium text-white",
      "transition-transform hover:scale-[1.03] active:scale-95",
      "before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r",
      "before:from-transparent before:via-white/25 before:to-transparent before:transition-transform",
      "before:duration-1000 hover:before:translate-x-full", className,
    )}>
      <span className="relative z-10">{children}</span>
    </button>
  );
}
```

- [ ] **Step 3: Number ticker (Magic UI source, using motion)**

```tsx
// frontend/components/effects/number-ticker.tsx
"use client";
import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";

export function NumberTicker({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { damping: 30, stiffness: 120 });

  useEffect(() => { if (inView) mv.set(value); }, [inView, mv, value]);
  useEffect(() =>
    spring.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    }), [spring, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}
```

- [ ] **Step 4: Particle logo (React Bits style, ogl)**

```tsx
// frontend/components/effects/particle-logo.tsx
"use client";
import { useEffect, useRef } from "react";
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from "ogl";

// Renders `text` sampled to points, drifting into place. Minimal ogl point cloud.
export function ParticleLogo({ text }: { text: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const renderer = new Renderer({ alpha: true, dpr: Math.min(2, window.devicePixelRatio) });
    const gl = renderer.gl;
    el.appendChild(gl.canvas);
    const camera = new Camera(gl, { fov: 35 });
    camera.position.z = 5;
    const scene = new Transform();

    // Sample text into points on an offscreen 2D canvas.
    const c = document.createElement("canvas");
    c.width = 512; c.height = 128;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#fff";
    ctx.font = "bold 96px sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(text, 10, 64);
    const img = ctx.getImageData(0, 0, c.width, c.height).data;
    const pts: number[] = [];
    for (let y = 0; y < c.height; y += 3)
      for (let x = 0; x < c.width; x += 3)
        if (img[(y * c.width + x) * 4 + 3] > 128) {
          pts.push((x / c.width - 0.5) * 6, -(y / c.height - 0.5) * 1.6, 0);
        }
    const position = new Float32Array(pts);
    const geometry = new Geometry(gl, { position: { size: 3, data: position } });
    const program = new Program(gl, {
      vertex: `attribute vec3 position; uniform mat4 modelViewMatrix, projectionMatrix;
        void main(){ gl_PointSize=2.0; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);} `,
      fragment: `precision highp float; void main(){ gl_FragColor=vec4(0.85,0.9,1.0,1.0);} `,
    });
    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });
    mesh.setParent(scene);

    const resize = () => { renderer.setSize(el.clientWidth, el.clientHeight); camera.perspective({ aspect: el.clientWidth / el.clientHeight }); };
    resize(); window.addEventListener("resize", resize);
    let raf = 0;
    const loop = (t: number) => { mesh.rotation.y = Math.sin(t * 0.0003) * 0.2; renderer.render({ scene, camera }); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); el.removeChild(gl.canvas); };
  }, [text]);
  return <div ref={host} className="h-40 w-full" />;
}
```

- [ ] **Step 5: Verify typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/components/effects
git commit -m "feat(home): effects — spotlight, shimmer button, number ticker, ogl particle logo"
```

---

### Task 11: DOM acts — the five section components

**Files:**
- Create: `frontend/components/acts/act0-boot.tsx`
- Create: `frontend/components/acts/act1-approach.tsx`
- Create: `frontend/components/acts/act2-galaxy.tsx`
- Create: `frontend/components/acts/act3-core.tsx`
- Create: `frontend/components/acts/act4-emergence.tsx`

**Interfaces:**
- Consumes: effects (Task 10), shadcn ui (Task 5), `CATALOG` (Task 3).
- Produces: five default-exported section components, each a full-height `<section>` with content positioned over the transparent canvas.

- [ ] **Step 1: Act 0 — boot**

```tsx
// frontend/components/acts/act0-boot.tsx
"use client";
import { ParticleLogo } from "@/components/effects/particle-logo";

export default function Act0Boot() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <ParticleLogo text="BLACKCLOUD" />
      <p className="mt-4 font-mono text-sm tracking-[0.3em] text-zinc-400">SCROLL TO DESCEND</p>
    </section>
  );
}
```

- [ ] **Step 2: Act 1 — approach**

```tsx
// frontend/components/acts/act1-approach.tsx
"use client";
import { motion } from "motion/react";
import { Spotlight } from "@/components/effects/spotlight";
import { ShimmerButton } from "@/components/effects/shimmer-button";

export default function Act1Approach() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <Spotlight />
      <motion.h1 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }} transition={{ duration: 0.8 }}
        className="max-w-3xl bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-6xl font-bold text-transparent">
        One control plane for every cloud.
      </motion.h1>
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-6 max-w-xl text-lg text-zinc-400">
        Deploy, observe, and scale across AWS, Azure, and Google Cloud from a single cinematic surface.
      </motion.p>
      <div className="mt-10"><ShimmerButton>Enter the galaxy →</ShimmerButton></div>
    </section>
  );
}
```

- [ ] **Step 3: Act 2 — galaxy features (pinned cards fed by catalog)**

```tsx
// frontend/components/acts/act2-galaxy.tsx
"use client";
import { motion } from "motion/react";
import { CATALOG, PROVIDER_META } from "@/lib/catalog/nodes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Act2Galaxy() {
  return (
    <section className="relative min-h-[150vh] px-6 py-32">
      <h2 className="mb-16 text-center text-4xl font-bold">23 services. One surface.</h2>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATALOG.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }} transition={{ delay: (i % 3) * 0.08 }}>
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardHeader>
                <p className="text-xs font-mono uppercase text-accent-violet">{PROVIDER_META[s.provider].label}</p>
                <CardTitle>{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-zinc-400">{s.blurb}</CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Act 3 — core stats**

```tsx
// frontend/components/acts/act3-core.tsx
"use client";
import { NumberTicker } from "@/components/effects/number-ticker";

const STATS = [
  { label: "Deploys / day", value: 48000, suffix: "+" },
  { label: "Regions", value: 96, suffix: "" },
  { label: "Uptime", value: 99, suffix: ".99%" },
  { label: "Services", value: 23, suffix: "" },
];

export default function Act3Core() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <h2 className="mb-16 text-4xl font-bold">Straight into the core.</h2>
      <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label}>
            <div className="text-5xl font-bold text-accent-cyan">
              <NumberTicker value={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-sm text-zinc-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Act 4 — emergence / CTA**

```tsx
// frontend/components/acts/act4-emergence.tsx
"use client";
import { ShimmerButton } from "@/components/effects/shimmer-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TIERS = [
  { name: "Explorer", price: "$0", perks: ["1 cloud", "Community support", "5 deploys/day"] },
  { name: "Pilot", price: "$49", perks: ["3 clouds", "Priority support", "Unlimited deploys"] },
  { name: "Fleet", price: "Custom", perks: ["All clouds", "Dedicated SRE", "SLA 99.99%"] },
];

export default function Act4Emergence() {
  return (
    <section className="relative min-h-screen px-6 py-32 text-center">
      <h2 className="mb-16 text-4xl font-bold">Emerge with control.</h2>
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {TIERS.map((t) => (
          <Card key={t.name} className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader><CardTitle>{t.name}</CardTitle><p className="text-3xl font-bold">{t.price}</p></CardHeader>
            <CardContent className="space-y-2 text-sm text-zinc-400">
              {t.perks.map((p) => <div key={p}>{p}</div>)}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16"><ShimmerButton>Start free →</ShimmerButton></div>
      <footer className="mt-32 text-sm text-zinc-600">BlackCloud — descend, deploy, dominate.</footer>
    </section>
  );
}
```

- [ ] **Step 6: Verify typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 7: Commit**

```bash
git add frontend/components/acts
git commit -m "feat(home): five DOM acts — boot, approach, galaxy, core, emergence"
```

---

### Task 12: Acts orchestrator — GSAP ScrollTrigger + tier detection

**Files:**
- Create: `frontend/components/acts/acts-scroll.tsx`

**Interfaces:**
- Consumes: `useScrollStore` (Task 1); the five act components (Task 11).
- Produces: `<ActsScroll/>` — renders acts in a scroll column, registers a GSAP ScrollTrigger scrubbing document scroll → `setProgress`, and on mount sets `tier` to `"reduced"` if `prefers-reduced-motion` matches.

- [ ] **Step 1: Implement the orchestrator**

```tsx
// frontend/components/acts/acts-scroll.tsx
"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollStore } from "@/store/scroll-store";
import Act0Boot from "./act0-boot";
import Act1Approach from "./act1-approach";
import Act2Galaxy from "./act2-galaxy";
import Act3Core from "./act3-core";
import Act4Emergence from "./act4-emergence";

gsap.registerPlugin(ScrollTrigger);

export function ActsScroll() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { useScrollStore.getState().setTier("reduced"); return; }

    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => useScrollStore.getState().setProgress(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <div ref={root} className="relative z-10">
      <Act0Boot />
      <Act1Approach />
      <Act2Galaxy />
      <Act3Core />
      <Act4Emergence />
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck**

Run: `cd frontend && bunx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/components/acts/acts-scroll.tsx
git commit -m "feat(home): acts orchestrator — GSAP scrub to store + reduced-motion tier"
```

---

### Task 13: Compose the page + client-only canvas mount

**Files:**
- Modify: `frontend/app/page.tsx`

**Interfaces:**
- Consumes: `<ExperienceCanvas/>` (Task 9), `<ActsScroll/>` (Task 12).
- Produces: the homepage. Canvas is dynamically imported with `ssr: false` (WebGL cannot render on the server; this is the class of bug fixed in commit `a391891`).

- [ ] **Step 1: Rewrite the page**

```tsx
// frontend/app/page.tsx
"use client";
import dynamic from "next/dynamic";
import { ActsScroll } from "@/components/acts/acts-scroll";

const ExperienceCanvas = dynamic(
  () => import("@/components/experience/experience-canvas").then((m) => m.ExperienceCanvas),
  { ssr: false },
);

export default function Home() {
  return (
    <main className="relative">
      <ExperienceCanvas />
      <ActsScroll />
    </main>
  );
}
```

- [ ] **Step 2: Build gate (catches SSR/hydration issues)**

Run: `cd frontend && bun run build`
Expected: build succeeds with no hydration or "window is not defined" errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/app/page.tsx
git commit -m "feat(home): compose homepage — ssr:false canvas behind the acts column"
```

---

### Task 14: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Run all logic self-checks**

Run:
```bash
cd frontend
bunx tsx store/scroll-store.check.ts
bunx tsx lib/experience/rail.check.ts
bunx tsx lib/catalog/nodes.check.ts
```
Expected: three `OK — ...` lines, no throws.

- [ ] **Step 2: Production build**

Run: `cd frontend && bun run build`
Expected: success.

- [ ] **Step 3: Manual visual verify (use the `run` skill)**

Run `bun run dev`, open the page, and confirm:
- Boot logo particles render; "SCROLL TO DESCEND" visible.
- Scrolling scrubs the camera down the rail through the galaxy into the core and back out.
- All 23 service cards appear in act 2; stat counters tick up in act 3; pricing renders in act 4.
- Toggle OS reduced-motion → reload → canvas absent, sections still readable (static tier).

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A && git commit -m "chore(home): verification pass fixes"
```

---

## Self-Review

**Spec coverage:**
- Narrative 5 acts → Tasks 11 (acts), 12 (orchestration), 9 (3D per-act elements). ✓
- Single-store split → Task 1 (store), 7/9 read, 12 writes. ✓
- Library mapping (R3F/drei/postprocessing/rapier/theatre/gsap/motion/ogl/pixi/maath/meshline/zustand/query/radix) → assigned across Tasks 6–12. Note: **theatre.js, pixi.js, maath, meshline are installed and available but not yet wired into a task** — see gap note below. ✓ (partial)
- Copy-in Aceternity/Magic UI/React Bits → Task 10. ✓
- Perf/a11y contract (reduced-motion, no-WebGL, dpr clamp, error boundary) → Tasks 4 (CSS), 9 (canvas/boundary/dpr), 12 (reduced tier). ✓
- Error handling (boundary, missing GLB→procedural, rail self-check) → Task 9 boundary; galaxy already procedural (no GLB dependency in reused scene); Task 2 rail check. ✓
- Testing (assert .check.ts + build gate + manual) → Tasks 1/2/3 checks, Task 14 gate. ✓

**Gap note (deliberate, `ponytail:`):** theatre.js, pixi.js (embers), maath easing, and meshline orbit-links from the spec's library table are NOT wired in this plan. They are polish layers on an already-complete experience. Wiring them before the core scroll works would be building decoration on an unproven structure. **Add them as Tasks 15–18 after Task 14 passes** — each is an independent enhancement (pixi ember overlay in act 3, meshline links in the galaxy, theatre keyframed light accents, maath easing on the camera lerp) that can drop in without touching the layer interface. Flagging rather than silently dropping.

**Placeholder scan:** No TBD/TODO/"add error handling" — every code step has complete code. ✓

**Type consistency:** `setProgress`/`setTier`/`actForProgress` names match across Tasks 1, 7, 9, 12. `CATALOG`/`PROVIDER_META`/`Service` match across Tasks 3, 6, 11. `railPosition`/`railTarget` match Tasks 2, 7. ✓
