# BlackCloud page-builder agent brief (READ FIRST)

You are building ONE page of an award-winning, fully-immersive multi-cloud product
site. Match the quality of Lusion / Active Theory / Igloo. Every page is cinematic:
a bespoke R3F 3D scene, claymorphism on every surface, heavy but purposeful motion.

## Non-negotiable conventions (the codebase already provides these — REUSE, don't rebuild)

- Framework: **Next.js 16 App Router**, React 19, TypeScript, Bun, Tailwind v4.
  This Next.js differs from training data — if unsure about an App Router API,
  read `frontend/node_modules/next/dist/docs/01-app/`. Route = folder + `page.tsx`.
- Work ONLY inside `frontend/`. Create your page as its own route folder. If it has
  a 3D scene, put it in a sibling `scene.tsx` and load it from the page with
  `dynamic(() => import("./scene"), { ssr: false })`. Do NOT edit shared files that
  other agents also touch (globals.css, layout.tsx, providers.tsx, navbar, lib/nav,
  lib/mock, components/layout/*, components/canvas/*, components/ui/*, brand-icons).
  Those are DONE. Only READ them.

- 3D: build your scene with the shared `SceneShell` from
  `@/components/canvas/scene-shell`. It handles the R3F Canvas, WebGL error boundary,
  render-tier gating, procedural IBL (NO external HDRI/CDN fetch — never add one),
  and starfield. You supply meshes/particles + a camera + a static `fallback` prop
  for reduced-motion / no-webgl users. Use `@react-three/fiber`, `drei`,
  `@react-three/postprocessing` (already installed). Keep it 60fps.

- Marketing hero: use `@/components/layout/page-hero` (PageHero) — it mounts your
  scene, headline, subtitle, CTAs, scroll cue, and calls the tier init. Compose the
  rest of the page from `SectionReveal` (`@/components/layout/section-reveal`) and
  `ClayPanel` (`@/components/layout/clay-panel`). End marketing pages with
  `<SiteFooter />` (`@/components/layout/site-footer`). The global `<Navbar/>` is NOT
  auto-rendered on non-home routes — add `<Navbar />` from `@/components/nav/navbar`
  at the top of each marketing page.

- Claymorphism everywhere: `.clay`, `.clay-inset`, `.clay-pressable` (globals.css).
  Glass surfaces: `.glass`. Gradient text: `.text-gradient`. Display headings:
  `.font-display` (Space Grotesk). Provider/status colors: Tailwind classes
  `text-provider-aws|azure|gcp`, `text-status-success|warning|danger|info`,
  `text-accent-violet|cyan`, `text-ai`.

- Icons: brand/cloud marks via `@/lib/brand-icons` — `ServiceIcon` (provider+id from
  CATALOG), `TECH_ICON[name]`, `PROVIDER_COLOR`. UI glyphs via `lucide-react`.
  Data: `@/lib/catalog/nodes` (CATALOG) and `@/lib/mock` (PROJECTS, STATS, ACTIVITY,
  CHANGELOG, SNAPSHOTS, MIGRATION_MAP). All data is mock; no backend calls.

- Motion: `motion/react` for enter/hover/presence, `gsap` + ScrollTrigger for
  scroll-linked set-pieces. ALWAYS gate with `useReducedMotion()` (motion) — reduced
  users get instant/no animation. Existing effects in `@/components/effects/*`
  (spotlight-card, beam-border, marquee, magnetic, shimmer-button, text-reveal,
  aurora-background, meteors, tilt-card, number-ticker, split-text) — reuse liberally.

- Reuse shadcn ui in `@/components/ui/*`: button, card, badge, dialog, tooltip,
  dropdown-menu, avatar, accordion, tabs, separator, input, textarea.

- App-shell pages (dashboard/playground/etc): wrap content in `AppFrame`
  (`@/components/layout/app-frame`) with a `title`. Do NOT add Navbar/Footer there.

## Hard rules

- NO `new Date()`, `Date.now()`, or `Math.random()` in render/SSR paths (hydration +
  they're blocked here). Seed any randomness from a constant or index.
- Every page must export `metadata` (title + description) OR be `"use client"` (then
  no metadata export — set document title is unnecessary). Client pages are fine.
- Add `"use client"` to any file using hooks, motion, gsap, r3f, or browser APIs.
- Accessibility: semantic headings, alt text, focus-visible, aria labels on icon
  buttons, respect reduced-motion.
- It MUST typecheck (`bunx tsc --noEmit`) and lint (`bun run lint`) clean. The
  lint rule `react-hooks/set-state-in-effect` is enforced — don't call setState
  synchronously in an effect; derive at render or set in an event handler.

## Deliverable

A complete, beautiful, working page at the assigned route with its bespoke scene and
a reduced-motion fallback. Report the files you created.
