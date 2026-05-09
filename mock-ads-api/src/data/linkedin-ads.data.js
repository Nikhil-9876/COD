/**
 * LinkedIn Ads Mock Data
 * Matches LinkedIn Marketing API exactly
 * - URN format IDs, epoch ms timestamps, money objects
 */

const accounts = [
    { id: 'urn:li:sponsoredAccount:789012', name: 'Acme Corp LinkedIn' },
    { id: 'urn:li:sponsoredAccount:890123', name: 'TechStart LinkedIn Ads' },
    { id: 'urn:li:sponsoredAccount:901234', name: 'Global Retail B2B' }
];

const campaigns = [
    {
        id: 'urn:li:sponsoredCampaign:123456', name: 'B2B SaaS - Decision Makers',
        status: 'ACTIVE', type: 'SPONSORED_UPDATES', costType: 'CPC',
        unitCost: { amount: '5.00', currencyCode: 'USD' },
        dailyBudget: { amount: '100.00', currencyCode: 'USD' },
        totalBudget: { amount: '3000.00', currencyCode: 'USD' },
        campaignGroup: 'urn:li:sponsoredCampaignGroup:345678',
        account: 'urn:li:sponsoredAccount:789012',
        targeting: { includedTargetingFacets: { locations: ['urn:li:geo:103644278'], industries: ['urn:li:industry:4'], seniorities: ['urn:li:seniority:9', 'urn:li:seniority:10'], jobFunctions: ['urn:li:jobFunction:8'] } },
        objective: 'LEAD_GENERATION', startAt: 1696118400000, endAt: 1704067199000,
        createdAt: 1695513600000, lastModifiedAt: 1696118400000, version: { versionTag: '1' }
    },
    {
        id: 'urn:li:sponsoredCampaign:123457', name: 'Thought Leadership - Content',
        status: 'ACTIVE', type: 'SPONSORED_UPDATES', costType: 'CPM',
        unitCost: { amount: '12.00', currencyCode: 'USD' },
        dailyBudget: { amount: '150.00', currencyCode: 'USD' },
        totalBudget: { amount: '4500.00', currencyCode: 'USD' },
        campaignGroup: 'urn:li:sponsoredCampaignGroup:345678',
        account: 'urn:li:sponsoredAccount:789012',
        targeting: { includedTargetingFacets: { locations: ['urn:li:geo:103644278'], industries: ['urn:li:industry:4', 'urn:li:industry:6'], seniorities: ['urn:li:seniority:8', 'urn:li:seniority:9'] } },
        objective: 'BRAND_AWARENESS', startAt: 1698796800000, endAt: 1704067199000,
        createdAt: 1698710400000, lastModifiedAt: 1698796800000, version: { versionTag: '1' }
    },
    {
        id: 'urn:li:sponsoredCampaign:234567', name: 'Product Launch - InMail',
        status: 'ACTIVE', type: 'SPONSORED_INMAILS', costType: 'CPS',
        unitCost: { amount: '0.80', currencyCode: 'USD' },
        dailyBudget: { amount: '200.00', currencyCode: 'USD' },
        totalBudget: { amount: '6000.00', currencyCode: 'USD' },
        campaignGroup: 'urn:li:sponsoredCampaignGroup:456789',
        account: 'urn:li:sponsoredAccount:890123',
        targeting: { includedTargetingFacets: { locations: ['urn:li:geo:103644278'], industries: ['urn:li:industry:4'], seniorities: ['urn:li:seniority:9', 'urn:li:seniority:10'] } },
        objective: 'LEAD_GENERATION', startAt: 1699401600000, endAt: 1704067199000,
        createdAt: 1699315200000, lastModifiedAt: 1699401600000, version: { versionTag: '1' }
    },
    {
        id: 'urn:li:sponsoredCampaign:234568', name: 'Webinar Registration Ads',
        status: 'ACTIVE', type: 'SPONSORED_UPDATES', costType: 'CPC',
        unitCost: { amount: '6.50', currencyCode: 'USD' },
        dailyBudget: { amount: '120.00', currencyCode: 'USD' },
        totalBudget: { amount: '3600.00', currencyCode: 'USD' },
        campaignGroup: 'urn:li:sponsoredCampaignGroup:456789',
        account: 'urn:li:sponsoredAccount:890123',
        targeting: { includedTargetingFacets: { locations: ['urn:li:geo:103644278'], industries: ['urn:li:industry:4'], seniorities: ['urn:li:seniority:7', 'urn:li:seniority:8'] } },
        objective: 'WEBSITE_CONVERSIONS', startAt: 1700006400000, endAt: 1701216000000,
        createdAt: 1699920000000, lastModifiedAt: 1700006400000, version: { versionTag: '1' }
    },
    {
        id: 'urn:li:sponsoredCampaign:345678', name: 'Enterprise Solutions - Display',
        status: 'ACTIVE', type: 'SPONSORED_UPDATES', costType: 'CPC',
        unitCost: { amount: '8.00', currencyCode: 'USD' },
        dailyBudget: { amount: '250.00', currencyCode: 'USD' },
        totalBudget: { amount: '7500.00', currencyCode: 'USD' },
        campaignGroup: 'urn:li:sponsoredCampaignGroup:567890',
        account: 'urn:li:sponsoredAccount:901234',
        targeting: { includedTargetingFacets: { locations: ['urn:li:geo:103644278'], industries: ['urn:li:industry:47'], seniorities: ['urn:li:seniority:9', 'urn:li:seniority:10'] } },
        objective: 'LEAD_GENERATION', startAt: 1698796800000, endAt: 1704067199000,
        createdAt: 1698710400000, lastModifiedAt: 1698796800000, version: { versionTag: '2' }
    },
    {
        id: 'urn:li:sponsoredCampaign:345679', name: 'Brand Followers Growth',
        status: 'DRAFT', type: 'SPONSORED_UPDATES', costType: 'CPM',
        unitCost: { amount: '10.00', currencyCode: 'USD' },
        dailyBudget: { amount: '80.00', currencyCode: 'USD' },
        totalBudget: { amount: '2400.00', currencyCode: 'USD' },
        campaignGroup: 'urn:li:sponsoredCampaignGroup:567890',
        account: 'urn:li:sponsoredAccount:901234',
        targeting: { includedTargetingFacets: { locations: ['urn:li:geo:103644278'], industries: ['urn:li:industry:47'] } },
        objective: 'BRAND_AWARENESS', startAt: 1700611200000, endAt: 1704067199000,
        createdAt: 1700524800000, lastModifiedAt: 1700611200000, version: { versionTag: '1' }
    }
];

const creatives = [
    { id: 'urn:li:sponsoredCreative:987654', campaign: 'urn:li:sponsoredCampaign:123456', status: 'ACTIVE', type: 'SPONSORED_STATUS_UPDATE', reference: 'urn:li:share:1122334455', createdAt: 1695513600000, lastModifiedAt: 1696118400000, version: { versionTag: '2' } },
    { id: 'urn:li:sponsoredCreative:987655', campaign: 'urn:li:sponsoredCampaign:123456', status: 'ACTIVE', type: 'SPONSORED_STATUS_UPDATE', reference: 'urn:li:share:1122334456', createdAt: 1695600000000, lastModifiedAt: 1696204800000, version: { versionTag: '1' } },
    { id: 'urn:li:sponsoredCreative:876543', campaign: 'urn:li:sponsoredCampaign:123457', status: 'ACTIVE', type: 'SPONSORED_STATUS_UPDATE', reference: 'urn:li:share:2233445566', createdAt: 1698710400000, lastModifiedAt: 1698796800000, version: { versionTag: '1' } },
    { id: 'urn:li:sponsoredCreative:765432', campaign: 'urn:li:sponsoredCampaign:234567', status: 'ACTIVE', type: 'SPONSORED_INMAIL', reference: 'urn:li:messageTemplate:3344556677', createdAt: 1699315200000, lastModifiedAt: 1699401600000, version: { versionTag: '1' } },
    { id: 'urn:li:sponsoredCreative:654321', campaign: 'urn:li:sponsoredCampaign:345678', status: 'ACTIVE', type: 'SPONSORED_STATUS_UPDATE', reference: 'urn:li:share:4455667788', createdAt: 1698710400000, lastModifiedAt: 1698796800000, version: { versionTag: '3' } }
];

function generateAnalytics(campaign) {
    const rows = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 7);
    for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const imp = Math.floor(5000 + Math.random() * 8000);
        const cl = Math.floor(imp * (0.02 + Math.random() * 0.02));
        const cost = (cl * (1.0 + Math.random() * 5.0)).toFixed(2);
        rows.push({
            dateRange: { start: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() }, end: { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() } },
            pivotValues: [campaign.id],
            impressions: String(imp), clicks: String(cl), costInLocalCurrency: cost,
            likes: String(Math.floor(cl * 0.4)), comments: String(Math.floor(cl * 0.05)),
            shares: String(Math.floor(cl * 0.1)), follows: String(Math.floor(Math.random() * 15)),
            opens: '0', sends: '0',
            landingPageClicks: String(Math.floor(cl * 0.9)),
            viralImpressions: String(Math.floor(imp * 0.03)),
            viralClicks: String(Math.floor(imp * 0.001)),
            totalEngagements: String(Math.floor(cl * 1.5)),
            leadGenerationMailContactInfoShares: '0',
            oneClickLeads: String(Math.floor(cl * 0.08))
        });
    }
    return rows;
}

const analyticsData = {};
campaigns.forEach(c => {
    if (!analyticsData[c.account]) analyticsData[c.account] = [];
    analyticsData[c.account].push(...generateAnalytics(c));
});

const errorResponse = { status: 422, serviceErrorCode: 100, code: 'UNPROCESSABLE_ENTITY', message: 'Invalid campaign URN provided.' };

function wrapInPaging(elements, start = 0, count = 10) {
    return {
        elements,
        paging: { start, count, total: elements.length, links: elements.length > start + count ? [{ rel: 'next', href: `/adCampaigns?start=${start + count}&count=${count}` }] : [] }
    };
}

module.exports = { accounts, campaigns, creatives, analyticsData, errorResponse, wrapInPaging };
