-- CloudCRM — Add employee role + client assignment system
-- Run: node db/run_003_migration.js

-- ═══════════════════════════════════════════
-- Step 1: Add 'employee' to user_role enum
-- ═══════════════════════════════════════════
-- NOTE: ADD VALUE cannot run inside a transaction block in Postgres.
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'employee';

-- ═══════════════════════════════════════════
-- Step 2: Create employee ↔ client assignment table
-- ═══════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS employee_client_assignments (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  client_id   UUID        NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by UUID        REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE (employee_id, client_id)
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_eca_employee   ON employee_client_assignments (employee_id);
CREATE INDEX IF NOT EXISTS idx_eca_client     ON employee_client_assignments (client_id);
CREATE INDEX IF NOT EXISTS idx_eca_assigned_by ON employee_client_assignments (assigned_by);

COMMIT;
