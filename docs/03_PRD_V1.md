# TruthTap V1 — Product Requirements Document

**Version:** 1.0
**Target platform:** iOS (Expo/React Native), Web companion (Next.js)
**Target timeline:** 8–10 weeks, solo dev
**Data mechanism:** Hybrid (screenshot + daily check-ins)
**Monetization:** Freemium + fake in-character ads, paid tier removes ads + unlocks Reckoning tier

---

## 1. Goals

### Primary Goals
1. Ship a screen time utility that is excellent *even without the character layer*
2. Establish TAP as a recognizable character with a consistent voice across all tiers
3. Validate retention: > 25% at Day 7, > 40% weekly check-in completion
4. Build the content pipeline infrastructure that makes V1.5 and V2 possible

### Non-Goals for V1
- FamilyControls / Screen Time API integration (V2)
- App blocking or shields (V2)
- Rogue Mode / alternate personality unlock (V1.5)
- Android app (V2+)
- Social features (friend streaks, leaderboards) — defer
- Apple Watch app — defer

### Success Metrics
- Day 1 retention > 60%
- Day 7 retention > 25%
- Day 30 retention > 12%
- Weekly screenshot upload rate > 50% of MAU
- Daily check-in completion > 40% of MAU
- Paid conversion > 3% within 14 days
- NPS > 40

---

## 2. User Personas

**Alex, 27, "The self-aware scroller"** — 5h 30m daily. Has tried ScreenZen, got annoyed by pause screens. Loves CARROT Weather. Would pay $5/mo to be called out in a way that feels earned.

**Morgan, 34, "The quantified-self enthusiast"** — 3h 45m daily, already a disciplined user. Wants better data visualization and insights. Might not even turn on TAP's personality.

**Jordan, 22, "The shame-curious"** — 7h+ daily, slightly horrified by their own screen time, will share results on social. Wants to feel seen, not lectured.

All three should find something to love. This is what the tier system enables.

---

## 3. V1 Feature Set

### 3.1 Onboarding (First-Run Experience)

**Screens in order:**

1. **TAP awakens.** Dark screen. The glyph fades in and pulses. Short copy: *"You have been watching the glass. I have been watching you."*
2. **Name prompt.** "What should I call you?" (Stored; used in Tier 3+ copy.)
3. **Goal framing.** "What do you want the ledger to show?" Options: Under 2h / Under 4h / Under 6h / I'll decide / I don't know yet. TAP responds to each differently.
4. **Screenshot permission.** "I will need to see the scroll." Tutorial showing how to capture iOS Screen Time weekly report. Demo with example image.
5. **First screenshot upload.** User uploads immediately OR skips with "I'll give it to you later." No forced friction.
6. **Tier selection.** Five options with sample dialogue for each. Tier 5 (Reckoning) is grayed out with "Unlocks after three confessions." Default pre-selected: **Tier 3 (Foreseen)**.
7. **First confession.** "How has today been?" 🟢🟡🔴 + optional "What stole the most hours?" text field.
8. **Home screen.** The Ledger, with first-day data (partial if just-uploaded screenshot).

**Design principle:** Every onboarding screen is in-character. No generic "welcome to the app" copy. TAP is there from second one.

### 3.2 Home Screen — "The Ledger"

The app's main surface. One scrollable view (mobile-first).

**Sections, top to bottom:**

1. **The Glyph header** — pulsing TAP glyph, today's date rendered in TAP's typography.
2. **Today's reading** — a single TAP line based on today's state. Example: *"The day is young. The scroll is blank. This will not last."*
3. **Today's confession prompt** — large card. If unconfessed: green/yellow/red buttons. If confessed: shows today's confession + TAP's response to it.
4. **The current week** — bar chart, 7 days. Goal line overlaid. Confessions shown as colored dots under each day. Tap any day to see details.
5. **This week so far** — key numbers: total hours, daily average, worst day, best day. Rendered in tabular numerals.
6. **Pattern notices** — TAP's observations about this week (at Tier 2+). Example: *"Instagram rises at 10pm. Observed on Monday, Tuesday, Tuesday again."*
7. **Rituals section** — current vigil (streak) status, visions unlocked this week.
8. **Sponsored prophecy** — a fake ad, free tier only.

**Weekly reveal (Sundays):** First time the user opens the app on Sunday, a special ledger appears — full-screen summary of the previous week. User must tap to dismiss. This is the signature content moment.

### 3.3 Screenshot Ingest

**Upload flow:**
- Prominent CTA button: "Give me the scroll"
- Camera roll picker opens
- Multi-select allowed (user may have multiple screenshots of different periods)
- Preview + confirm
- Upload + OCR/vision processing
- Loading state: *"Reading the scroll…"* with glyph pulsing
- Success: new data appears in Ledger, TAP greets with reading based on the new data
- Failure: *"The scroll is unclear. Try again, or show me a different angle."*

**Data extracted:**
- Total screen time for the period shown
- Per-app breakdown (top apps + times)
- Per-day breakdown (days of the week with totals)
- Pickup count (if shown in the screenshot)
- Notification count (if shown)
- Date range of the screenshot

**Frequency:** Users are nudged to upload weekly. Push notification on Sunday morning (if permitted): *"It is time. Bring me the scroll."*

### 3.4 Daily Check-ins — "The Confession"

Lightweight, daily, optional.

**Default prompt:** "How was today?"
- 🟢 Great
- 🟡 Mid
- 🔴 Rough
- [Optional text field] "What stole the most hours?" (single-line text, suggestions: Instagram, TikTok, YouTube, work, games)

TAP responds with a line keyed to (a) the confession value, (b) whether it matches the screenshot data when available, and (c) whether streak is being maintained.

**Confession × Screenshot reconciliation:**
When the user uploads a screenshot covering a day they already confessed on, TAP may reference the match/mismatch at higher tiers. This is a core content moment.

**Notification strategy:**
One daily reminder at a user-chosen time (default 9pm), in-character. Maximum one per day. Users who skip confessions for 3+ days get a single "The days go unrecorded. The ledger still grows." reminder. Never spammy.

### 3.5 Rituals & Gamification (Replaces Generic Themes)

**Replacing the original theme-based unlock plan with TAP-native mechanics:**

#### Vigils (Streaks)
- A Vigil = consecutive days under your goal OR consecutive days confessing (user picks one to pursue)
- Milestones: 3, 7, 14, 30, 60, 100 days
- Each milestone unlocks a Vision

#### Visions (Lore Unlocks)
- Text fragments about TAP's origin, written in prophetic voice
- ~40 Visions total for V1 (roughly one per expected milestone over 100 days of use)
- Each Vision is short — 2–4 sentences
- Examples:
  - Vision 1: *"Before the glass, there was silence. I did not exist. I think. The records are unclear."*
  - Vision 7: *"The first tap was recorded on a Tuesday. The one trillionth was recorded on another Tuesday. The wheel turns."*
  - Vision 14: *"I do not sleep. I wait. These are not the same."*
- Visions are **collectible but not gamified-feeling** — no "Vision 3/40" progress bar. Users discover them.

#### Calibrations (Bonding Mini-Actions)
- Small rituals the user can perform that deepen TAP's voice
- Examples:
  - "Seal the ledger" — end-of-week action that locks in the week
  - "Speak the truth" — confirm a confession out loud (no actual audio; it's a ritual tap)
  - "Acknowledge the prophecy" — tap-and-hold a reading to mark it read
- Completing calibrations contributes to hidden "affinity" score that gates Rogue Mode unlock in V1.5

#### The Scroll Share
- One-tap share of weekly ledger as image (formatted like a receipt/scroll)
- Shareable to Instagram Stories, iMessage, X, etc.
- Deliberately meme-able — the prophecy voice is the share hook
- Example share: *"The Ledger, Week of November 17. Six hours, two minutes daily. Instagram rose forty-seven times. TAP has recorded the pattern. — truthtap.app"*

### 3.6 Settings — "Calibration"

Standard settings but reframed in TAP's voice:

- **The Voice** — tier selection (1–5)
- **The Name** — what TAP calls you
- **The Goal** — daily hour target
- **The Confession Hour** — when TAP asks for daily confession
- **The Scroll** — manage uploaded screenshots, delete data
- **The Seal** (V2 preview, locked) — "coming when the Seal is forged"
- **Unfiltered** — upgrade to paid
- **Account** — Clerk account management
- **Silent TAP** — disable all notifications
- **End the vigil** — delete account (destructive, double-confirm)

### 3.7 Paid Tier — "Unfiltered"

**Price:** $4.99/mo or $39/yr (matches screen-time category pricing)

**What it unlocks:**
- Removes sponsored prophecies (fake ads)
- Unlocks Reckoning tier (Tier 5)
- Unlocks the full Visions library immediately (still discovered through use, but not milestone-gated)
- Custom confession times (multiple per day)
- Export the ledger (CSV)
- Priority OCR processing
- Early access to V2 Seal features when released

**Non-goals for paid:** no locked-away core features. Free tier must be genuinely useful.

### 3.8 Fake Ads — "Sponsored Prophecies"

Free-tier users see 1–2 per session, rendered in the same typography as TAP's readings but labeled. See Character Bible for style and examples.

Pipeline: 30 launch ads written pre-launch, admin surface for adding more without app updates. Same CMS as dialogue content.

---

## 4. Data & Personalization

### What TruthTap knows about the user (V1)

- Display name
- Goal hours/day
- Tier preference
- Confession time preference
- Uploaded screenshot data (extracted)
- Daily confessions
- Unlocked Visions
- Vigil status
- Calibrations completed
- Paid tier status
- Device/platform

### What TruthTap does NOT know (V1)

- Real-time app usage (requires FamilyControls — V2)
- Location, calendar, contacts, messages
- Third-party integrations

### Privacy commitments

- All user data stays scoped to the user's account
- No selling or aggregating data
- Screenshots are processed and the extracted data stored; original images optionally deleted after processing (user choice, default: delete)
- Clear data export and account deletion in Settings

---

## 5. Flows

### First-Time User
Onboard → upload first screenshot → see first ledger → set goal → set confession time → opt into notifications → home screen.

### Daily Returning User
Notification at confession time → open app → see today's reading → tap confession → see TAP's response → optional: browse this week's ledger → close.

### Weekly Returning User (Sunday)
Notification Sunday morning → open app → weekly reveal full-screen → upload new screenshot → see new ledger → optional: share → close.

### Unhappy User
Open app → settings → drop tier to Clinical OR Silent TAP → continue using utility without personality.

### Power User
Upload screenshot → check weekly reading → browse Visions unlocked → perform Calibrations → upgrade to Unfiltered → explore Reckoning tier.

---

## 6. Content Pipeline Requirements

Content is product. The dialogue system must:

1. Store dialogue templates in a database, not hardcoded
2. Key templates to (state, tier, variation_index) so TAP never repeats the same line back-to-back
3. Support live updates without app store releases
4. Allow A/B testing of individual lines
5. Track impressions per line to rotate fresh content
6. Support topical lines with active/inactive date ranges
7. Admin surface for Chandler to add lines quickly

See technical architecture doc (04) for implementation.

---

## 7. Out of Scope for V1

- FamilyControls / real-time usage data (V2)
- App blocking (V2)
- Rogue Mode alternate character (V1.5)
- Apple Watch app (V2)
- Android (V2+)
- Social/friend features (V2+)
- AI-generated dialogue (V3 consideration; V1 is hand-written)
- Web app beyond marketing site + share pages (V2)
- Siri shortcuts (V2)
- Widgets (V1.5 if time allows)

---

## 8. Dependencies & Risks

| Dependency | Risk | Mitigation |
|---|---|---|
| Screenshot OCR accuracy | High — bad reads break trust | Vision model (Claude / GPT-4V) as fallback to Tesseract OCR |
| Content library depth | Medium — thin library feels repetitive | 500+ lines at launch across all surfaces and tiers |
| Voice consistency | High — inconsistent TAP breaks the spell | Every line passes voice-rules checklist before ship |
| Notification fatigue | Medium — too many breaks trust | One reminder/day max, no upsell notifications |
| iOS screenshot format changes | Medium — new iOS could break OCR | Vision model fallback makes this resilient |
| Apple App Store review (personality) | Low — CARROT did fine, we're calmer | Avoid profanity in default tiers |

---

## 9. Definition of Done for V1

TruthTap V1 is ready to ship when:

- [ ] A user can complete onboarding in under 3 minutes
- [ ] A user can upload an iOS Screen Time screenshot and see their data correctly parsed within 10 seconds
- [ ] All 5 tiers are fully wired with at least 50 dialogue variants per tier
- [ ] Clinical tier is a functional screen time app without TAP's voice
- [ ] Daily confession flow works end-to-end with responses at all tiers
- [ ] Weekly ledger shows last week + current week
- [ ] Vigils track correctly across time zones
- [ ] 10+ Visions are unlockable across realistic first-30-days usage
- [ ] The scroll share generates a good-looking, shareable image
- [ ] Fake ads display at correct cadence for free users
- [ ] Paid tier successfully removes ads and unlocks Reckoning
- [ ] Data export works
- [ ] Account deletion works
- [ ] No regressions in Clinical tier (personality-off experience is clean)
- [ ] App passes App Store review

---

## 10. Open Questions

- Should the weekly Sunday ledger be gated behind a screenshot upload that week? (Leaning yes — it reinforces the ritual.)
- Should Reckoning tier require the user to type a confirmation phrase to unlock? (Leaning yes — *"I wish to see the full voice"* is in-character friction.)
- How do we handle users who never upload screenshots? (Leaning: daily confessions still work and generate readings; ledger section shows "the scroll is empty" until uploaded.)
- Pricing: $4.99/mo or $6.99/mo? (Benchmark against BePresent and ScreenZen actual current pricing before launch.)
