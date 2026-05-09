import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
    const sql = readFileSync(
        join(dirname(fileURLToPath(import.meta.url)), 'migrations', '001_initial.sql'),
        'utf-8'
    );
    try {
        await pool.query(sql);
        console.log('✅ Migration completed successfully');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

migrate();
