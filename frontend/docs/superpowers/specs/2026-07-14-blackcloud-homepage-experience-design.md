# Descent into the Black Cloud — Homepage Experience Design

**Date:** 2026-07-14
**Status:** Approved (brainstorming)
**Scope:** Single-page, scroll-driven cinematic homepage for the BlackCloud frontend.

## Goal

One continuous scroll-driven cinematic journey that doubles as the marketing
homepage. Scroll is time: the camera falls from deep space into a "server
galaxy," and marketing content materializes *inside* the 3D world as the user
passes through it. Not "3D hero + static sections below" — the whole page is one
world.

The brief was to "use everything" from a ~40-item UI/UX resource list at maximum
intensity. This design resolves that into a coherent, world-class page by
**curation**: every strong, non-conflicting library gets exactly one job;
inspiration galleries and AI generators are used as source material (the only way
they *can* be used); redundant component libraries are deliberately omitted.

## Non-goals

- No device-based quality tiering (user chose "always maximum"). The only
  concessions are correctness/accessibility guards, not quality downgrades.
- No installing redundant component libraries (MUI, Ant, Skeleton, DaisyUI, etc.).
- No backend changes. Catalog data is fetched if available, static fallback otherwise.

## Narrative — five acts

Scroll position 0→1 maps to five scroll-locked chapters:

| Act | Scroll | 3D state | Overlay content | Effect / source |
|-----|--------|----------|-----------------|-----------------|
| 0. Boot | pre-scroll | black → starfield ignites | Logo assembles from particles, tagline | ogl particle text (React Bits style) |
| 1. Approach | 0–20% | camera drifts toward galaxy, nebula parallax | Hero headline, CTA | Aceternity Spotlight + Magic UI shimmer button |
| 2. The Galaxy | 20–50% | fly through orbiting service orbs (23 catalog services) | Feature cards pin & reveal per-orb | R3F instanced orbs + drei, GSAP ScrollTrigger pin |
| 3. The Core | 50–75% | dive into a pulsing reactor core, bloom peaks | Stats counters, "how it works" flow | postprocessing bloom + Magic UI number ticker + @xyflow flow |
| 4. Emergence | 75–100% | pull back out, galaxy behind you | Pricing, testimonials, footer CTA | shadcn cards + Aceternity background beams |

## Architecture — the single-store split

One fixed full-viewport `<Canvas>` behind everything, plus a normal scrollable DOM
column on top. They communicate through **one number in a zustand store**
(`scrollProgress`, 0→1, plus derived `act` and `tier`). That single number is the
entire interface between the two layers.

```
app/page.tsx
 ├─ <ExperienceCanvas/>   (fixed, z-0)  ── READS scrollProgress
 └─ <ActsScroll/>          (relative, z-10) ── WRITES scrollProgress
      ├─ Act0Boot ... Act4Emergence
```

- **3D layer** (`components/experience/*`) — reads `scrollProgress`, drives the
  camera along a Catmull-Rom rail (`lib/experience/rail.ts`), swaps postprocessing
  intensity per act. Knows nothing about DOM content.
- **DOM layer** (`components/acts/*`) — normal scrollable sections; GSAP
  ScrollTrigger pins/reveals content and writes `scrollProgress` up to the store.
  Knows nothing about Three.js internals.

Either layer can be rebuilt without touching the other. Folder boundaries enforce
this: `experience/*` imports the store + three; `acts/*` imports the store + DOM
libs; neither imports the other.

## Library mapping — one job each

### Already installed → assigned a job

| Library | Job |
|---|---|
| React Three Fiber + drei | The 3D world: canvas, instanced orbs, HDRI lighting, camera rig |
| @react-three/postprocessing + postprocessing | Bloom, DOF, chromatic aberration, vignette, noise |
| @react-three/rapier | Physics: orb drift/collision, core debris field |
| theatre.js (@theatre/core + r3f) | Keyframed cinematic camera/light sequences per act |
| GSAP + @gsap/react | ScrollTrigger: pin acts, scrub 3D progress, reveal text |
| motion (Framer Motion 12) | DOM micro-interactions: hovers, staggered text, layout |
| ogl | Boot-act particle logo + lightweight shader background band |
| pixi.js | 2D particle overlay (embers/sparks over the core act) |
| maath / meshline | Easing + glowing trail lines between orbs |
| zustand | The scrollProgress + act + tier store (the layer interface) |
| TanStack Query | Fetch live service catalog (static fallback) |
| Radix primitives | Accessible base for shadcn components |
| sonner / next-themes / lucide | Toasts, theme, icons |

### To add (curated copy-in sources — no packages)

| Add | Why not redundant |
|---|---|
| shadcn/ui (generated locally) | The only general component system: cards, buttons, tabs, accordion |
| Aceternity UI (paste source) | Premium backgrounds: Spotlight, Background Beams, Aurora, Card Spotlight |
| Magic UI (paste source) | Shimmer button, number ticker, marquee, text reveal |
| React Bits (paste source) | Particle/aurora hero pieces (built on ogl, already installed) |

### Deliberately omitted (ponytail — on purpose)

- **Redundant component libs** — MUI, Ant, Skeleton, Konsta, HeroUI, Preline,
  Flowbite, HyperUI, Meraki, DaisyUI, Float, Kokonut, SyntaxUI, Origin, Animata,
  Motion-Primitives, Motion One. Each duplicates a job shadcn / Aceternity /
  Magic UI / motion already own. Adding them means conflicting CSS resets and
  multiple implementations of the same primitive.
- **Inspiration galleries** — Awwwards, Mobbin, Godly, Land-book, Lapa, One Page
  Love. Nothing to install; mined for layout inspiration.
- **AI generators** — v0, Bolt, Lovable, Magic Patterns. Not dependencies.
- **Marketplaces** — 21st.dev, Shadcn Blocks, UI Wiki. Specific blocks lifted as
  source if useful.

## Data flow — one direction, one number

```
scroll event ──► GSAP ScrollTrigger (in ActsScroll)
                      │ writes
                      ▼
              useScrollStore { progress: 0→1, act: 0-4, tier }
                      │ read via getState() inside useFrame (no re-render)
                      ▼
        ExperienceCanvas ──► camera rig samples rail(progress)
                         └─► postFX intensity = f(act)
```

Critical perf move: the 3D layer reads the store **inside `useFrame` via
`getState()`, not a React hook** — scrolling never re-renders the canvas. DOM
overlays re-render only on act *changes* (5 times total), not per scroll tick.

Service catalog: TanStack Query fetches the live list; on error or SSR it uses a
static array of 23 services. Orbs render from whatever the store hands them.

## Performance & accessibility contract

"Always maximum" is honored: max visual settings run on every device. The
following are correctness/accessibility guards, **not** quality tiers:

- **`prefers-reduced-motion`** → canvas does not mount; sections fade in
  (opacity only); counters show final value instantly. Non-negotiable a11y floor.
- **No-WebGL fallback** → if `<Canvas>` can't get a context, render a static
  starfield + DOM content instead of a blank screen. Wrapped in an error boundary
  so any shader/Three.js crash falls back to the static tier.
- **`dpr={[1, 2]}`** → cap pixel ratio at 2x (invisible vs 3x, huge fps win).
  `ponytail:` single clamp; raise ceiling only if 3x retina is explicitly wanted.
- **Lazy-mount heavy acts** → pixi embers + rapier physics instantiate only when
  their act is near viewport (GSAP callback), disposed when far. Full quality;
  simply not running off-screen where invisible.

Stated tradeoff: "always maximum on every device" and "smooth on a phone" cannot
both be fully true. Resolution above: max visual settings everywhere, don't *run*
off-screen effects, don't render 3x when 2x is indistinguishable.

## Error handling

- Canvas error boundary → static tier on any Three.js/shader crash.
- Missing GLB asset → procedural orb (reuse fallback pattern from commit 2c62cb9).
- `rail.ts` ships with `rail.check.ts` assert self-check.

## File structure

```
frontend/
├─ app/
│  ├─ page.tsx              # composes <ExperienceCanvas/> + <ActsScroll/>
│  ├─ layout.tsx            # fonts, providers, metadata (BlackCloud)
│  ├─ providers.tsx         # TanStack Query + theme + sonner
│  └─ globals.css           # dark space theme tokens, Tailwind v4 @theme
├─ lib/
│  ├─ experience/rail.ts        # reuse from commit 2c62cb9
│  ├─ experience/rail.check.ts  # reuse; assert self-check
│  ├─ catalog.ts                # 23-service fallback + Query hook
│  └─ utils.ts                  # cn() for shadcn
├─ components/
│  ├─ experience/          # 3D LAYER — reads store only
│  │  ├─ experience-canvas.tsx   # <Canvas>, error boundary, no-WebGL fallback
│  │  ├─ camera-rig.tsx          # samples rail(progress) in useFrame via getState()
│  │  ├─ server-galaxy.tsx       # instanced orbs + meshline links
│  │  ├─ reactor-core.tsx        # act-3 core + rapier debris
│  │  ├─ post-fx.tsx             # bloom/DOF/CA/vignette/noise
│  │  └─ theatre-director.tsx    # keyframed light/camera accents
│  ├─ acts/               # DOM LAYER — writes store only
│  │  ├─ acts-scroll.tsx         # ScrollTrigger orchestration, tier detection
│  │  ├─ act0-boot.tsx           # ogl particle logo
│  │  ├─ act1-approach.tsx       # Aceternity spotlight hero + Magic UI shimmer CTA
│  │  ├─ act2-galaxy.tsx         # pinned feature cards
│  │  ├─ act3-core.tsx           # number tickers + xyflow "how it works"
│  │  └─ act4-emergence.tsx      # pricing/testimonials/footer (shadcn cards)
│  ├─ effects/            # copy-in sources (Aceternity/Magic UI/React Bits)
│  └─ ui/                 # shadcn generated (button, card, tabs, accordion…)
└─ store/scroll-store.ts   # zustand: { progress, act, tier }
```

## Testing & verification (assert-based, no framework)

- **`rail.check.ts`** — spline passes through control points at t=0/1, stays
  continuous. Run via `bunx tsx`.
- **`scroll-store` self-check** — progress clamps to [0,1]; `act` derives
  correctly at boundaries (0.19→act1, 0.20→act2, …). One `.check.ts`.
- **`catalog.ts` self-check** — fallback array has exactly 23 entries with
  required fields.
- **Build + typecheck gate** — `bun run build` must pass (catches SSR/hydration
  issues; a WebGL hydration bug bit this project before, fixed in a391891).
- **Manual verify** — `bun run dev`, scroll all 5 acts, then toggle OS
  reduced-motion and confirm the static tier renders.

No test framework, no fixtures — assert-based `.check.ts` files plus the build gate.
