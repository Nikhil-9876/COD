import { query } from '../services/db.js';
import { createCampaignSchema, updateCampaignSchema, campaignQuerySchema } from '../validators/campaigns.js';
import { uuidParamSchema } from '../validators/clients.js';

// ─── GET /api/campaigns ─────────────────────────────────────
export async function listCampaigns(req, res) {
    const parsed = campaignQuerySchema.safeParse(req.query);
    if (!parsed.success) return res.status(400).json({ error: 'Invalid query parameters' });

    const clientId = req.scopedClientId || parsed.data.client_id;
    const conditions = ['c.client_id IS NOT NULL'];
    const values = [];
    let i = 1;

    if (clientId) {
        conditions.push(`c.client_id = $${i}`);
        values.push(clientId);
        i++;
    }
    if (parsed.data.platform) {
        conditions.push(`c.platform = $${i}`);
        values.push(parsed.data.platform);
        i++;
    }
    if (parsed.data.status) {
        conditions.push(`c.status = $${i}`);
        values.push(parsed.data.status);
        i++;
    }
    if (parsed.data.from) {
        conditions.push(`c.start_date >= $${i}`);
        values.push(parsed.data.from);
        i++;
    }
    if (parsed.data.to) {
        conditions.push(`c.end_date <= $${i}`);
        values.push(parsed.data.to);
        i++;
    }

    const result = await query(
        `SELECT c.id, c.client_id, c.name, c.platform, c.external_id, c.status,
            c.budget, c.start_date, c.end_date, c.created_at,
            cl.name AS client_name,
            COALESCE(SUM(cm.spend), 0) AS total_spend,
            COALESCE(SUM(cm.leads), 0) AS total_leads,
            COALESCE(SUM(cm.clicks), 0) AS total_clicks
     FROM campaigns c
     JOIN clients cl ON cl.id = c.client_id AND cl.is_active = true
     LEFT JOIN campaign_metrics cm ON cm.campaign_id = c.id
     WHERE ${conditions.join(' AND ')}
     GROUP BY c.id, cl.name
     ORDER BY c.created_at DESC`,
        values
    );

    return res.json({ campaigns: result.rows });
}

// ─── GET /api/campaigns/:id ─────────────────────────────────
export async function getCampaign(req, res) {
    const idParsed = uuidParamSchema.safeParse(req.params.id);
    if (!idParsed.success) return res.status(400).json({ error: 'Invalid campaign ID' });

    const result = await query(
        `SELECT c.*, cl.name AS client_name
     FROM campaigns c
     JOIN clients cl ON cl.id = c.client_id
     WHERE c.id = $1`,
        [idParsed.data]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });

    const campaign = result.rows[0];

    // Enforce client_id scoping
    if (req.user.role === 'client' && campaign.client_id !== req.user.client_id) {
        return res.status(403).json({ error: 'Access denied' });
    }

    const metrics = await query(
        `SELECT date, spend, impressions, clicks, leads, reach, conversions, revenue, source, synced_at
     FROM campaign_metrics WHERE campaign_id = $1 ORDER BY date DESC`,
        [idParsed.data]
    );

    return res.json({ campaign, metrics: metrics.rows });
}

// ─── POST /api/campaigns ────────────────────────────────────
export async function createCampaign(req, res) {
    const parsed = createCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors });
    }

    const { client_id, name, platform, external_id, status, budget, start_date, end_date } = parsed.data;

    // Verify client exists
    const clientCheck = await query(`SELECT id FROM clients WHERE id = $1 AND is_active = true`, [client_id]);
    if (clientCheck.rows.length === 0) return res.status(404).json({ error: 'Client not found' });

    const result = await query(
        `INSERT INTO campaigns (client_id, name, platform, external_id, status, budget, start_date, end_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
        [client_id, name, platform, external_id || null, status, budget || null, start_date || null, end_date || null]
    );

    return res.status(201).json({ campaign: result.rows[0] });
}

// ─── PATCH /api/campaigns/:id ───────────────────────────────
export async function updateCampaign(req, res) {
    const idParsed = uuidParamSchema.safeParse(req.params.id);
    if (!idParsed.success) return res.status(400).json({ error: 'Invalid campaign ID' });

    const parsed = updateCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors });
    }

    const fields = [];
    const values = [];
    let i = 1;

    for (const [key, value] of Object.entries(parsed.data)) {
        fields.push(`${key} = $${i}`);
        values.push(value);
        i++;
    }

    if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

    values.push(idParsed.data);
    const result = await query(
        `UPDATE campaigns SET ${fields.join(', ')} WHERE id = $${i} RETURNING *`,
        values
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Campaign not found' });
    return res.json({ campaign: result.rows[0] });
}
