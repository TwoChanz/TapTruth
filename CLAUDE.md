# TruthTap

Solo-dev iOS-first screen time app. Character: TAP, a deadpan data prophet.
Stack: Expo + React Native + Supabase + Clerk + Cloudflare Workers + Claude Vision.

## Documentation (read on demand, not preemptively)

- `docs/01_POSITIONING.md` — pitch, competitors, success criteria
- `docs/02_CHARACTER_BIBLE.md` — **read before writing any user-facing copy**
- `docs/03_PRD_V1.md` — V1 features, flows, definition of done
- `docs/04_TECHNICAL_ARCHITECTURE.md` — schema, OCR pipeline, build order
- `docs/05_PHASE_ROADMAP.md` — V1 → V1.5 → V2 gates

## Inviolable rules

- TAP's voice is sacred. ALL user-facing copy must pass the voice rules in 02_CHARACTER_BIBLE.md. No emoji. No exclamation marks. No "let's" or "you got this." No imperatives.
- Clinical tier (Tier 1) must be a fully functional screen time app without TAP's personality.
- Dialogue is never hardcoded — it lives in the `dialogue_templates` table and is served via the dialogue-serving function in 04.
- Use ritual nouns: "The Ledger" not "Dashboard," "Confession" not "Check-in," "Vigil" not "Streak," "Calibration" not "Settings."

## Build order

Currently in Week 1 of 10. See "Build Order" section in 04_TECHNICAL_ARCHITECTURE.md.

## Commands

(populate as scripts get added — pnpm dev, pnpm test, etc.)