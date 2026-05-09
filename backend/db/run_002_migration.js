import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: join(dirname(fileURLToPath(import.meta.url)), '..', '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const enumSQL = [
    `ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'linkedin_ads';`,
    `ALTER TYPE platform_type ADD VALUE IF NOT EXISTS 'twitter_ads';`,
    `ALTER TYPE campaign_platform ADD VALUE IF NOT EXISTS 'linkedin_ads';`,
    `ALTER TYPE campaign_platform ADD VALUE IF NOT EXISTS 'twitter_ads';`,
    `ALTER TYPE metric_source ADD VALUE IF NOT EXISTS 'linkedin_ads';`,
    `ALTER TYPE metric_source ADD VALUE IF NOT EXISTS 'twitter_ads';`
];

const constraintSQL = `
  ALTER TABLE campaigns
    ADD CONSTRAINT campaigns_client_platform_external_id_key
    UNIQUE (client_id, platform, external_id);
`;

async function main() {
    try {
        console.log('Connecting to database...');
        for (const stmt of enumSQL) {
            try {
                await pool.query(stmt);
                console.log(`✅ ${stmt}`);
            } catch (err) {
                console.log(`⚠️ ${stmt} (might already exist: ${err.message})`);
            }
        }

        try {
            await pool.query(constraintSQL);
            console.log('✅ Unique constraint added to campaigns table');
        } catch (err) {
            console.log(`⚠️ Unique constraint warning: ${err.message}`);
        }

    } catch (err) {
        console.error('❌ Migration failed:', err);
    } finally {
        await pool.end();
        console.log('Database connection closed.');
    }
}

main();
