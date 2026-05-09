-- CloudCRM — Full Schema Migration
-- Run: psql $DATABASE_URL -f db/migrations/001_initial.sql

BEGIN;

-- ═══════════════════════════════════════════
-- ENUM TYPES
-- ═══════════════════════════════════════════

DO $$ BEGIN CREATE TYPE user_role AS ENUM ('agency_admin', 'manager', 'employee', 'client'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE onboarding_status AS ENUM ('pending', 'connected', 'active'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE platform_type AS ENUM ('google_ads', 'meta_ads', 'mailchimp'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE campaign_platform AS ENUM ('google_ads', 'meta_ads', 'mailchimp', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE campaign_status AS ENUM ('active', 'paused', 'completed'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE metric_source AS ENUM ('google_ads', 'meta_ads', 'mailchimp', 'manual'); EXCEPTION WHEN duplicate_object THEN null; END $$;
DO $$ BEGIN CREATE TYPE sync_status AS ENUM ('success', 'failed'); EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ═══════════════════════════════════════════
-- TABLES
-- ═══════════════════════════════════════════

CREATE TABLE clients (
  id                UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  name              VARCHAR(255)    NOT NULL,
  industry          VARCHAR(100),
  monthly_budget    NUMERIC(12, 2),
  onboarding_status onboarding_status NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ     NOT NULL DEFAULT now(),
  is_active         BOOLEAN         NOT NULL DEFAULT true
);

CREATE TABLE users (
  id                 UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
  email              VARCHAR(255)    UNIQUE NOT NULL,
  role               user_role       NOT NULL,
  client_id          UUID            REFERENCES clients(id) ON DELETE SET NULL,
  name               VARCHAR(255),
  keycloak_user_id   VARCHAR(255)    UNIQUE,
  created_at         TIMESTAMPTZ     NOT NULL DEFAULT now(),
  last_login         TIMESTAMPTZ,
  is_active          BOOLEAN         NOT NULL DEFAULT true
);

CREATE TABLE campaigns (
  id          UUID              PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id   UUID              NOT NULL REFERENCES clients(id),
  name        VARCHAR(255)      NOT NULL,
  platform    campaign_platform NOT NULL,
  external_id VARCHAR(255),
  status      campaign_status   NOT NULL DEFAULT 'active',
  budget      NUMERIC(12, 2),
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ       NOT NULL DEFAULT now()
);

CREATE TABLE campaign_metrics (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID          NOT NULL REFERENCES campaigns(id),
  client_id   UUID          NOT NULL REFERENCES clients(id),
  date        DATE          NOT NULL,
  spend       NUMERIC(12, 2),
  impressions INTEGER,
  clicks      INTEGER,
  leads       INTEGER,
  reach       INTEGER,
  conversions INTEGER,
  revenue     NUMERIC(12, 2),
  source      metric_source NOT NULL,
  synced_at   TIMESTAMPTZ,
  UNIQUE (campaign_id, date)
);

CREATE TABLE platform_credentials (
  id              UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id       UUID          NOT NULL REFERENCES clients(id),
  platform        platform_type NOT NULL,
  access_token    TEXT          NOT NULL,
  refresh_token   TEXT,
  token_expires_at TIMESTAMPTZ,
  account_id      VARCHAR(255),
  is_verified     BOOLEAN       NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
  UNIQUE (client_id, platform)
);

CREATE TABLE sync_logs (
  id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id      UUID          REFERENCES clients(id),
  platform       platform_type NOT NULL,
  status         sync_status   NOT NULL,
  records_synced INTEGER,
  error_message  TEXT,
  synced_at      TIMESTAMPTZ   NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════

CREATE INDEX idx_campaign_metrics_client_date    ON campaign_metrics (client_id, date DESC);
CREATE INDEX idx_campaign_metrics_campaign_date  ON campaign_metrics (campaign_id, date DESC);
CREATE INDEX idx_campaign_metrics_client_source  ON campaign_metrics (client_id, source);
CREATE INDEX idx_campaigns_client               ON campaigns (client_id);
CREATE INDEX idx_users_email                    ON users (email);
CREATE UNIQUE INDEX idx_users_keycloak_user_id_unique ON users (keycloak_user_id) WHERE keycloak_user_id IS NOT NULL;
CREATE INDEX idx_platform_creds_client          ON platform_credentials (client_id);

COMMIT;
