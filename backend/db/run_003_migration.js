/**
 * Run migration 003 — Add employee role + assignment table.
 *
 * Usage:  node db/run_003_migration.js
 *
 * This migration:
 *   1. Adds 'employee' value to the user_role enum
 *   2. Renames 'agency_admin' → 'admin' in the enum
 *   3. Creates the employee_client_assignments table
 */
import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function run() {
    const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    console.log('[migrate] Connected to database');

    try {
        const sql = fs.readFileSync(
            path.join(__dirname, 'migrations', '003_add_employee_role.sql'),
            'utf-8'
        );

        // Split on semicolons but respect BEGIN/COMMIT blocks
        // We execute the whole file as one batch — Postgres handles the
        // transaction blocks inside the SQL file.
        await client.query(sql);

        console.log('[migrate] ✅ Migration 003 completed successfully');

        // Verify: list current enum values
        const enumCheck = await client.query(
            `SELECT enumlabel FROM pg_enum WHERE enumtypid = 'user_role'::regtype ORDER BY enumsortorder`
        );
        console.log('[migrate] Current user_role enum values:', enumCheck.rows.map(r => r.enumlabel));

        // Verify: table exists
        const tableCheck = await client.query(
            `SELECT EXISTS (
                SELECT FROM information_schema.tables
                WHERE table_name = 'employee_client_assignments'
            ) AS table_exists`
        );
        console.log('[migrate] employee_client_assignments table exists:', tableCheck.rows[0].table_exists);
    } catch (err) {
        console.error('[migrate] ❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await client.end();
    }
}

run();
