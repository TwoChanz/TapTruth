# TruthTap

A best-in-class screen time utility fronted by **TAP** — a deadpan data prophet with a five-tier personality slider.

**Studio:** Six1Five Studio Dev
**Status:** Pre-launch, Week 1 of 10
**Stack:** Expo + React Native · Next.js 14 · Cloudflare Workers · Supabase · Clerk · Anthropic Claude Vision

---

## Monorepo layout

```
apps/
├── mobile/     # Expo + React Native + Expo Router (iOS-first)
├── web/        # Next.js 14 App Router — marketing + shareable scrolls + admin
└── workers/    # Cloudflare Workers — OCR pipeline (Claude Vision)

packages/
├── theme/             # Design tokens (colors, typography, spacing)
├── types/             # Shared TypeScript types (DB schema mirrors)
└── dialogue-contract/ # Worker ↔ mobile shared types for dialogue serving
```

## Strategy & build docs

Live in [`docs/`](docs/README.md). Read in order — every doc assumes the prior decisions.

## Quick reference

- Read `CLAUDE.md` for project rules and inviolable conventions
- Read `docs/02_CHARACTER_BIBLE.md` before writing any user-facing copy
- Read `docs/04_TECHNICAL_ARCHITECTURE.md` for schema, OCR pipeline, and build order

## Local setup

```bash
# Use Node 20.11+ and pnpm 9+
nvm use            # picks up .nvmrc
pnpm install
```

## Workspace scripts

```bash
pnpm mobile <cmd>   # run a script in apps/mobile
pnpm web <cmd>      # run a script in apps/web
pnpm workers <cmd>  # run a script in apps/workers
pnpm typecheck      # type-check every workspace in parallel
pnpm lint           # lint every workspace in parallel
pnpm format         # prettier write across the repo
```

(Per-app commands fill in as each chunk lands.)
