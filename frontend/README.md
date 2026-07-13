# ⚫ BlackCloud — Frontend

Next.js 16 + React 19 + Tailwind v4 client for the BlackCloud Cloud Decision
Intelligence Platform.

> Source of truth for scope: [`../plan/MVP.md`](../plan/MVP.md)
> Source of truth for visuals: [`../plan/DESIGN_SYSTEM.md`](../plan/DESIGN_SYSTEM.md)

---

## Stack

| Concern             | Library                                            |
| ------------------- | -------------------------------------------------- |
| Framework           | Next.js 16 (App Router, RSC)                       |
| Runtime             | React 19, Bun                                      |
| Language            | TypeScript (strict)                                |
| Styling             | Tailwind CSS v4 (flat config, CSS variables)       |
| Components          | shadcn/ui (new-york) + Radix UI                    |
| Canvas / graph      | React Flow (`@xyflow/react`)                       |
| Animation           | Motion, GSAP (Theatre.js deferred)                 |
| State (client)      | Zustand                                            |
| State (server)      | TanStack Query                                     |
| Forms + validation  | React Hook Form + Zod                              |
| Themes              | next-themes (dark-first)                           |
| Toasts              | Sonner                                             |
| Icons               | Lucide, official AWS/Azure/GCP icon packs (public/)|
| Export              | html-to-image (PNG/SVG)                            |
| Command palette     | cmdk                                               |

3D (`three`, `@react-three/*`, `drei`) and PixiJS are installed but reserved
for post-MVP polish (Vision.md landing universe, traffic simulation).

---

## Getting started

```bash
# From repo root
cd frontend
bun install
cp .env.example .env.local
bun dev            # http://localhost:3000
```

### Scripts

```bash
bun dev            # dev server
bun run build      # production build
bun start          # serve production build
bun run lint       # ESLint
bun run typecheck  # tsc --noEmit
bun run format     # Prettier
```

---

## Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router (layout, pages, route handlers)
│   ├── components/       # Shared UI (theme-provider, ui/*, layout, ...)
│   ├── features/         # Domain slices (playground, dashboard, auth) — added as MVP milestones land
│   ├── hooks/            # Cross-cutting hooks
│   ├── store/            # Zustand stores
│   ├── services/         # HTTP + TanStack Query wrappers
│   └── lib/              # utils, cn(), constants, node registry
├── public/
│   ├── AWS-ICONS/        # Official AWS Q4-2026 icon pack (1,220 SVGs)
│   └── GCP-ICON/         # Partial GCP set — Azure pack pending
├── components.json       # shadcn/ui config
└── .env.example          # Environment variable contract
```

### Path alias

`@/*` → `./src/*`

---

## Next.js 16 note

The Next.js version in this project is a newer release with API changes vs.
older training data. Always read
`node_modules/next/dist/docs/` before writing new route conventions —
see [`AGENTS.md`](./AGENTS.md).

---

## MVP checklist tracker

See [`../plan/MVP.md`](../plan/MVP.md) §Exit Criteria. Current sprint
milestone: **M0 Foundation** (design tokens, shadcn, layout, landing).
