import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { Pool } = require('pg');
import { encrypt } from '../src/services/encryption.js';
import dotenv from 'dotenv';

dotenv.config({ path: '/home/nikhil/Desktop/COD/backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const ACME = '99f3bf29-5644-47e4-9855-28d9dca2e795';
const BETA = '6fc4c392-7756-4695-bdf6-1f783dfd752a';

const creds = [
  // Acme Corp
  [ACME, 'google_ads', encrypt('mock_google_access_token_abc123'), '1234567890'],
  [ACME, 'meta_ads', encrypt('mock_meta_access_token_def456'), 'act_987654321'],
  [ACME, 'linkedin_ads', encrypt('mock_linkedin_access_token_ghi789'), 'urn:li:sponsoredAccount:789012'],
  [ACME, 'twitter_ads', encrypt('mock_twitter_access_token_jkl012'), 'abc123'],
  // Beta Inc
  [BETA, 'google_ads', encrypt('mock_google_access_token_abc123'), '2345678901'],
  [BETA, 'meta_ads', encrypt('mock_meta_access_token_def456'), 'act_876543210'],
  [BETA, 'linkedin_ads', encrypt('mock_linkedin_access_token_ghi789'), 'urn:li:sponsoredAccount:890123'],
  [BETA, 'twitter_ads', encrypt('mock_twitter_access_token_jkl012'), 'def456']
];

async function seed() {
  for (const [clientId, platform, token, accountId] of creds) {
    await pool.query(
      `INSERT INTO platform_credentials (client_id, platform, access_token, account_id, is_verified) 
       VALUES ($1, $2, $3, $4, true)`,
      [clientId, platform, token, accountId]
    );
  }
  console.log('Credentials seeded successfully.');
  pool.end();
}

seed();
