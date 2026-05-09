BEGIN;

DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS refresh_tokens;

DROP INDEX IF EXISTS idx_users_auth_provider;

ALTER TABLE users
    DROP COLUMN IF EXISTS auth_provider,
    DROP COLUMN IF EXISTS password_hash,
    DROP COLUMN IF EXISTS temp_password_hash,
    DROP COLUMN IF EXISTS is_first_login;

COMMIT;
