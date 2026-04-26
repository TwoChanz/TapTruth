# TruthTap — Phase Roadmap

**Version:** 1.0
**Purpose:** Define the phased rollout from V1 to V2, with clear gates between phases and a sane sequencing of ambition.

---

## Philosophy

Ship the smallest thing that can prove the thesis. Prove it with real users. Then build the next layer.

The thesis for TruthTap is: **a character-driven screen time utility, tuned for daily use, can achieve retention that generic screen time apps can't.** V1 exists to prove that thesis with the minimum viable data mechanism (screenshots + check-ins). V1.5 and V2 add depth *only after* V1 has earned them.

If V1 fails retention targets, we don't build V2 harder — we fix V1 first.

---

## V1 — "The Scroll" (Launch)

**Timeline:** 8–10 weeks
**Data mechanism:** Screenshot upload + daily check-ins
**Core promise:** TAP reads your weekly Screen Time scroll and your daily confessions, and speaks to you in a voice tuned to your preference.

### What ships
- Full onboarding (in-character from second one)
- Screenshot upload + Claude Vision extraction
- Daily confessions
- Home ledger view + weekly ledger view
- 5-tier personality slider (Clinical through Reckoning)
- 500+ dialogue lines at launch
- Vigils (streak tracking)
- 10+ unlockable Visions
- Calibration rituals
- Share scroll (image generator for social)
- Fake ads (Sponsored Prophecies)
- Paid tier (Unfiltered) — removes ads, unlocks Reckoning, unlocks all Visions
- Admin dashboard for dialogue/ad management

### Gate to exit V1
- Day 7 retention > 25%
- Weekly screenshot upload rate > 50% of MAU
- Daily confession completion > 40% of MAU
- Paid conversion > 3% within 14 days
- At least 500 total users (enough for signal, not noise)

If these don't hit within 3 months of launch, we iterate on V1 (content, onboarding, pricing) before building V1.5. Don't pile features on an unproven foundation.

---

## V1.5 — "The Rogue Instance"

**Timeline:** 4–6 weeks after V1 gates are hit
**New capability:** Unlockable alternate character — **TAP: Rogue Mode** (the Option A character we preserved)

### What ships

**Rogue Mode — the Carrot-style humor character, reframed:**
- Same name (TAP), but presented as a corrupted shard: "The instance that watched the feed too long"
- Five tiers of its own, running parallel to the main TAP personality
- Users toggle between Main TAP and Rogue TAP in Calibration
- Distinct visual treatment (glitchier glyph, color bleed, typography shifts)
- Character bible for Rogue Mode written separately; voice is sarcastic, pop-culture-aware, meme-aware, CARROT-adjacent

**Unlock conditions:**
- 30+ day vigil (any type), OR
- 20+ unlocked Visions, OR
- Unfiltered tier subscriber + any 14-day vigil

Gives paid users a faster path while still making it feel earned.

### Other V1.5 additions
- Widgets (home screen + lock screen)
- iMessage share integration
- Expanded dialogue library (target: 1,500+ lines total)
- Seasonal/topical line drops tied to calendar moments
- Better onboarding based on V1 funnel data

### Gate to exit V1.5
- Rogue Mode unlock rate > 15% of eligible users
- No retention regression vs V1
- Continued paid conversion > 3%

---

## V2 — "The Seal"

**Timeline:** 3–4 months after V1.5
**New capability:** FamilyControls + Screen Time API integration for real-time usage data and app shields
**Branding:** "TAP now walks behind the glass."

### What this requires first
- Apple Family Controls distribution entitlement application (submit in V1 post-launch window so it's in progress before V2 build starts)
- Native module development (can't be pure Expo; needs a dev client with custom native code)

### What ships

**Deep Mode (the FamilyControls integration):**
- Real-time daily usage tracking (no screenshots required)
- Per-app and per-category breakdowns with intraday precision
- "The Seal" — soft shield that shows a TAP-written interstitial before opening your worst apps, with a 10-second pause and an option to continue or retreat
- Live commentary — TAP can observe and respond within the same day, not just after the scroll
- Goal windows — block categories during focus hours if user opts in

**Free vs Paid split for V2:**
- Deep Mode is **Unfiltered-only** (paid tier). This is the monetization story for V2.
- Free users still get the full V1 experience — they're not left behind, they just don't get real-time hooks.

### Other V2 additions
- Apple Watch companion (minimal — today's reading + confession quick action)
- CSV import for users who want historical data
- Web dashboard (view ledger on desktop)
- Siri Shortcuts ("Hey Siri, what does TAP say?")

### Gate to exit V2
- 10% of paid users convert to Deep Mode within 60 days of V2 availability
- Retention for Deep Mode users > 50% at Day 30
- Family Controls entitlement actually approved (non-trivial risk)

### What if the entitlement is denied?
V2 pivots to a lighter mechanic:
- Use `DeviceActivity` framework (doesn't require the full entitlement for some reports)
- Deeper Shortcuts / widget play for surfacing data without real-time shields
- Lean harder on V1.5's content depth and Rogue Mode

This is important: **V1 must succeed on its own so we're not dependent on Apple approval for survival.**

---

## V3+ Horizon (Not Yet Committed)

Ideas that are plausible but not locked:

- **Android port** — significant effort; only if V2 numbers justify it
- **AI-generated prophecy content** — carefully, and only for personalized readings, never replacing human-written voice
- **Third TAP personality** — a full-character-unlock post V1.5 if Rogue Mode lands
- **Social features** — friend ledgers, shared vigils, but only if we find a mechanic that doesn't turn into leaderboard shame
- **Bedtime mode** — TAP reading before you sleep (audio)
- **Physical product tie-in** — the Vigil Candle from the fake ads actually shipping (meme-commerce)
- **TAP for Work** — a team version for Six1Five Studio Dev clients to use internally (probably not, but worth naming)

---

## Decision Log (to revisit at each phase gate)

| Decision | V1 answer | Revisit when |
|---|---|---|
| Data mechanism | Hybrid (screenshot + check-in) | V2 planning (FamilyControls entry) |
| Primary character | TAP: The Oracle | Never — TAP is permanent |
| Tier system | 5-tier with Clinical bottom | After V1 retention data |
| Paid pricing | $4.99/mo, $39/yr | After 3 months of conversion data |
| Platform | iOS only | V2 planning |
| Content approach | 100% human-written | V3 — consider AI augmentation |
| Rogue Mode | V1.5 unlockable | V1.5 launch |

---

## Founding Principles (Do Not Violate)

These apply in every phase:

1. **The utility must be useful without the personality.** Clinical tier is a fully functional screen time app, forever. We don't hold users hostage to a character they don't want.
2. **TAP's voice is sacred.** Any copy — marketing, App Store listing, error messages, push notifications — must pass the voice rules. If we ship off-voice content, the character is broken.
3. **No dark patterns.** No fake urgency. No notification spam. No free-trial gotchas. No fake social proof. TAP is above all of it.
4. **Content is product.** The dialogue pipeline is not a nice-to-have; it's the product's engine. Starve it and the product dies.
5. **Ship the smallest thing.** Every feature added must answer: "Does this serve V1's retention gate?" If not, it waits.
6. **User trust compounds.** We'd rather be slow and consistent than fast and brand-damaging.

---

## Summary

| Phase | What it proves | Ships | Monetization |
|---|---|---|---|
| **V1** | Character-led utility can retain users | Core ledger, screenshots, 5 tiers, gamification | Freemium + fake ads; $5/mo paid |
| **V1.5** | Character depth drives additional engagement | Rogue Mode, widgets, content expansion | Same, with Rogue Mode accelerated unlock for paid |
| **V2** | Real-time data unlocks premium retention | FamilyControls, Seal shields, Watch app | Paid Deep Mode as main upgrade path |

Build V1. Prove it. Then decide what to build next based on what the data actually says — not what the roadmap currently imagines.
