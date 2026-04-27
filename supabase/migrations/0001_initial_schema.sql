-- ============================================================
-- TruthTap V1 — Initial schema
-- Source: docs/04_TECHNICAL_ARCHITECTURE.md §2
--
-- Apply via Supabase Dashboard → SQL Editor → New query → paste → Run.
-- (Or via `supabase db push` once the CLI is configured.)
--
-- Idempotent: every CREATE uses IF NOT EXISTS so reruns are safe.
-- RLS policies are intentionally deferred to a follow-up migration
-- once Clerk JWT integration is wired (Week 2-3).
-- ============================================================

-- ============================================================
-- USERS
-- Auth managed by Clerk; we mirror minimal profile here.
-- id is the Clerk user_id (a string), not a UUID.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.users (
    id                    TEXT PRIMARY KEY,
    display_name          TEXT,
    goal_hours_per_day    NUMERIC(4, 2),
    tier_preference       INT NOT NULL DEFAULT 3 CHECK (tier_preference BETWEEN 1 AND 5),
    confession_time       TIME NOT NULL DEFAULT '21:00',
    timezone              TEXT NOT NULL DEFAULT 'America/Chicago',
    notifications_enabled BOOLEAN NOT NULL DEFAULT true,
    reckoning_unlocked    BOOLEAN NOT NULL DEFAULT false,
    paid_tier             BOOLEAN NOT NULL DEFAULT false,
    paid_tier_renews_at   TIMESTAMPTZ,
    affinity_score        INT NOT NULL DEFAULT 0,
    onboarding_completed_at TIMESTAMPTZ,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_paid_tier ON public.users(paid_tier) WHERE paid_tier = true;

-- ============================================================
-- SCREENSHOTS — uploaded weekly Screen Time captures
-- ============================================================
CREATE TABLE IF NOT EXISTS public.screenshots (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    storage_path        TEXT NOT NULL,
    upload_status       TEXT NOT NULL DEFAULT 'pending'
                          CHECK (upload_status IN ('pending', 'processing', 'complete', 'failed')),
    period_start        DATE,
    period_end          DATE,
    total_seconds       INT,
    total_pickups       INT,
    total_notifications INT,
    raw_extraction      JSONB,
    error_message       TEXT,
    uploaded_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at        TIMESTAMPTZ,
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_screenshots_user_period
    ON public.screenshots(user_id, period_start, period_end);

-- ============================================================
-- DAILY_USAGE — one row per user per day
-- Last write wins when a new screenshot covers an existing day.
-- ============================================================
CREATE TABLE IF NOT EXISTS public.daily_usage (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id              TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date                 DATE NOT NULL,
    total_seconds        INT NOT NULL,
    source_screenshot_id UUID REFERENCES public.screenshots(id) ON DELETE SET NULL,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_usage_user_date
    ON public.daily_usage(user_id, date DESC);

-- ============================================================
-- APP_USAGE — per-app breakdown per screenshot period
-- ============================================================
CREATE TABLE IF NOT EXISTS public.app_usage (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    screenshot_id UUID NOT NULL REFERENCES public.screenshots(id) ON DELETE CASCADE,
    app_name      TEXT NOT NULL,
    category      TEXT,
    total_seconds INT NOT NULL,
    period_start  DATE,
    period_end    DATE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_usage_user_app
    ON public.app_usage(user_id, app_name, period_start);

-- ============================================================
-- CONFESSIONS — daily mood + optional text
-- ============================================================
CREATE TABLE IF NOT EXISTS public.confessions (
    id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id               TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    date                  DATE NOT NULL,
    mood                  TEXT NOT NULL CHECK (mood IN ('great', 'mid', 'rough')),
    most_time_stolen_by   TEXT,
    tap_response_line_id  UUID,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS idx_confessions_user_date
    ON public.confessions(user_id, date DESC);

-- ============================================================
-- VIGILS — streaks (under_goal | daily_confession)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vigils (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vigil_type      TEXT NOT NULL CHECK (vigil_type IN ('under_goal', 'daily_confession')),
    started_on      DATE NOT NULL,
    ended_on        DATE,
    length_days     INT,
    milestones_hit  INT[] NOT NULL DEFAULT '{}',
    is_current      BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vigils_user_current
    ON public.vigils(user_id, is_current) WHERE is_current = true;

-- ============================================================
-- VISIONS — lore fragments (content table; rows seeded by admin)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.visions (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug             TEXT UNIQUE NOT NULL,
    title            TEXT NOT NULL,
    body             TEXT NOT NULL,
    unlock_condition JSONB NOT NULL,
    order_index      INT,
    is_paid_only     BOOLEAN NOT NULL DEFAULT false,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_visions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    vision_id   UUID NOT NULL REFERENCES public.visions(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, vision_id)
);

-- ============================================================
-- CALIBRATIONS — bonding mini-actions
-- ============================================================
CREATE TABLE IF NOT EXISTS public.calibrations (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action       TEXT NOT NULL,
    performed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    context      JSONB
);

CREATE INDEX IF NOT EXISTS idx_calibrations_user
    ON public.calibrations(user_id, performed_at DESC);

-- ============================================================
-- DIALOGUE_TEMPLATES — TAP's lines (the content pipeline)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dialogue_templates (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    surface        TEXT NOT NULL,
    tier           INT NOT NULL CHECK (tier BETWEEN 1 AND 5),
    body           TEXT NOT NULL,
    conditions     JSONB,
    active_from    TIMESTAMPTZ,
    active_until   TIMESTAMPTZ,
    is_active      BOOLEAN NOT NULL DEFAULT true,
    impressions    INT NOT NULL DEFAULT 0,
    last_served_at TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dialogue_surface_tier
    ON public.dialogue_templates(surface, tier, is_active);
CREATE INDEX IF NOT EXISTS idx_dialogue_active_window
    ON public.dialogue_templates(active_from, active_until)
    WHERE active_from IS NOT NULL;

-- ============================================================
-- DIALOGUE_SERVED — log for no-repeat logic + analytics
-- ============================================================
CREATE TABLE IF NOT EXISTS public.dialogue_served (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    template_id UUID NOT NULL REFERENCES public.dialogue_templates(id) ON DELETE CASCADE,
    surface     TEXT NOT NULL,
    served_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_dialogue_served_user_surface
    ON public.dialogue_served(user_id, surface, served_at DESC);

-- Wire the FK that confessions.tap_response_line_id needs.
-- Done after dialogue_templates exists to avoid ordering issues.
ALTER TABLE public.confessions
    DROP CONSTRAINT IF EXISTS confessions_tap_response_line_id_fkey;
ALTER TABLE public.confessions
    ADD CONSTRAINT confessions_tap_response_line_id_fkey
    FOREIGN KEY (tap_response_line_id)
    REFERENCES public.dialogue_templates(id) ON DELETE SET NULL;

-- ============================================================
-- SPONSORED_PROPHECIES — fake in-character ads
-- ============================================================
CREATE TABLE IF NOT EXISTS public.sponsored_prophecies (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    body         TEXT NOT NULL,
    tagline      TEXT,
    weight       INT NOT NULL DEFAULT 1,
    is_active    BOOLEAN NOT NULL DEFAULT true,
    active_from  TIMESTAMPTZ,
    active_until TIMESTAMPTZ,
    impressions  INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SHARED_SCROLLS — shareable weekly summary pages
-- ============================================================
CREATE TABLE IF NOT EXISTS public.shared_scrolls (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end   DATE NOT NULL,
    snapshot     JSONB NOT NULL,
    share_slug   TEXT UNIQUE NOT NULL,
    view_count   INT NOT NULL DEFAULT 0,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- updated_at triggers (keep edit timestamps fresh)
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON public.users;
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS dialogue_templates_updated_at ON public.dialogue_templates;
CREATE TRIGGER dialogue_templates_updated_at
    BEFORE UPDATE ON public.dialogue_templates
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- STORAGE — screenshots bucket (private)
-- The mobile app uploads here; the Worker downloads via service role.
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'screenshots',
    'screenshots',
    false,
    10485760, -- 10 MB
    ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/heic']
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- DONE.
-- Verify with:
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public' ORDER BY table_name;
-- Should return 12 tables.
-- ============================================================
