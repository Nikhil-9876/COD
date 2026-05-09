-- CloudCRM — Add LinkedIn Ads and Twitter/X Ads platform support
-- Run: psql $DATABASE_URL -f db/migrations/002_add_platforms.sql

BEGIN;

-- Add new platform enum values (safe no-op if already present)
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'linkedin_ads';
ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'twitter_ads';

ALTER TYPE campaign_platform ADD VALUE IF NOT EXISTS 'linkedin_ads';
ALTER TYPE campaign_platform ADD VALUE IF NOT EXISTS 'twitter_ads';

ALTER TYPE metric_source ADD VALUE IF NOT EXISTS 'linkedin_ads';
ALTER TYPE metric_source ADD VALUE IF NOT EXISTS 'twitter_ads';

COMMIT;

-- NOTE: ADD VALUE cannot run inside a transaction with other DDL in Postgres.
-- The unique constraint below is added in a separate transaction.

BEGIN;

-- Unique constraint on campaigns required for ON CONFLICT upsert during sync
-- external_id is the platform-native campaign ID (e.g. "111222333" for Google)
ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_client_platform_external_id_key
  UNIQUE (client_id, platform, external_id);

COMMIT;
