BEGIN;

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS keycloak_user_id VARCHAR(255);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_keycloak_user_id_unique
    ON users (keycloak_user_id)
    WHERE keycloak_user_id IS NOT NULL;

COMMIT;
