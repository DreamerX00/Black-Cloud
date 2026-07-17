# BlackCloud — Full Immersive Frontend (all pages)

> Date: 2026-07-17
> Goal: Build every remaining page of BlackCloud to an award-winning, fully-immersive
> standard (Lusion / Active Theory / Igloo tier). Marketing pages fully built; product
> app surfaces built as visually-complete animated shells with mock data (no backend
> wiring). Max immersion on every page. Bespoke R3F scene per page.

## Decisions (locked)

- **Scope:** Marketing pages fully built + immersive product *shells* (dashboard,
  playground, ai-architect, migration, simulator, time-machine) with mock data and full
  animation. No real backend/auth wiring.
- **Immersion:** Max everywhere — every page is a cinematic experience with a 3D/scroll
  set-piece, claymorphism on every surface, heavy motion.
- **3D approach:** Fully bespoke per-page R3F scene, each built on a shared `SceneShell`
  harness (canvas + error boundary + tier gating) for consistent perf and fallbacks.
- **Execution:** Shared primitives first, then parallel-agent workflow to build pages.

## Foundation already in place (reuse, do not rebuild)

- Next.js **16.2.10** App Router, React 19.2.4, Bun, Tailwind v4, TypeScript.
  IMPORTANT: this Next.js has breaking changes vs training data — consult
  `node_modules/next/dist/docs/` before using unfamiliar App Router APIs.
- Homepage `/`: 5-act GSAP ScrollTrigger cinema over a fixed R3F `ExperienceCanvas`
  (server-galaxy → reactor-core), tier-gated via `store/scroll-store.ts`
  (`full | reduced | no-webgl`). This is the quality bar and the template.
- Effects library (`components/effects/*`): aurora-background, meteors, spotlight(-card),
  beam-border, marquee, magnetic, shimmer-button, ripple-button, split-text, text-reveal,
  tilt-card, number-ticker, parallax, particle-logo, cursor-glow, dot/grid-pattern.
  REUSE these; do not reinvent.
- R3F harness (`components/experience/*`): `experience-canvas` (GLBoundary + procedural
  IBL — no external HDRI fetch), `camera-rig`, `post-fx`, `server-galaxy`, `reactor-core`.
- shadcn/ui primitives (`components/ui/*`): button, card, accordion, tabs, separator.
  Add more from shadcn as needed (input, dialog, sheet, tooltip, dropdown, command,
  sidebar, badge, avatar, table).
- Claymorphism tokens + `.clay` / `.clay-inset` / `.clay-pressable` in `app/globals.css`.
  Provider/accent colors per `plan/DESIGN_SYSTEM.md`.
- `lib/catalog/nodes.ts` — cloud service CATALOG (extend for playground/migration).
- Providers: TanStack Query, next-themes (dark default), sonner Toaster.

## Shared conventions (the contract every page follows)

1. **Per-page 3D:** each cinematic page owns `scene.tsx` — a bespoke R3F scene — loaded
   with `dynamic(() => import('./scene'), { ssr: false })`, wrapped in the shared
   `SceneShell`. Reuse the procedural-IBL pattern (no runtime HDRI/CDN fetches).
2. **Tier gating & a11y:** every scene reads `scroll-store` tier. `reduced`/`no-webgl`
   users get a static premium-flat fallback (claymorphism + gradients + CSS, no canvas).
   All motion respects `prefers-reduced-motion` like `acts-scroll.tsx` / effects do.
3. **Claymorphism everywhere:** panels, cards, inputs, nav, buttons use `.clay*`.
4. **Motion:** GSAP ScrollTrigger for scroll-linked set-pieces; `motion` for
   enter/hover/presence. Physics/spring easing. No decorative infinite loops.
5. **Icons:** lucide-react + provider brand marks. Provider colors from design system.
6. **Data:** all mock, colocated under `lib/` (extend `CATALOG`; add `lib/mock/*`).
7. **No new heavy deps** without need — the stack (three, r3f, drei, postprocessing,
   rapier, gsap, motion, pixi, xyflow/react-flow, ogl) already covers everything.

## New shared primitives (build BEFORE pages — Phase 1)

- `components/canvas/scene-shell.tsx` — R3F `<Canvas>` wrapper: GLBoundary, tier gating,
  procedural IBL defaults, dpr/perf settings, optional `<Stars>`. Props for camera + children.
- `components/layout/page-hero.tsx` — cinematic hero scaffold (full-viewport, scene slot,
  headline via `TextReveal`/`SplitText`, CTA row, scroll cue).
- `components/layout/section-reveal.tsx` — scroll-triggered section wrapper (motion inView).
- `components/layout/clay-panel.tsx` — standardized clay surface variants.
- `components/layout/site-footer.tsx` — extract footer from `act4-emergence.tsx`; reuse
  site-wide (marketing pages).
- `components/layout/app-frame.tsx` — console shell: clay sidebar (nav), top bar
  (search/command trigger, theme, avatar), content slot. Used by all `(console)` pages.
- `components/nav/command-palette.tsx` — ⌘K palette (shadcn command) for global nav.
- Upgrade `components/nav/navbar.tsx` links from anchors to real routes; add mega/product
  dropdown. Keep the existing scroll/blur behavior.
- `lib/mock/*` — mock projects, activity, migration jobs, snapshots, ai-plans.
- Add fonts: Space Grotesk (display), JetBrains Mono (mono) via `next/font`, wired into
  `--font-heading` / `--font-mono`.

## Page map (~20 routes)

Marketing (fully built, max immersion):
- `/` — DONE (server-galaxy flythrough).
- `/product/playground` — hero: interactive canvas-node bloom.
- `/product/ai-architect` — hero: neural/particle bloom forming an architecture.
- `/product/migration` — hero: morph-bridge (provider A → B service morph).
- `/product/simulator` — hero: failure-storm (traffic reroute under failure).
- `/product/time-machine` — hero: timeline rewind / snapshot ghosts.
- `/pricing` — floating clay pricing monoliths in space; tier compare; FAQ.
- `/docs` — knowledge constellation grid-field + doc sidebar + sample article.
- `/about` — origin-story scroll cinema; team; values.
- `/contact` — signal-beacon hero + clay form (mock submit → sonner toast).
- `/changelog` — timeline stream of releases.
- `/legal/privacy`, `/legal/terms` — minimal aurora content pages.

App shells (visually complete, mock data, `AppFrame`):
- `/login`, `/signup` — clay auth card over drifting particle field (mock submit).
- `/dashboard` — project grid, live-pulse stat cards (number-ticker), recent activity.
- `/playground` — React Flow (`@xyflow/react`) canvas with custom animated cloud nodes
  from `CATALOG`, node library sidebar, inspector panel, minimap, mock validation toasts.
- `/ai-architect` — prompt input → animated "generating" → mock diagram + cost/terraform tabs.
- `/migration` — source→target selector, animated morph visualization, insight scores.
- `/simulator` — architecture view + failure controls + animated reroute + warnings.
- `/time-machine` — snapshot timeline slider + visual diff of two architecture states.
- `not-found.tsx` — lost-in-space 404 with mini R3F drift + route-home CTA.

## Build phases

1. **Phase 1 — Shared primitives + nav/footer/fonts/mock data** (sequential; everything
   depends on it). Verify with tsc/lint before fan-out.
2. **Phase 2 — Marketing pages** (parallel agents, one per page/product).
3. **Phase 3 — App shells** (parallel agents; `AppFrame` from Phase 1).
4. **Phase 4 — Integration pass:** wire nav/footer/command-palette across all routes,
   cross-link CTAs, 404, global polish.
5. **Phase 5 — Verification:** `bunx tsc --noEmit`, `bun run lint`, `.check.ts` self-checks,
   Playwright screen-check every route (desktop + mobile), reduced-motion pass.

## Error handling & edge cases

- No-WebGL / reduced-motion: static premium-flat fallback per scene (mandatory).
- SSR: all R3F is `ssr:false`; no `new Date()`/`Math.random()` in render paths that
  hydrate (matches existing `act4` static-year note). Seed any randomness deterministically.
- Route not found → themed `not-found.tsx`.
- Forms are mock: validate with zod + react-hook-form, submit → sonner toast, no network.

## Testing strategy

- Type: `bunx tsc --noEmit` clean.
- Lint: `bun run lint` clean.
- Logic self-checks: keep the `.check.ts` convention for any new pure logic (validation,
  catalog, diff, mock generators) — assert-based, runnable with `bun`.
- Visual: Playwright navigates each route, screenshots desktop (1440) + mobile (390),
  confirms hero renders, no console errors, reduced-motion variant loads.

## Out of scope

- Real backend/auth/persistence, real cloud API calls, real Terraform generation,
  multiplayer, billing. All product surfaces are mock shells.
