# TruthTap — Positioning Document

**Version:** 1.0
**Owner:** Chandler / Six1Five Studio Dev
**Status:** Approved direction, pre-PRD

---

## The One-Line Pitch

**TruthTap is a best-in-class screen time utility fronted by TAP — a deadpan data prophet who has seen your week and has things to say about it.**

---

## The 30-Second Pitch

Screen time apps today split into two broken camps. The serious ones (Apple Screen Time, ScreenZen, BePresent) are useful but feel like going to the dentist — nobody opens them unless forced. The funny ones (Roast My Screen Time, Screen Time Roast) are viral one-offs that nobody uses twice.

TruthTap borrows the formula that made CARROT Weather an Apple Design Award winner and a commercial success: a genuinely excellent utility underneath a character-driven experience, with a five-tier personality slider letting users choose how hard the app hits. It applies that formula to a category — digital wellness — that has never had a proper character-led product.

The character, **TAP**, is a clinical, aphoristic data prophet. Not sarcastic. Not cute. Accurate, eerie, and calm. The horror comes from being seen, not being insulted.

---

## Why Now

- The digital wellness category has matured (Apple Screen Time is 7 years old, the market understands the problem).
- Users have tried and abandoned the serious options — they know willpower-based apps don't work.
- Gen Z/millennial users respond to character-driven utilities (Duolingo owl, Finch, Carrot).
- OCR and vision models have become cheap and accurate enough to reliably parse iOS Screen Time screenshots, making the hybrid V1 mechanism possible without Apple entitlements.
- The FamilyControls API has stabilized enough to be a viable V2 foundation.

---

## Who This Is For

**Primary:** 18–34, iPhone users, screen time > 4 hours/day, have tried at least one screen time app and abandoned it. They know their usage is a problem but hate being lectured.

**Secondary:** 35–45 with a self-aware sense of humor about their own phone habits.

**Not the target:** parents trying to manage their kids' screens (this is ScreenCoach / Bark territory), or users who want hard app blocking without personality (they already have ScreenZen).

---

## The Carrot Formula → TruthTap Mapping

Brian Mueller's CARROT franchise succeeds on five specific elements. TruthTap inherits all of them, deliberately.

### 1. Best-in-class utility underneath the personality

Mueller says explicitly: "there are basically two apps here." The personality fails if the data layer is mediocre.

**TruthTap's utility layer must be genuinely useful independent of TAP:**
- Accurate screen time tracking and trend analysis
- Clean data visualizations (week/month/year views)
- Category-level and app-level breakdowns
- Goal setting and progress tracking
- Real insights ("You pick up your phone most often between 10pm and midnight")

If you strip TAP out completely, what remains should still be a B-tier screen time app. TAP is the A-tier upgrade.

### 2. A specific character, not just a tone

CARROT is a *thing* — a sentient AI with lore (hates meatbags, wants to destroy humanity, needs charging, has moods, has a backstory).

**TAP is a specific entity too:**
- A prophet-like presence that reads your data as if it were fate
- Clinical, aphoristic, spare
- Never jokes. The horror/humor comes from accuracy and calm.
- Has ritual language around usage patterns
- Treats your phone habits as foretold, inevitable, witnessed
- Full character bible in doc 02

### 3. Five-tier personality slider with Professional at the bottom

CARROT's tiers: Professional / Friendly / Snarky / Homicidal / Overkill. Professional mode strips the personality entirely but keeps the polish.

**TAP's tiers:**
1. **Clinical** — pure data, no personality
2. **Observed** — neutral-mystical, spare commentary
3. **Foreseen** — TAP's full default voice
4. **Prophetic** — heavier mystical language, more pointed observations
5. **Reckoning** — unfiltered, maximum intensity (unlocked after onboarding)

Critically: **Clinical mode is a fully functional screen time app.** Users who don't want personality still get a great utility. This is what makes TruthTap a daily driver instead of a novelty.

### 4. Gamification that serves the character's lore

Mueller rejected standard badge-collecting. CARROT has secret locations, missions, a dating sim, hidden achievements — all tied to character relationship.

**TruthTap rejects generic themes and badges.** Instead:
- **Ritual streaks** (consecutive days under your threshold = "unbroken vigil")
- **Visions** (unlock written lore fragments about TAP's origin)
- **Calibrations** (bonding mini-actions: acknowledging a prophecy, sealing a week)
- **The Ledger** (your patterns interpreted as prophecy-scrolls, not charts)
- **Unlockable personality shards** — most notably the future Option A rogue-AI mode

Full system in doc 03 (PRD).

### 5. Real-time topical writing

Mueller updates CARROT's dialogue within minutes for current events.

**TAP's content pipeline must be built for constant additions:**
- Dialogue templates keyed to data states (not just static strings)
- Admin surface to ship new prophecies without app updates
- Topical prophecies tied to cultural moments (new iOS release, app launches, etc.)
- Full architecture in doc 04.

### Bonus: Fake in-character ads

CARROT's free tier has ads written by Mueller, entirely fake, in-character. It turns monetization into more personality surface.

**TruthTap will ship fake ads from day one.** The Ledger and free-tier surfaces will display in-world advertisements ("Sponsored Prophecy: Your Screen Time, Refined — try BrightMind, a premium cognitive clarity subscription that does not exist"). Paid tier removes them. This is a content pipeline, not an ad network.

---

## The Wedge — What Makes TruthTap Defensible

Three things competitors cannot easily copy:

**1. The character moat.** TAP's voice, lore, and visual identity are owned IP. Competitors can copy features; they can't copy a character that has built relationship with users over months.

**2. The content pipeline as product.** Most screen time apps ship once and stagnate. TruthTap's dialogue infrastructure means the product gets better and stranger over time, without app updates. Users open it to see what TAP said today.

**3. The five-tier slider.** Nobody else in screen time offers "turn off the personality entirely but keep the polish." This makes TruthTap a daily utility for users who'd never download a "roast app." It doubles the addressable market.

---

## Competitive Positioning Map

| Competitor | Core mechanic | Personality | Retention model | TruthTap's angle |
|---|---|---|---|---|
| Apple Screen Time | Native OS data | None | Low (built-in) | We interpret your data; Apple just shows it |
| ScreenZen | Friction + pause screens | None | Very high | We're the layer *above* a tracker, not a blocker |
| BePresent | Gamification + real rewards | Generic | Medium | Our gamification has *lore*, not points |
| Breakr | Cute focus bot | Cute/positive | Medium | We're not cute. We're calm and accurate. |
| Roast My Screen Time | Screenshot roast | Aggressive/one-off | Very low | We have daily return. They have none. |
| Screen Time Roast | Webcam + AI roast | Aggressive | Low (desktop only) | We're mobile-native and tunable |
| CARROT (adjacent) | Weather + AI | Aggressive/humorous | High | We're the Carrot of screen time, not Carrot itself |

**The unfilled quadrant we own:** *Daily-return, mobile-native, character-driven, tunable-intensity screen time utility.*

---

## Success Criteria for V1

A V1 that doesn't need FamilyControls can still be a real product if it hits:

- **Day-1 retention > 60%** (industry baseline is ~25% for wellness apps)
- **Day-7 retention > 25%**
- **Weekly check-in completion > 40%** of active users
- **Share rate > 5%** (at least one in twenty users shares a TAP prophecy externally)
- **Paid conversion > 3%** of users who complete their first week

If we hit those, V2 (FamilyControls Deep Mode) becomes a paid upgrade that deepens the experience rather than a make-or-break feature.

---

## What This Is Not

- Not a parental control app
- Not a hard blocker (that's ScreenZen's territory and they own it)
- Not a productivity/focus timer (Forest, Breakr)
- Not a roast app (Roast My Screen Time is the one-off; we're the relationship)
- Not a data broker — user data stays user-scoped, no selling or aggregating

---

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| TAP's voice feels flat or boring to users | High | Clinical tier still useful; voice-test with 10 users pre-launch |
| Screenshot OCR accuracy low | Medium | Use vision model (Claude/GPT-4V) as fallback to traditional OCR |
| Content library runs thin fast | High | Build content pipeline first, dialogue templates against data states |
| FamilyControls entitlement denied in V2 | Medium | V1 succeeds on its own; V2 is upside, not dependency |
| Character feels derivative of CARROT | Medium | Oracle archetype is distinct; careful not to ape visual language |
| Solo dev capacity | High | Phased scope; V1 is genuinely minimal |

---

## Next Steps

Documents in this package:

1. ✅ **01_POSITIONING.md** — this document
2. **02_CHARACTER_BIBLE.md** — TAP's worldview, voice rules, five-tier dialogue samples
3. **03_PRD_V1.md** — V1 product requirements (hybrid data, gamification, flows)
4. **04_TECHNICAL_ARCHITECTURE.md** — stack, schema, content pipeline, OCR approach
5. **05_PHASE_ROADMAP.md** — V1 → V1.5 → V2 plan

Read in order. Every subsequent doc assumes the decisions in this one.
