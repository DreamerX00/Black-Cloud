# BlackCloud Homepage — Maximalist Overhaul (Design)

Date: 2026-07-14
Status: approved (verbal) — implementing

## Goal

Rebuild the marketing homepage (`app/page.tsx`) top-to-bottom as a long,
maximalist, Awwwards-grade landing page that pulls together the *distinct,
non-conflicting* patterns from the resource master list — implemented entirely
on already-installed dependencies plus one new design-system layer (shadcn/ui).

## Explicit scope decisions

- **Full rebuild**, including the hero (new Aceternity/Beams-style hero replaces
  the WebGL constellation hero on the homepage). The old constellation code stays
  in `components/hero/` untouched — we simply stop importing it from `page.tsx`,
  so nothing is deleted and it can be restored trivially.
- **Design layer: shadcn/ui** primitives (Button, Card, Badge, Accordion, Tabs,
  Separator). `globals.css` already maps shadcn semantic tokens → BlackCloud
  tokens via `@theme inline`, so components inherit the violet/void palette.
- **One design system only.** Explicitly excluded (conflicting/redundant/N-A):
  MUI, Ant, HeroUI, DaisyUI, Skeleton, Preline, Flowbite, Konsta (competing
  systems); v0/Bolt/Lovable/Magic Patterns (external generators, not packages);
  Mobbin/Awwwards/Land-book/Godly (inspiration galleries, not code).
- **Reused installed deps:** motion (Framer Motion), gsap/@gsap/react, three +
  @react-three/fiber + drei, ogl, the 14 `components/reactbits/*` effects, the
  `components/shared/motion.tsx` primitives, lucide-react, sonner.

## Section architecture (top → bottom)

Each section is an isolated client component under `components/landing/`.
`app/page.tsx` composes them; a shared sticky `Nav` and `Footer` wrap the page.

1. **Nav** — sticky, blur-on-scroll top bar. Logo, anchor links, Sign in / Launch CTA.
2. **Hero** — NEW. OGL `Beams` or `Aurora` backdrop + `LightRays`, `SplitText`
   headline, `RotatingText`, `ShinyText` kicker, `Magnet`+`StarBorder` CTAs.
   Reduced-motion / no-WebGL static fallback (reuse the `hasWebGL` pattern).
3. **Provider marquee** — `ScrollVelocity` logo strip of AWS/Azure/GCP services
   (real icons from the catalog).
4. **Bento feature grid** — Magic-UI-style asymmetric bento of core features
   (validation, multi-cloud canvas, export, real-time edges). shadcn `Card`.
5. **Live validation showcase** — Aceternity-style spotlight card demoing the
   canonical `ALB → RDS` error + the `LB → ECS → DB` fix, sourced from the real
   `features/validation` rule set.
6. **Interactive canvas teaser** — a small R3F/Drei or 2D animated node graph
   (constellation-lite) showing services connecting; ties to the product.
7. **Stats band** — animated count-up numbers (services, providers, rules),
   `motion` `useInView` + a small count-up hook.
8. **How it works** — 3-step timeline (Draw → Validate → Export), `ScrollReveal`.
9. **Service catalog tabs** — shadcn `Tabs` (AWS / Azure / GCP) listing the real
   23-service catalog with icons via `components/shared/provider-icon`.
10. **FAQ** — shadcn `Accordion`.
11. **Closing CTA** — `GradientText`, `Magnet`+`StarBorder`, `Particles` backdrop.
12. **Footer** — links, provider badges, colophon.

## Data sources (no invented content)

- Services / providers: `lib/catalog/nodes.ts` (`CATALOG`, `PROVIDER_META`, 23 svc).
- Validation examples: `features/validation/engine.ts` (`RULES`).
- Icons: `components/shared/provider-icon.tsx` + `/public` SVGs.

## New dependencies

- shadcn/ui components generated into `components/ui/` (Radix peer deps:
  `@radix-ui/react-accordion`, `@radix-ui/react-tabs`, `@radix-ui/react-slot`).
  These are the only new runtime deps. No new design system beyond this.

## Conventions (Next 16 + repo)

- Section components are `"use client"` (they use motion/WebGL/hooks).
- WebGL/heavy layers loaded via `next/dynamic` with `ssr: false`, matching the
  existing hero pattern.
- Import alias `@/*`. `cn()` from `@/lib/utils`. Tokens via Tailwind utilities
  (`bg-void`, `text-primary`, `border-border-strong`, `font-display`).
- Honor `prefers-reduced-motion` (already enforced globally in `globals.css`;
  components also read `useReducedMotion()` for JS-driven effects).

## Non-goals

- No backend changes. No auth/dashboard/project changes.
- No new design system beyond shadcn/ui.
- Not deleting the old constellation hero (kept for reuse).

## Testing / verification

- `bun run build` (or `next build`) passes with no type errors.
- `bun run lint` clean.
- Dev server renders the page; reduced-motion fallback verified.
- Existing `.check.ts` self-checks (catalog, validation, constellation) still pass.

## Execution

Parallel subagents build sections 3–12 concurrently (each an isolated file with
no cross-imports), then integrate into `app/page.tsx`. Hero + Nav + shadcn setup
done on the main thread first so subagents have primitives to build against.
