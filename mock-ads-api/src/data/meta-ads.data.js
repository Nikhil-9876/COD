/**
 * Meta Ads (Facebook/Instagram) Mock Data
 * Matches Meta Marketing API v21.0 response structures exactly
 * - Numeric string IDs
 * - Budget values in cents (strings)
 * - ISO 8601 timestamps with timezone offset
 * - All list responses wrapped in { data: [...], paging: { cursors: {...} } }
 */

const accounts = [
    { id: 'act_987654321', name: 'Acme Corp Ad Account' },
    { id: 'act_876543210', name: 'TechStart Marketing' },
    { id: 'act_765432109', name: 'Global Retail Ads' }
];

const campaigns = [
    // Account 1 - Acme Corp
    {
        id: '23456789012345',
        name: 'Q4 Lead Generation',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        objective: 'OUTCOME_LEADS',
        daily_budget: '5000',
        lifetime_budget: '0',
        budget_remaining: '3200',
        start_time: '2024-10-01T00:00:00+0000',
        stop_time: '2024-12-31T23:59:59+0000',
        created_time: '2024-09-25T14:22:00+0000',
        updated_time: '2024-10-05T09:11:00+0000',
        account_id: 'act_987654321',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        special_ad_categories: []
    },
    {
        id: '23456789012346',
        name: 'Holiday Retargeting',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        objective: 'OUTCOME_SALES',
        daily_budget: '8000',
        lifetime_budget: '0',
        budget_remaining: '5600',
        start_time: '2024-11-15T00:00:00+0000',
        stop_time: '2024-12-31T23:59:59+0000',
        created_time: '2024-11-10T10:00:00+0000',
        updated_time: '2024-11-16T08:30:00+0000',
        account_id: 'act_987654321',
        bid_strategy: 'LOWEST_COST_WITH_BID_CAP',
        special_ad_categories: []
    },
    {
        id: '23456789012347',
        name: 'Brand Video Reach',
        status: 'PAUSED',
        effective_status: 'PAUSED',
        objective: 'OUTCOME_AWARENESS',
        daily_budget: '10000',
        lifetime_budget: '0',
        budget_remaining: '7500',
        start_time: '2024-09-01T00:00:00+0000',
        stop_time: '2024-10-31T23:59:59+0000',
        created_time: '2024-08-28T16:45:00+0000',
        updated_time: '2024-10-02T12:00:00+0000',
        account_id: 'act_987654321',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        special_ad_categories: []
    },
    // Account 2 - TechStart Marketing
    {
        id: '34567890123456',
        name: 'App Install Campaign',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        objective: 'OUTCOME_APP_PROMOTION',
        daily_budget: '15000',
        lifetime_budget: '0',
        budget_remaining: '10200',
        start_time: '2024-10-15T00:00:00+0000',
        stop_time: '2025-01-15T23:59:59+0000',
        created_time: '2024-10-12T09:00:00+0000',
        updated_time: '2024-10-16T11:20:00+0000',
        account_id: 'act_876543210',
        bid_strategy: 'COST_CAP',
        special_ad_categories: []
    },
    {
        id: '34567890123457',
        name: 'Webinar Signups',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        objective: 'OUTCOME_LEADS',
        daily_budget: '3000',
        lifetime_budget: '0',
        budget_remaining: '1800',
        start_time: '2024-11-01T00:00:00+0000',
        stop_time: '2024-11-30T23:59:59+0000',
        created_time: '2024-10-28T14:00:00+0000',
        updated_time: '2024-11-02T07:45:00+0000',
        account_id: 'act_876543210',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        special_ad_categories: []
    },
    // Account 3 - Global Retail Ads
    {
        id: '45678901234567',
        name: 'Flash Sale Conversions',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        objective: 'OUTCOME_SALES',
        daily_budget: '20000',
        lifetime_budget: '0',
        budget_remaining: '14000',
        start_time: '2024-11-20T00:00:00+0000',
        stop_time: '2024-12-05T23:59:59+0000',
        created_time: '2024-11-18T08:00:00+0000',
        updated_time: '2024-11-21T10:15:00+0000',
        account_id: 'act_765432109',
        bid_strategy: 'LOWEST_COST_WITH_BID_CAP',
        special_ad_categories: []
    },
    {
        id: '45678901234568',
        name: 'Instagram Stories Engagement',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        objective: 'OUTCOME_ENGAGEMENT',
        daily_budget: '6000',
        lifetime_budget: '0',
        budget_remaining: '4200',
        start_time: '2024-10-01T00:00:00+0000',
        stop_time: '2024-12-31T23:59:59+0000',
        created_time: '2024-09-28T11:30:00+0000',
        updated_time: '2024-10-03T09:00:00+0000',
        account_id: 'act_765432109',
        bid_strategy: 'LOWEST_COST_WITHOUT_CAP',
        special_ad_categories: []
    }
];

const adSets = [
    // Campaign 23456789012345 - Q4 Lead Generation
    {
        id: '98765432109876',
        name: 'Lookalike Audience - US',
        campaign_id: '23456789012345',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        optimization_goal: 'LEAD_GENERATION',
        billing_event: 'IMPRESSIONS',
        bid_amount: '200',
        daily_budget: '2000',
        targeting: {
            geo_locations: { countries: ['US'] },
            age_min: 25,
            age_max: 55
        },
        start_time: '2024-10-01T00:00:00+0000',
        end_time: '2024-12-31T23:59:59+0000',
        created_time: '2024-09-25T14:30:00+0000',
        updated_time: '2024-10-01T00:00:00+0000'
    },
    {
        id: '98765432109877',
        name: 'Interest Targeting - Marketing Pros',
        campaign_id: '23456789012345',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        optimization_goal: 'LEAD_GENERATION',
        billing_event: 'IMPRESSIONS',
        bid_amount: '300',
        daily_budget: '3000',
        targeting: {
            geo_locations: { countries: ['US', 'CA'] },
            age_min: 28,
            age_max: 50,
            interests: [{ id: '6003139266461', name: 'Digital marketing' }]
        },
        start_time: '2024-10-01T00:00:00+0000',
        end_time: '2024-12-31T23:59:59+0000',
        created_time: '2024-09-26T10:00:00+0000',
        updated_time: '2024-10-02T14:00:00+0000'
    },
    // Campaign 34567890123456 - App Install
    {
        id: '87654321098765',
        name: 'Mobile - Android Users',
        campaign_id: '34567890123456',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        optimization_goal: 'APP_INSTALLS',
        billing_event: 'IMPRESSIONS',
        bid_amount: '150',
        daily_budget: '7500',
        targeting: {
            geo_locations: { countries: ['US', 'GB', 'DE'] },
            age_min: 18,
            age_max: 45,
            user_os: ['Android']
        },
        start_time: '2024-10-15T00:00:00+0000',
        end_time: '2025-01-15T23:59:59+0000',
        created_time: '2024-10-12T09:15:00+0000',
        updated_time: '2024-10-16T11:30:00+0000'
    },
    // Campaign 45678901234567 - Flash Sale
    {
        id: '76543210987654',
        name: 'Retargeting - Website Visitors',
        campaign_id: '45678901234567',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        optimization_goal: 'OFFSITE_CONVERSIONS',
        billing_event: 'IMPRESSIONS',
        bid_amount: '500',
        daily_budget: '10000',
        targeting: {
            geo_locations: { countries: ['US'] },
            age_min: 21,
            age_max: 65,
            custom_audiences: [{ id: '23847293847', name: 'Website Visitors 30d' }]
        },
        start_time: '2024-11-20T00:00:00+0000',
        end_time: '2024-12-05T23:59:59+0000',
        created_time: '2024-11-18T08:15:00+0000',
        updated_time: '2024-11-21T10:30:00+0000'
    },
    {
        id: '76543210987655',
        name: 'Broad - Holiday Shoppers',
        campaign_id: '45678901234567',
        status: 'ACTIVE',
        effective_status: 'ACTIVE',
        optimization_goal: 'OFFSITE_CONVERSIONS',
        billing_event: 'IMPRESSIONS',
        bid_amount: '400',
        daily_budget: '10000',
        targeting: {
            geo_locations: { countries: ['US', 'CA'] },
            age_min: 25,
            age_max: 55
        },
        start_time: '2024-11-20T00:00:00+0000',
        end_time: '2024-12-05T23:59:59+0000',
        created_time: '2024-11-18T08:30:00+0000',
        updated_time: '2024-11-21T10:45:00+0000'
    }
];

// Generate 7-day insights data for each campaign
function generateInsightsData(campaign) {
    const rows = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 7);

    for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const impressions = Math.floor(10000 + Math.random() * 10000);
        const reach = Math.floor(impressions * (0.75 + Math.random() * 0.2));
        const clicks = Math.floor(impressions * (0.025 + Math.random() * 0.025));
        const spend = (clicks * (0.3 + Math.random() * 0.4)).toFixed(2);
        const leads = Math.floor(clicks * (0.04 + Math.random() * 0.06));
        const engagements = Math.floor(clicks * (1.1 + Math.random() * 0.3));

        rows.push({
            impressions: String(impressions),
            clicks: String(clicks),
            spend: spend,
            reach: String(reach),
            ctr: ((clicks / impressions) * 100).toFixed(6),
            cpc: (parseFloat(spend) / clicks).toFixed(6),
            cpp: (parseFloat(spend) / reach * 1000).toFixed(6),
            cpm: (parseFloat(spend) / impressions * 1000).toFixed(6),
            frequency: (impressions / reach).toFixed(6),
            actions: [
                { action_type: 'link_click', value: String(clicks) },
                { action_type: 'lead', value: String(leads) },
                { action_type: 'post_engagement', value: String(engagements) }
            ],
            cost_per_action_type: [
                { action_type: 'lead', value: leads > 0 ? (parseFloat(spend) / leads).toFixed(6) : '0' }
            ],
            date_start: dateStr,
            date_stop: dateStr,
            campaign_id: campaign.id,
            campaign_name: campaign.name,
            account_id: campaign.account_id
        });
    }
    return rows;
}

// Pre-generate insights for all campaigns
const insightsData = {};
campaigns.forEach(c => {
    if (!insightsData[c.account_id]) {
        insightsData[c.account_id] = [];
    }
    insightsData[c.account_id].push(...generateInsightsData(c));
});

const errorResponse = {
    error: {
        message: 'Invalid OAuth access token.',
        type: 'OAuthException',
        code: 190,
        error_subcode: 467,
        fbtrace_id: 'mock-trace-id-xyz789'
    }
};

// Paging helper
function wrapInPaging(data) {
    return {
        data,
        paging: {
            cursors: {
                before: 'before_cursor_string',
                after: 'after_cursor_string'
            },
            next: data.length > 0 ? `https://graph.facebook.com/v21.0/act_mock/campaigns?after=after_cursor_string` : undefined
        }
    };
}

module.exports = {
    accounts,
    campaigns,
    adSets,
    insightsData,
    errorResponse,
    wrapInPaging
};
