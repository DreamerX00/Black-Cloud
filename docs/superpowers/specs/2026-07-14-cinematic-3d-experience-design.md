# BlackCloud Homepage — Cinematic 3D "Game Universe" Experience (Design)

Date: 2026-07-14
Status: approved (verbal) — implementing

## Goal

Turn the homepage into a fullscreen, AAA-cinematic 3D experience: an on-rails
cinematic flythrough of a stylized "BlackCloud server galaxy," with an "Enter the
world" transition into free-roam (WASD + pointer-lock + physics) inside the SAME
3D scene. Max-fidelity post-processing everywhere. The 23 real cloud services
render as glowing node-orbs in the world.

"RTX / AAA" is interpreted as the achievable in-browser cinematic look (WebGL2),
NOT literal ray tracing. Realism comes from: HDRI image-based lighting + PBR
materials + a heavy post-processing pipeline.

## Architecture

One `<Canvas>` (WebGL2, HDR framebuffer, ACES Filmic tone mapping), one shared
`<World>` scene built once, two camera modes swapped via a zustand store.

```
app/page.tsx → <ExperienceRoot>
  <Canvas>
    <World>            Environment(HDRI), lights, volumetric fog, reflective ground
    <ServerGalaxy>     instanced racks + 23 service node-orbs (from lib/catalog)
    <FetchedModels>    Khronos GLB centerpieces + procedural fallback
    <CameraRig>        CinematicRail ↔ FreeRoam (maath damped easing)
    <Physics>(rapier)  active only in free-roam; capsule player + colliders
    <PostFX>           SSAO→Bloom→DOF→ChromaticAberration→Vignette→Noise→SMAA
  <HUD> (DOM)          intro copy, "Enter the world", service labels, control hints
```

Realism levers in priority order: (1) Poly Haven HDRI image-based lighting,
(2) PBR metalness/roughness/clearcoat materials reflecting the HDRI,
(3) post-processing wrapper.

## Camera modes

**Cinematic (default on load):** camera follows a predefined spline path
(`lib/experience/rail.ts`) through the galaxy; SCROLL scrubs progress along the
path; mouse adds subtle parallax sway; heavy DOF/bloom/grain. HUD fades in intro
copy + pulsing "Enter the world" button.

**Transition:** clicking Enter runs a scripted lunge toward the core (DOF opens,
bloom spikes — a "warp" beat), requests pointer-lock (on the click gesture, per
browser requirement), then `mode → roam`.

**Free-roam:** pointer-lock mouse-look + WASD, Shift sprint, Space context
action. Rapier capsule player + ground/rack colliders (no clipping). Proximity to
a service node-orb highlights it + shows real name/blurb from the catalog; Space
near one navigates into the product (e.g. /dashboard). Esc exits pointer-lock →
HUD "Return to cinematic" eases the camera back onto the rail.

## Assets (build-time, network-tolerant)

`scripts/fetch-assets.mjs` downloads into `/public/experience/`:
- HDRI (2k .hdr) from Poly Haven CDN — the lighting base.
- 2–3 license-clear Khronos glTF-Sample GLBs as centerpieces.
Every download is wrapped: on failure → log + skip. The scene detects missing
files and swaps in PROCEDURAL geometry (instanced racks, icosahedron orbs,
torus-knot centerpiece, all PBR). Build never hard-depends on the network.
Sources verified reachable (HTTP 200). Writes `/public/experience/CREDITS.md`
(CC0 / Khronos CC-BY attribution).

## Post-processing (max fidelity, always)

Single `<EffectComposer>`: SSAO → Bloom(HDR, mipmap) → DepthOfField →
ChromaticAberration → Vignette → Noise(film grain) → SMAA. ACES Filmic tone
mapping + HDR framebuffer. No auto-downscale (user chose max-always).

Accessibility floor (NOT a perf downgrade, non-negotiable): `prefers-reduced-motion`
and no-WebGL render a static styled fallback; mobile / no-pointer-lock devices get
drag-to-look + on-screen joystick, or cinematic-scroll only.

## New dependencies

`@react-three/postprocessing`, `postprocessing`, `@react-three/rapier`, `maath`,
`meshline`. All peer-compatible with R3F ^9 / React 19 / three 0.185 (verified).

## File layout (new)

```
scripts/fetch-assets.mjs
components/experience/{experience-root,world,server-galaxy,fetched-models,
  camera-rig,post-fx,hud}.tsx
components/experience/{free-roam-controls,store}.ts
lib/experience/rail.ts + rail.check.ts
```
`app/page.tsx` → `<ExperienceRoot>`. The existing 12-section landing is KEPT,
placed after exiting the world / behind a HUD "Skip to site" link (not deleted).

## Conventions

Next 16 + repo: `"use client"` for the experience tree; Canvas layers via
next/dynamic ssr:false; alias `@/*`; `cn()` from `@/lib/utils`; existing tokens.
Reuse `lib/catalog/nodes.ts` for the 23 services + provider accent colors.

## Non-goals

- No backend changes. No literal ray tracing / no game-engine assets.
- Not deleting the landing or the old constellation hero.
- No auto-fidelity-scaling (explicitly max-always), beyond the a11y floor.

## Verification

- `node scripts/fetch-assets.mjs` (assets land or fallback logs).
- `tsc --noEmit`, `eslint`, `next build` clean.
- `rail.check.ts`: spline continuous, progress clamps 0..1.
- Dev server + headless screenshot of a cinematic frame. Note: free-roam
  pointer-lock requires a real browser (can't be scripted headless).

## Execution

Asset script + Canvas root + store + rail on the main thread first (shared
interfaces), then parallel workflow subagents build the isolated
`components/experience/*` files, then integrate + verify.
