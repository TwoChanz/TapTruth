# TruthTap — Strategy & Build Package

**Project:** TruthTap
**Studio:** Six1Five Studio Dev
**Owner:** Chandler
**Status:** Pre-build, planning complete
**Last updated:** April 24, 2026

---

## One-line description

TruthTap is a best-in-class screen time utility fronted by **TAP** — a deadpan data prophet with a five-tier personality slider, tuned from invisible to unhinged.

## The formula

This is the **Carrot of screen time** — inheriting the specific elements that made Brian Mueller's CARROT franchise an Apple Design Award winner and a commercially sustainable indie app, applied to a category (digital wellness) that has never had a proper character-led product.

---

## Documents in this package (read in order)

| # | Document | What it answers |
|---|---|---|
| 01 | [`01_POSITIONING.md`](01_POSITIONING.md) | Why this exists, who it's for, how it differs from competitors, what success looks like |
| 02 | [`02_CHARACTER_BIBLE.md`](02_CHARACTER_BIBLE.md) | Who TAP is, voice rules, five-tier dialogue samples, fake ad style guide |
| 03 | [`03_PRD_V1.md`](03_PRD_V1.md) | V1 feature set, user flows, paid tier, definition of done |
| 04 | [`04_TECHNICAL_ARCHITECTURE.md`](04_TECHNICAL_ARCHITECTURE.md) | Stack, Supabase schema, OCR pipeline, dialogue-serving logic, admin dashboard |
| 05 | [`05_PHASE_ROADMAP.md`](05_PHASE_ROADMAP.md) | V1 → V1.5 → V2 plan with gates and principles |

---

## Decisions locked

- **Character:** TAP (Oracle archetype — clinical, aphoristic, mystical-data-prophet)
- **Visual:** Single pulsing glyph (three concentric circles, not a face)
- **Data mechanism V1:** Hybrid (iOS Screen Time screenshot + daily confessions)
- **Data mechanism V2:** FamilyControls / Screen Time API (real-time Deep Mode)
- **Monetization:** Freemium + fake in-character ads (Sponsored Prophecies); paid tier $4.99/mo
- **Stack:** Expo + React Native + Supabase + Clerk + Cloudflare Workers + Claude Vision (same foundations as Cage Picks)
- **Future unlock:** Option A humor-character preserved as "TAP: Rogue Mode" in V1.5

---

## Decisions still open (pre-build)

- Final pricing ($4.99 vs $6.99 — benchmark against BePresent and ScreenZen current pricing closer to launch)
- Reckoning tier unlock confirmation phrase wording
- Whether weekly Sunday ledger requires a new screenshot to unlock (leaning yes)
- App Store visual identity and screenshot designs (design phase)
- Launch marketing approach (separate doc later)

---

## Next actions

1. Read all 5 docs start to finish, take notes on anything you want to adjust
2. Decide any open questions above
3. Set up monorepo (`apps/mobile`, `apps/web`, `apps/workers`) under the Six1Five Studio Dev GitHub org
4. Begin Week 1 of the build order in doc 04 (repo setup, auth, base theme)
5. Budget 8–10 weeks for V1 at current solo-dev pace

If anything in these docs no longer feels right after you sit with it, change it before the first line of code. The character and voice rules especially — it's cheap to change now, expensive to change once 500 lines of dialogue exist.

---

## Guiding reminders

- **The utility must work without the personality.** Clinical tier is real product, not a hostage situation.
- **TAP's voice is sacred.** Every piece of copy, everywhere, passes the voice rules.
- **Content is product.** The dialogue pipeline is the engine. Starve it and the app dies.
- **Ship the smallest thing.** Every feature added must answer: "Does this serve V1's retention gate?" If not, it waits.
