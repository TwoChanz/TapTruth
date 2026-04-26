# TruthTap V1 — Technical Architecture

**Version:** 1.0
**Stack:** Expo + React Native (iOS-first) · Supabase · Clerk · Next.js (web companion) · Cloudflare Workers (edge functions for OCR)
**Owner:** Chandler / Six1Five Studio Dev

This doc pairs with 03_PRD_V1.md. Every architectural decision here serves a requirement there.

---

## 1. Stack Choices & Rationale

### Mobile: Expo + React Native + Expo Router

Same stack you used for Cage Picks. Familiar tooling, fastest path to ship. Expo Router handles the file-based navigation, which keeps screens tidy as the app grows.

**Why not native Swift?**
- Solo dev, limited time
- V2 eventually needs FamilyControls, which requires a native module *anyway* — but that's isolated to one module, not the whole app
- Expo's iOS build quality is good enough for the V1 surface area

### Web: Next.js 14 (App Router) on Vercel

For marketing site + shareable ledger pages + (later) an admin dashboard. Not a full app.

Share URL example: `truthtap.app/scroll/[scroll_id]` — pre-rendered shareable ledger image + lightweight page.

### Database & Auth: Supabase + Clerk

Same as Cage Picks. Supabase for Postgres + storage (screenshots) + realtime if needed. Clerk for auth because it has a cleaner React Native SDK than Supabase Auth.

### OCR / Vision: Cloudflare Workers + Claude Vision (Anthropic API)

Processing happens server-side:
1. Mobile app uploads screenshot to Supabase Storage
2. Storage webhook triggers Cloudflare Worker
3. Worker runs screenshot through Claude Vision (sonnet-4) with a structured extraction prompt
4. Worker writes extracted data back to Postgres
5. Mobile app sees new data via Supabase realtime subscription

**Why not Tesseract?** iOS Screen Time screenshots have a very specific visual structure. A vision model trained on screenshots will be more resilient to iOS UI changes than traditional OCR. Cost per screenshot at current Anthropic pricing is negligible at V1 scale. Fallback to Tesseract can be added later if API costs become an issue.

### Content Pipeline: Supabase Postgres + Admin Dashboard (Next.js)

All TAP dialogue lives in a `dialogue_templates` table, queried at runtime. Admin dashboard lets Chandler add lines without app updates. This is the most important architectural decision — it's what makes the product get better over time.

---

## 2. Database Schema (Postgres via Supabase)

```sql
-- ============================================================
-- Users (auth managed by Clerk; we mirror minimal profile)
-- ============================================================
CREATE TABLE users (
    id UUID PRIMARY KEY,                            -- Clerk user_id
    display_name TEXT,                              -- what TAP calls them
    goal_hours_per_day NUMERIC(4, 2),               -- e.g., 4.00
    tier_preference INT DEFAULT 3 CHECK (tier_preference BETWEEN 1 AND 5),
    confession_time TIME DEFAULT '21:00',
    timezone TEXT DEFAULT 'America/Chicago',
    notifications_enabled BOOLEAN DEFAULT true,
    reckoning_unlocked BOOLEAN DEFAULT false,
    paid_tier BOOLEAN DEFAULT false,
    paid_tier_renews_at TIMESTAMPTZ,
    affinity_score INT DEFAULT 0,                   -- hidden score gating Rogue Mode (V1.5)
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_users_paid_tier ON users(paid_tier) WHERE paid_tier = true;

-- ============================================================
-- Uploaded screenshots + extracted data
-- ============================================================
CREATE TABLE screenshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,                     -- supabase storage reference
    upload_status TEXT DEFAULT 'pending',           -- pending | processing | complete | failed
    period_start DATE,                              -- extracted date range start
    period_end DATE,
    total_seconds INT,                              -- total screen time for period
    total_pickups INT,
    total_notifications INT,
    raw_extraction JSONB,                           -- full vision model response for debugging
    error_message TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    processed_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ                          -- soft delete; user may choose to retain originals
);

CREATE INDEX idx_screenshots_user_period ON screenshots(user_id, period_start, period_end);

-- ============================================================
-- Per-day breakdown (one row per day covered by any screenshot)
-- ============================================================
CREATE TABLE daily_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_seconds INT NOT NULL,
    source_screenshot_id UUID REFERENCES screenshots(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date)                          -- last write wins when a new screenshot covers the same day
);

CREATE INDEX idx_daily_usage_user_date ON daily_usage(user_id, date DESC);

-- ============================================================
-- Per-app breakdown (one row per app per screenshot period)
-- ============================================================
CREATE TABLE app_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    screenshot_id UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
    app_name TEXT NOT NULL,
    category TEXT,                                  -- social, entertainment, productivity, etc.
    total_seconds INT NOT NULL,
    period_start DATE,
    period_end DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_app_usage_user_app ON app_usage(user_id, app_name, period_start);

-- ============================================================
-- Daily confessions
-- ============================================================
CREATE TABLE confessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    mood TEXT NOT NULL CHECK (mood IN ('great', 'mid', 'rough')),
    most_time_stolen_by TEXT,                       -- free text, user-supplied
    tap_response_line_id UUID,                      -- which line TAP served back
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, date)
);

CREATE INDEX idx_confessions_user_date ON confessions(user_id, date DESC);

-- ============================================================
-- Vigils (streaks)
-- ============================================================
CREATE TABLE vigils (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vigil_type TEXT NOT NULL CHECK (vigil_type IN ('under_goal', 'daily_confession')),
    started_on DATE NOT NULL,
    ended_on DATE,                                  -- null while vigil is active
    length_days INT,                                -- computed on close
    milestones_hit INT[] DEFAULT '{}',              -- e.g., {3, 7, 14}
    is_current BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vigils_user_current ON vigils(user_id, is_current) WHERE is_current = true;

-- ============================================================
-- Visions (lore fragments)
-- ============================================================
CREATE TABLE visions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,                      -- 'before_the_glass', 'first_tap', etc.
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    unlock_condition JSONB NOT NULL,                -- { "type": "vigil_milestone", "days": 7 } etc.
    order_index INT,
    is_paid_only BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_visions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vision_id UUID NOT NULL REFERENCES visions(id),
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, vision_id)
);

-- ============================================================
-- Calibrations (bonding actions)
-- ============================================================
CREATE TABLE calibrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,                           -- 'seal_the_ledger', 'speak_the_truth', etc.
    performed_at TIMESTAMPTZ DEFAULT NOW(),
    context JSONB                                   -- optional metadata (e.g., which scroll was sealed)
);

CREATE INDEX idx_calibrations_user ON calibrations(user_id, performed_at DESC);

-- ============================================================
-- Dialogue Templates (the content pipeline — the most important table)
-- ============================================================
CREATE TABLE dialogue_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surface TEXT NOT NULL,                          -- 'app_open' | 'weekly_reveal' | 'confession_great' | ...
    tier INT NOT NULL CHECK (tier BETWEEN 1 AND 5),
    body TEXT NOT NULL,                             -- with {{placeholders}} e.g., "{{name}}, the vigil ends at {{days}} days."
    conditions JSONB,                               -- optional: { "min_streak": 7, "worst_app": "Instagram" }
    active_from TIMESTAMPTZ,                        -- for topical lines
    active_until TIMESTAMPTZ,                       -- for topical lines
    is_active BOOLEAN DEFAULT true,
    impressions INT DEFAULT 0,
    last_served_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dialogue_surface_tier ON dialogue_templates(surface, tier, is_active);
CREATE INDEX idx_dialogue_active_window ON dialogue_templates(active_from, active_until) WHERE active_from IS NOT NULL;

-- ============================================================
-- Served dialogue log (for no-repeat logic + A/B testing)
-- ============================================================
CREATE TABLE dialogue_served (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES dialogue_templates(id),
    surface TEXT NOT NULL,
    served_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_dialogue_served_user_surface ON dialogue_served(user_id, surface, served_at DESC);

-- ============================================================
-- Fake Ads (Sponsored Prophecies)
-- ============================================================
CREATE TABLE sponsored_prophecies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    body TEXT NOT NULL,
    tagline TEXT,
    weight INT DEFAULT 1,                           -- for weighted random selection
    is_active BOOLEAN DEFAULT true,
    active_from TIMESTAMPTZ,
    active_until TIMESTAMPTZ,
    impressions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Shareable Scrolls
-- ============================================================
CREATE TABLE shared_scrolls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    snapshot JSONB NOT NULL,                        -- frozen data at time of share
    share_slug TEXT UNIQUE NOT NULL,                -- used in truthtap.app/scroll/{slug}
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row-Level Security (Supabase)

All user-scoped tables have RLS policies requiring `auth.uid() = user_id`. Content tables (`dialogue_templates`, `visions`, `sponsored_prophecies`) are read-only to regular users and mutable only from the admin dashboard using a service role key.

---

## 3. Dialogue Serving Logic

This is the heart of making TAP feel alive.

**When a surface needs a line:**

```typescript
async function serveDialogue(params: {
  userId: string;
  surface: string;           // e.g., 'weekly_reveal_over_goal'
  tier: number;              // user's current tier
  context: Record<string, unknown>;  // name, worst_app, streak_days, etc.
}): Promise<string> {
  // 1. Find candidate templates matching surface + tier (<= user's tier)
  //    We serve the highest-tier line the user qualifies for.
  const candidates = await db.query(`
    SELECT * FROM dialogue_templates
    WHERE surface = $1
      AND tier <= $2
      AND is_active = true
      AND (active_from IS NULL OR active_from <= NOW())
      AND (active_until IS NULL OR active_until > NOW())
  `, [params.surface, params.tier]);

  // 2. Filter by conditions (worst_app match, streak_days threshold, etc.)
  const eligible = candidates.filter(t => evaluateConditions(t.conditions, params.context));

  // 3. Exclude lines served to this user in the last N days for this surface
  const recentServed = await getRecentlyServed(params.userId, params.surface, 14);
  const fresh = eligible.filter(t => !recentServed.includes(t.id));

  // 4. If no fresh lines, fall back to eligible pool (prevents dead surfaces)
  const pool = fresh.length > 0 ? fresh : eligible;

  // 5. Weighted random selection favoring less-served lines
  const chosen = weightedRandomByImpressions(pool);

  // 6. Render placeholders ({{name}}, {{streak_days}}, etc.)
  const rendered = renderTemplate(chosen.body, params.context);

  // 7. Log the serve
  await logDialogueServed(params.userId, chosen.id, params.surface);
  await incrementImpressions(chosen.id);

  return rendered;
}
```

**Key properties:**
- A user never sees the same line twice in 14 days (per surface)
- Higher-tier users automatically see deeper content
- Topical lines (active_from / active_until) can be scheduled
- The system gracefully degrades when content is thin

---

## 4. Screenshot Processing Flow

```
┌─────────────┐
│ Mobile App  │
└──────┬──────┘
       │ 1. User picks screenshot
       │ 2. Upload to Supabase Storage
       ▼
┌──────────────────┐
│ Supabase Storage │
└──────┬───────────┘
       │ 3. Webhook fires
       ▼
┌──────────────────────┐
│ Cloudflare Worker    │
│ /process-screenshot  │
└──────┬───────────────┘
       │ 4. Fetch image, run through Claude Vision
       │    with structured extraction prompt
       ▼
┌──────────────────────┐
│ Anthropic API        │
│ claude-sonnet-4      │
└──────┬───────────────┘
       │ 5. Structured JSON response
       ▼
┌──────────────────────┐
│ Cloudflare Worker    │
│ - Validate           │
│ - Insert into DB     │
│ - Mark complete      │
└──────┬───────────────┘
       │ 6. Realtime event
       ▼
┌─────────────┐
│ Mobile App  │ — sees new data, TAP greets with updated reading
└─────────────┘
```

### Vision Model Extraction Prompt (sketch)

The prompt asks Claude Vision to return strict JSON. Example skeleton:

```
You are extracting data from an iOS Screen Time screenshot. Return ONLY valid JSON
matching this schema. Do not include commentary.

{
  "period_start": "YYYY-MM-DD",
  "period_end": "YYYY-MM-DD",
  "total_seconds": number,
  "total_pickups": number | null,
  "total_notifications": number | null,
  "daily_breakdown": [
    { "date": "YYYY-MM-DD", "total_seconds": number }
  ],
  "top_apps": [
    { "name": "string", "category": "string | null", "total_seconds": number }
  ],
  "confidence": "high" | "medium" | "low"
}

If the image is not a Screen Time screenshot or is unreadable, return:
{ "error": "not_screen_time" | "unreadable", "confidence": "low" }
```

### Fallback Strategy

- `confidence: low` → ask user to re-upload with a clearer screenshot
- API error → retry once, then notify user gracefully in-character
- Data completeness check: at minimum, we need period + total + daily_breakdown to accept the upload

---

## 5. Mobile App Structure (Expo Router)

```
app/
├── (auth)/
│   ├── sign-in.tsx
│   ├── sign-up.tsx
│   └── _layout.tsx
├── (onboarding)/
│   ├── awaken.tsx                  // TAP fades in, first words
│   ├── name.tsx
│   ├── goal.tsx
│   ├── screenshot-tutorial.tsx
│   ├── first-upload.tsx
│   ├── tier.tsx
│   ├── first-confession.tsx
│   └── _layout.tsx
├── (tabs)/
│   ├── ledger/
│   │   ├── index.tsx               // Home — today's ledger
│   │   ├── week.tsx                // Weekly view
│   │   └── [date].tsx              // Specific day detail
│   ├── visions/
│   │   └── index.tsx               // Unlocked lore
│   ├── calibration/
│   │   └── index.tsx               // Settings
│   └── _layout.tsx
├── scroll-share/[id].tsx           // Local share-image generator
├── upload.tsx                      // Screenshot upload modal
├── confession.tsx                  // Today's confession modal
├── paywall.tsx                     // Unfiltered upgrade
├── _layout.tsx                     // Root layout, Clerk + theme
└── index.tsx                       // Router/auth gate

components/
├── glyph/
│   ├── TapGlyph.tsx                // The pulsing glyph (reusable)
│   └── GlyphMoods.ts               // State → animation preset
├── ledger/
│   ├── LedgerHeader.tsx
│   ├── TodayReading.tsx            // TAP's today line
│   ├── ConfessionCard.tsx
│   ├── WeekChart.tsx
│   ├── WeekSummary.tsx
│   ├── PatternNotices.tsx
│   └── VigilStatus.tsx
├── sponsored/
│   └── SponsoredProphecy.tsx
├── ui/
│   ├── RitualButton.tsx            // Our button primitive
│   ├── TabularNumber.tsx           // Reverent number rendering
│   └── RitualText.tsx              // Serif prophecy text

lib/
├── dialogue/
│   ├── serve.ts                    // Client-side dialogue fetcher
│   ├── render.ts                   // Placeholder rendering
│   └── cache.ts                    // Local cache for offline
├── data/
│   ├── screenshots.ts
│   ├── confessions.ts
│   ├── vigils.ts
│   └── usage.ts
├── supabase.ts
└── clerk.ts

theme/
├── colors.ts
├── typography.ts
└── tokens.ts
```

---

## 6. Content Pipeline — Admin Dashboard

A lightweight Next.js dashboard at `admin.truthtap.app` (behind Clerk admin gate):

- Add / edit / deactivate dialogue templates
- Preview rendered output with sample context
- View impression counts per line
- Schedule topical lines (active_from / active_until)
- Bulk import CSV of new lines
- View served dialogue logs for debugging
- Add / edit sponsored prophecies
- Add / edit Visions
- Trigger content pushes (no-op in V1 since reads are DB-direct)

This is the single most important tool you'll build. Budget a full week of dev time for it. Without it, the content-pipeline-as-product thesis falls apart.

---

## 7. Push Notifications (Expo Notifications)

- Daily confession reminder (user-chosen time, in-character copy)
- Sunday morning weekly ledger reveal nudge
- No other scheduled notifications at V1
- No upsell notifications ever
- All notification copy passes through dialogue pipeline (so it's tier-aware)

---

## 8. Security & Privacy

- Clerk JWT → Supabase RLS for all authenticated requests
- Screenshots live in a private Storage bucket; signed URLs only
- Raw screenshots auto-deleted 7 days after processing unless user opts in to retain
- PII: only display name, timezone. No email shown in app; Clerk owns account email.
- Deleted accounts trigger cascade delete across all tables
- Anthropic API key lives only in the Cloudflare Worker env — never exposed to client

---

## 9. Observability & Monitoring

- **PostHog** for product analytics (conversion funnels, retention cohorts, surface engagement)
- **Sentry** for crash reporting on mobile + web
- **Supabase logs** for DB slow queries
- **Cloudflare Analytics** for edge function performance
- Dialogue impression tracking is built-in (dialogue_served table doubles as analytics)

---

## 10. Cost Estimates (V1, first 1K users)

| Service | Monthly estimate |
|---|---|
| Supabase Pro | $25 |
| Clerk | $0 (first 10K MAU free) |
| Cloudflare Workers | ~$5 |
| Anthropic API (~5 screenshots/user/month × 1K = 5K calls) | ~$30–50 |
| Vercel (marketing + admin) | $0 (hobby tier) |
| Expo EAS | $0–$19 |
| Apple Developer | $99/yr = ~$8/mo |
| **Total** | **~$75–110/mo** |

Very sustainable at solo-dev scale. OCR cost is the only variable with real user-scale growth risk; Tesseract fallback option mitigates this at ~10K+ users.

---

## 11. Known Technical Risks

| Risk | Mitigation |
|---|---|
| Vision model misreads screenshot | `confidence: low` triggers re-upload request; raw_extraction stored for debugging |
| iOS Screen Time UI changes break extraction | Vision model is more resilient than OCR; prompt updatable without app release |
| Realtime subscription drops | Polling fallback every 30s while screenshot is processing |
| Dialogue pipeline runs dry (not enough lines) | Graceful fallback pool; impression tracking surfaces dry surfaces |
| Admin dashboard becomes a bottleneck | CSV bulk import; content-creation time-blocked weekly |
| Expo OTA limits complex native changes | V2 FamilyControls work will require a native module + real EAS build |
| Cost spike from screenshot abuse | Rate limit: 5 uploads/user/day at free tier, 20/day at paid |

---

## 12. Build Order (Suggested)

1. **Week 1:** Repo setup, Clerk + Supabase auth, base theme + glyph component, navigation skeleton
2. **Week 2:** Onboarding flow end-to-end (all screens, in-character copy for default tier)
3. **Week 3:** Screenshot upload + Cloudflare Worker + Claude Vision integration
4. **Week 4:** Ledger home screen + weekly ledger view + confession flow
5. **Week 5:** Dialogue serving logic + initial 200-line content library + tier switching
6. **Week 6:** Vigils + Visions + Calibrations + share scroll generator
7. **Week 7:** Paywall + fake ads + admin dashboard MVP
8. **Week 8:** Polish, App Store assets, TestFlight beta with 10 users
9. **Week 9:** Content expansion (500+ lines by launch), voice polish based on beta feedback
10. **Week 10:** App Store submission + launch prep

Solo dev, plus-minus a week on most items. This is aggressive but doable given you've shipped Cage Picks on the same stack.
