import { query, getClient } from '../services/db.js';
import { metricsQuerySchema, CSV_REQUIRED_HEADERS } from '../validators/metrics.js';
import { readFileSync, unlinkSync } from 'fs';

// ─── GET /api/metrics ───────────────────────────────────────
export async function getMetrics(req, res) {
    const parsed = metricsQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid query parameters' });

    const clientId = req.scopedClientId || parsed.data.client_id;
    if (!clientId) return res.status(400).json({ error: 'client_id is required' });

    const from = parsed.data.from || '1970-01-01';
    const to = parsed.data.to || '2099-12-31';

    const conditions = ['client_id = $1', 'date >= $2', 'date <= $3'];
    const values = [clientId, from, to];
    let i = 4;

    if (parsed.data.platform) {
        conditions.push(`source = $${i}`);
        values.push(parsed.data.platform);
        i++;
    }

    const result = await query(
        `SELECT
       COALESCE(SUM(spend), 0) AS total_spend,
       COALESCE(SUM(impressions), 0) AS total_impressions,
       COALESCE(SUM(clicks), 0) AS total_clicks,
       COALESCE(SUM(leads), 0) AS total_leads,
       COALESCE(SUM(reach), 0) AS total_reach,
       COALESCE(SUM(conversions), 0) AS total_conversions,
       COALESCE(SUM(revenue), 0) AS total_revenue,
       COUNT(*) AS record_count
     FROM campaign_metrics
     WHERE ${conditions.join(' AND ')}`,
        values
    );

    return res.json(result.rows[0]);
}

// ─── POST /api/metrics/upload ───────────────────────────────
export async function uploadMetrics(req, res) {
    if (!req.file) return res.status(400).json({ error: 'CSV file is required' });

    let csvContent;
    try {
        csvContent = readFileSync(req.file.path, 'utf-8');
    } finally {
        // Clean up temp file
        try { unlinkSync(req.file.path); } catch { /* ignore */ }
    }

    const lines = csvContent.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length < 2) return res.status(400).json({ error: 'CSV must have headers and at least one data row' });

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());

    // Validate required headers
    const missing = CSV_REQUIRED_HEADERS.filter(h => !headers.includes(h));
    if (missing.length > 0) {
        return res.status(400).json({ error: `Missing CSV headers: ${missing.join(', ')}` });
    }

    const colIndex = {};
    headers.forEach((h, idx) => { colIndex[h] = idx; });

    const dbClient = await getClient();
    let insertedCount = 0;

    try {
        await dbClient.query('BEGIN');

        for (let row = 1; row < lines.length; row++) {
            const cols = lines[row].split(',').map(c => c.trim());
            if (cols.length < headers.length) continue;

            const campaignId = cols[colIndex['campaign_id']];
            const date = cols[colIndex['date']];
            const spend = parseFloat(cols[colIndex['spend']]) || 0;
            const impressions = parseInt(cols[colIndex['impressions']]) || 0;
            const clicks = parseInt(cols[colIndex['clicks']]) || 0;
            const leads = parseInt(cols[colIndex['leads']]) || 0;
            const reach = colIndex['reach'] !== undefined ? parseInt(cols[colIndex['reach']]) || 0 : 0;
            const conversions = colIndex['conversions'] !== undefined ? parseInt(cols[colIndex['conversions']]) || 0 : 0;
            const revenue = colIndex['revenue'] !== undefined ? parseFloat(cols[colIndex['revenue']]) || 0 : 0;

            // Look up campaign to get client_id
            const campResult = await dbClient.query(
                `SELECT client_id FROM campaigns WHERE id = $1`, [campaignId]
            );
            if (campResult.rows.length === 0) continue;

            const clientId = campResult.rows[0].client_id;

            await dbClient.query(
                `INSERT INTO campaign_metrics (campaign_id, client_id, date, spend, impressions, clicks, leads, reach, conversions, revenue, source, synced_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'manual', now())
         ON CONFLICT (campaign_id, date) DO UPDATE SET
           spend = EXCLUDED.spend, impressions = EXCLUDED.impressions, clicks = EXCLUDED.clicks,
           leads = EXCLUDED.leads, reach = EXCLUDED.reach, conversions = EXCLUDED.conversions,
           revenue = EXCLUDED.revenue, synced_at = now()`,
                [campaignId, clientId, date, spend, impressions, clicks, leads, reach, conversions, revenue]
            );
            insertedCount++;
        }

        await dbClient.query('COMMIT');
    } catch (err) {
        await dbClient.query('ROLLBACK');
        throw err;
    } finally {
        dbClient.release();
    }

    return res.json({ message: `${insertedCount} metric records imported`, records: insertedCount });
}
