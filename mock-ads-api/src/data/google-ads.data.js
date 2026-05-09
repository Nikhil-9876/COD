/**
 * Google Ads Mock Data
 * Matches Google Ads REST API v18 response structures exactly
 * - resourceName URN format for IDs
 * - All cost values in micros (strings)
 * - All metric values as strings
 * - Date format: "YYYY-MM-DD"
 */

const clients = [
    { customerId: '1234567890', descriptiveName: 'Acme Corp' },
    { customerId: '2345678901', descriptiveName: 'TechStart Inc' },
    { customerId: '3456789012', descriptiveName: 'Global Retail Ltd' }
];

const campaigns = [
    // Client 1 - Acme Corp
    {
        campaign: {
            resourceName: 'customers/1234567890/campaigns/111222333',
            id: '111222333',
            name: 'Summer Sale 2024',
            status: 'ENABLED',
            servingStatus: 'SERVING',
            startDate: '2024-06-01',
            endDate: '2024-08-31',
            advertisingChannelType: 'SEARCH',
            biddingStrategyType: 'TARGET_CPA',
            campaignBudget: 'customers/1234567890/campaignBudgets/99887766',
            targetCpa: {
                targetCpaMicros: '5000000'
            }
        }
    },
    {
        campaign: {
            resourceName: 'customers/1234567890/campaigns/111222444',
            id: '111222444',
            name: 'Brand Awareness Display',
            status: 'ENABLED',
            servingStatus: 'SERVING',
            startDate: '2024-07-01',
            endDate: '2024-09-30',
            advertisingChannelType: 'DISPLAY',
            biddingStrategyType: 'TARGET_IMPRESSION_SHARE',
            campaignBudget: 'customers/1234567890/campaignBudgets/99887767',
            targetImpressionShare: {
                location: 'TOP_OF_PAGE',
                locationFractionMicros: '900000'
            }
        }
    },
    {
        campaign: {
            resourceName: 'customers/1234567890/campaigns/111222555',
            id: '111222555',
            name: 'Retargeting - Cart Abandoners',
            status: 'PAUSED',
            servingStatus: 'NONE',
            startDate: '2024-05-01',
            endDate: '2024-07-31',
            advertisingChannelType: 'DISPLAY',
            biddingStrategyType: 'MAXIMIZE_CONVERSIONS',
            campaignBudget: 'customers/1234567890/campaignBudgets/99887768'
        }
    },
    // Client 2 - TechStart Inc
    {
        campaign: {
            resourceName: 'customers/2345678901/campaigns/222333444',
            id: '222333444',
            name: 'SaaS Free Trial Signups',
            status: 'ENABLED',
            servingStatus: 'SERVING',
            startDate: '2024-08-01',
            endDate: '2024-12-31',
            advertisingChannelType: 'SEARCH',
            biddingStrategyType: 'TARGET_CPA',
            campaignBudget: 'customers/2345678901/campaignBudgets/88776655',
            targetCpa: {
                targetCpaMicros: '12000000'
            }
        }
    },
    {
        campaign: {
            resourceName: 'customers/2345678901/campaigns/222333555',
            id: '222333555',
            name: 'YouTube Product Demo Ads',
            status: 'ENABLED',
            servingStatus: 'SERVING',
            startDate: '2024-09-01',
            endDate: '2024-11-30',
            advertisingChannelType: 'VIDEO',
            biddingStrategyType: 'TARGET_CPV',
            campaignBudget: 'customers/2345678901/campaignBudgets/88776656'
        }
    },
    // Client 3 - Global Retail Ltd
    {
        campaign: {
            resourceName: 'customers/3456789012/campaigns/333444555',
            id: '333444555',
            name: 'Holiday Shopping Campaign',
            status: 'ENABLED',
            servingStatus: 'SERVING',
            startDate: '2024-11-01',
            endDate: '2024-12-31',
            advertisingChannelType: 'SHOPPING',
            biddingStrategyType: 'MAXIMIZE_CONVERSION_VALUE',
            campaignBudget: 'customers/3456789012/campaignBudgets/77665544'
        }
    },
    {
        campaign: {
            resourceName: 'customers/3456789012/campaigns/333444666',
            id: '333444666',
            name: 'Local Store Visits',
            status: 'ENABLED',
            servingStatus: 'SERVING',
            startDate: '2024-10-01',
            endDate: '2024-12-31',
            advertisingChannelType: 'LOCAL',
            biddingStrategyType: 'TARGET_CPA',
            campaignBudget: 'customers/3456789012/campaignBudgets/77665545',
            targetCpa: {
                targetCpaMicros: '3000000'
            }
        }
    },
    {
        campaign: {
            resourceName: 'customers/3456789012/campaigns/333444777',
            id: '333444777',
            name: 'Clearance Sale Search',
            status: 'REMOVED',
            servingStatus: 'NONE',
            startDate: '2024-01-01',
            endDate: '2024-03-31',
            advertisingChannelType: 'SEARCH',
            biddingStrategyType: 'MANUAL_CPC',
            campaignBudget: 'customers/3456789012/campaignBudgets/77665546'
        }
    }
];

const adGroups = [
    // Campaign 111222333 - Summer Sale 2024
    {
        adGroup: {
            resourceName: 'customers/1234567890/adGroups/555666777',
            id: '555666777',
            name: 'Brand Keywords',
            status: 'ENABLED',
            type: 'SEARCH_STANDARD',
            campaign: 'customers/1234567890/campaigns/111222333',
            cpcBidMicros: '2000000'
        }
    },
    {
        adGroup: {
            resourceName: 'customers/1234567890/adGroups/555666778',
            id: '555666778',
            name: 'Competitor Keywords',
            status: 'ENABLED',
            type: 'SEARCH_STANDARD',
            campaign: 'customers/1234567890/campaigns/111222333',
            cpcBidMicros: '3500000'
        }
    },
    // Campaign 111222444 - Brand Awareness Display
    {
        adGroup: {
            resourceName: 'customers/1234567890/adGroups/555666779',
            id: '555666779',
            name: 'In-Market Audiences',
            status: 'ENABLED',
            type: 'DISPLAY_STANDARD',
            campaign: 'customers/1234567890/campaigns/111222444',
            cpcBidMicros: '1200000'
        }
    },
    // Campaign 222333444 - SaaS Free Trial
    {
        adGroup: {
            resourceName: 'customers/2345678901/adGroups/666777888',
            id: '666777888',
            name: 'SaaS Keywords - Broad',
            status: 'ENABLED',
            type: 'SEARCH_STANDARD',
            campaign: 'customers/2345678901/campaigns/222333444',
            cpcBidMicros: '4500000'
        }
    },
    {
        adGroup: {
            resourceName: 'customers/2345678901/adGroups/666777889',
            id: '666777889',
            name: 'SaaS Keywords - Exact',
            status: 'ENABLED',
            type: 'SEARCH_STANDARD',
            campaign: 'customers/2345678901/campaigns/222333444',
            cpcBidMicros: '6000000'
        }
    },
    // Campaign 333444555 - Holiday Shopping
    {
        adGroup: {
            resourceName: 'customers/3456789012/adGroups/777888999',
            id: '777888999',
            name: 'Electronics - Top Sellers',
            status: 'ENABLED',
            type: 'SHOPPING_PRODUCT_ADS',
            campaign: 'customers/3456789012/campaigns/333444555',
            cpcBidMicros: '1500000'
        }
    },
    {
        adGroup: {
            resourceName: 'customers/3456789012/adGroups/777889000',
            id: '777889000',
            name: 'Apparel - Winter Collection',
            status: 'ENABLED',
            type: 'SHOPPING_PRODUCT_ADS',
            campaign: 'customers/3456789012/campaigns/333444555',
            cpcBidMicros: '1000000'
        }
    }
];

// Generate 7-day analytics data for each campaign
function generateAnalyticsRows(campaignObj) {
    const c = campaignObj.campaign;
    const customerId = c.resourceName.split('/')[1];
    const rows = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - 7);

    for (let i = 0; i < 7; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        const impressions = Math.floor(8000 + Math.random() * 8000);
        const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.03));
        const costMicros = Math.floor(clicks * (1200000 + Math.random() * 3000000));
        const conversions = Math.floor(clicks * (0.05 + Math.random() * 0.1));
        const conversionsValue = (conversions * (25 + Math.random() * 50)).toFixed(1);

        rows.push({
            campaign: {
                id: c.id,
                name: c.name,
                status: c.status
            },
            metrics: {
                clicks: String(clicks),
                impressions: String(impressions),
                costMicros: String(costMicros),
                ctr: (clicks / impressions).toFixed(4),
                averageCpc: String(Math.floor(costMicros / clicks)),
                conversions: `${conversions}.0`,
                conversionsValue: conversionsValue,
                roas: (parseFloat(conversionsValue) / (costMicros / 1000000)).toFixed(2)
            },
            segments: {
                date: dateStr
            }
        });
    }
    return rows;
}

// Pre-generate analytics for all campaigns
const analyticsData = {};
campaigns.forEach(c => {
    const customerId = c.campaign.resourceName.split('/')[1];
    if (!analyticsData[customerId]) {
        analyticsData[customerId] = [];
    }
    analyticsData[customerId].push(...generateAnalyticsRows(c));
});

const errorResponse = {
    error: {
        code: 400,
        message: 'Request contains an invalid argument.',
        status: 'INVALID_ARGUMENT',
        details: [
            {
                '@type': 'type.googleapis.com/google.ads.googleads.v18.errors.GoogleAdsFailure',
                errors: [
                    {
                        errorCode: { campaignError: 'INVALID_CAMPAIGN_ID' },
                        message: 'The campaign ID is invalid.',
                        location: {
                            fieldPathElements: [{ fieldName: 'campaign_id' }]
                        }
                    }
                ],
                requestId: 'mock-request-id-abc123'
            }
        ]
    }
};

module.exports = {
    clients,
    campaigns,
    adGroups,
    analyticsData,
    errorResponse
};
