/**
 * Twitter/X Ads Mock Data
 * Matches Twitter Ads API v12 exactly
 * - Short alphanumeric IDs, ISO 8601 with Z suffix
 * - Budget micros as integers, metric values as arrays of strings
 * - Wrapper: { data: [...], total_count, request: { params } }
 */

const accounts = [
    { id: 'abc123', name: 'Acme Corp Twitter' },
    { id: 'def456', name: 'TechStart X Ads' },
    { id: 'ghi789', name: 'Global Retail Twitter' }
];

const campaigns = [
    // Account abc123
    {
        id: 'k3nd2', name: 'App Install - iOS Q4', account_id: 'abc123',
        funding_instrument_id: 'fin001', start_time: '2024-10-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z',
        daily_budget_amount_local_micro: 50000000, total_budget_amount_local_micro: 1500000000,
        entity_status: 'ACTIVE', servable: true, reasons_not_servable: [], currency: 'USD',
        standard_delivery: true, duration_in_days: null, frequency_cap: null,
        created_at: '2024-09-28T12:00:00Z', updated_at: '2024-10-01T00:00:00Z', deleted: false
    },
    {
        id: 'j4mf8', name: 'Brand Awareness Video', account_id: 'abc123',
        funding_instrument_id: 'fin001', start_time: '2024-11-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z',
        daily_budget_amount_local_micro: 75000000, total_budget_amount_local_micro: 2250000000,
        entity_status: 'ACTIVE', servable: true, reasons_not_servable: [], currency: 'USD',
        standard_delivery: true, duration_in_days: null, frequency_cap: null,
        created_at: '2024-10-28T10:00:00Z', updated_at: '2024-11-01T00:00:00Z', deleted: false
    },
    // Account def456
    {
        id: 'p7qr3', name: 'Website Traffic Drive', account_id: 'def456',
        funding_instrument_id: 'fin002', start_time: '2024-10-15T00:00:00Z', end_time: '2025-01-15T23:59:59Z',
        daily_budget_amount_local_micro: 30000000, total_budget_amount_local_micro: 900000000,
        entity_status: 'ACTIVE', servable: true, reasons_not_servable: [], currency: 'USD',
        standard_delivery: true, duration_in_days: null, frequency_cap: null,
        created_at: '2024-10-12T14:00:00Z', updated_at: '2024-10-15T00:00:00Z', deleted: false
    },
    {
        id: 's9tu5', name: 'Engagement Boost', account_id: 'def456',
        funding_instrument_id: 'fin002', start_time: '2024-09-01T00:00:00Z', end_time: '2024-11-30T23:59:59Z',
        daily_budget_amount_local_micro: 20000000, total_budget_amount_local_micro: 600000000,
        entity_status: 'PAUSED', servable: false, reasons_not_servable: ['PAUSED_BY_ADVERTISER'], currency: 'USD',
        standard_delivery: true, duration_in_days: null, frequency_cap: null,
        created_at: '2024-08-28T09:00:00Z', updated_at: '2024-10-15T08:00:00Z', deleted: false
    },
    // Account ghi789
    {
        id: 'v2wx6', name: 'Holiday Promo Tweets', account_id: 'ghi789',
        funding_instrument_id: 'fin003', start_time: '2024-11-15T00:00:00Z', end_time: '2024-12-31T23:59:59Z',
        daily_budget_amount_local_micro: 100000000, total_budget_amount_local_micro: 4500000000,
        entity_status: 'ACTIVE', servable: true, reasons_not_servable: [], currency: 'USD',
        standard_delivery: true, duration_in_days: null, frequency_cap: null,
        created_at: '2024-11-12T11:00:00Z', updated_at: '2024-11-15T00:00:00Z', deleted: false
    },
    {
        id: 'y8za1', name: 'Follower Growth Campaign', account_id: 'ghi789',
        funding_instrument_id: 'fin003', start_time: '2024-10-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z',
        daily_budget_amount_local_micro: 25000000, total_budget_amount_local_micro: 750000000,
        entity_status: 'ACTIVE', servable: true, reasons_not_servable: [], currency: 'USD',
        standard_delivery: false, duration_in_days: null, frequency_cap: null,
        created_at: '2024-09-28T15:00:00Z', updated_at: '2024-10-01T00:00:00Z', deleted: false
    }
];

const lineItems = [
    { id: 'li001', campaign_id: 'k3nd2', account_id: 'abc123', name: 'iOS - Broad Audience', product_type: 'PROMOTED_TWEETS', placements: ['ALL_ON_TWITTER'], bid_amount_local_micro: 2500000, automatically_select_bid: false, optimization: 'APP_INSTALLS', objective: 'APP_INSTALLS', charge_by: 'APP_CLICK', entity_status: 'ACTIVE', start_time: '2024-10-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z', created_at: '2024-09-28T12:05:00Z', updated_at: '2024-10-01T00:00:00Z', deleted: false },
    { id: 'li002', campaign_id: 'k3nd2', account_id: 'abc123', name: 'iOS - Lookalike', product_type: 'PROMOTED_TWEETS', placements: ['ALL_ON_TWITTER'], bid_amount_local_micro: 3000000, automatically_select_bid: false, optimization: 'APP_INSTALLS', objective: 'APP_INSTALLS', charge_by: 'APP_CLICK', entity_status: 'ACTIVE', start_time: '2024-10-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z', created_at: '2024-09-28T12:10:00Z', updated_at: '2024-10-01T00:00:00Z', deleted: false },
    { id: 'li003', campaign_id: 'p7qr3', account_id: 'def456', name: 'Website Clicks - Tech', product_type: 'PROMOTED_TWEETS', placements: ['ALL_ON_TWITTER'], bid_amount_local_micro: 1500000, automatically_select_bid: false, optimization: 'WEBSITE_CLICKS', objective: 'WEBSITE_CLICKS', charge_by: 'LINK_CLICK', entity_status: 'ACTIVE', start_time: '2024-10-15T00:00:00Z', end_time: '2025-01-15T23:59:59Z', created_at: '2024-10-12T14:10:00Z', updated_at: '2024-10-15T00:00:00Z', deleted: false },
    { id: 'li004', campaign_id: 'v2wx6', account_id: 'ghi789', name: 'Holiday - Broad', product_type: 'PROMOTED_TWEETS', placements: ['ALL_ON_TWITTER'], bid_amount_local_micro: 4000000, automatically_select_bid: false, optimization: 'ENGAGEMENTS', objective: 'ENGAGEMENTS', charge_by: 'ENGAGEMENT', entity_status: 'ACTIVE', start_time: '2024-11-15T00:00:00Z', end_time: '2024-12-31T23:59:59Z', created_at: '2024-11-12T11:05:00Z', updated_at: '2024-11-15T00:00:00Z', deleted: false },
    { id: 'li005', campaign_id: 'y8za1', account_id: 'ghi789', name: 'Followers - Interest', product_type: 'PROMOTED_ACCOUNT', placements: ['ALL_ON_TWITTER'], bid_amount_local_micro: 2000000, automatically_select_bid: true, optimization: 'FOLLOWERS', objective: 'FOLLOWERS', charge_by: 'FOLLOW', entity_status: 'ACTIVE', start_time: '2024-10-01T00:00:00Z', end_time: '2024-12-31T23:59:59Z', created_at: '2024-09-28T15:05:00Z', updated_at: '2024-10-01T00:00:00Z', deleted: false }
];

function generateStats(campaign) {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const imp = Math.floor(8000 + Math.random() * 10000);
        const cl = Math.floor(imp * (0.02 + Math.random() * 0.02));
        const spend = Math.floor(cl * (1200000 + Math.random() * 2000000));
        const appClicks = Math.floor(cl * 0.85);
        const installs = Math.floor(appClicks * (0.25 + Math.random() * 0.1));
        days.push({
            impressions: [String(imp)], clicks: [String(cl)], spend: [String(spend)],
            conversions: [null], app_clicks: [String(appClicks)], installs: [String(installs)],
            cpm: [String(Math.floor(spend / imp * 1000))],
            cpc: [String(Math.floor(spend / cl))],
            ctr: [(cl / imp).toFixed(5)]
        });
    }
    return { id: campaign.id, id_data: [{ segment: null, metrics: { impressions: days.map(d => d.impressions[0]), clicks: days.map(d => d.clicks[0]), spend: days.map(d => d.spend[0]), conversions: days.map(d => null), app_clicks: days.map(d => d.app_clicks[0]), installs: days.map(d => d.installs[0]), cpm: days.map(d => d.cpm[0]), cpc: days.map(d => d.cpc[0]), ctr: days.map(d => d.ctr[0]) } }] };
}

const statsData = {};
campaigns.forEach(c => {
    if (!statsData[c.account_id]) statsData[c.account_id] = [];
    statsData[c.account_id].push(generateStats(c));
});

const errorResponse = {
    errors: [{ code: 32, message: 'Could not authenticate you.', label: 'AUTHENTICATION_ERROR' }],
    request: { params: { account_id: 'abc123' } }
};

function wrapResponse(data, params = {}) {
    return { data, total_count: data.length, request: { params } };
}

module.exports = { accounts, campaigns, lineItems, statsData, errorResponse, wrapResponse };
