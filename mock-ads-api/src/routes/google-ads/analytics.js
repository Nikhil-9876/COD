const router = require('express').Router();
const { analyticsData, errorResponse } = require('../../data/google-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/google-ads/analytics
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    const { clientId, campaignId, startDate, endDate } = req.query;

    let results = [];

    // Collect analytics rows
    if (clientId && analyticsData[clientId]) {
        results = [...analyticsData[clientId]];
    } else {
        // Return all analytics data
        Object.values(analyticsData).forEach(rows => results.push(...rows));
    }

    // Filter by campaignId
    if (campaignId) {
        results = results.filter(r => r.campaign.id === campaignId);
    }

    // Filter by date range
    if (startDate) {
        results = results.filter(r => r.segments.date >= startDate);
    }
    if (endDate) {
        results = results.filter(r => r.segments.date <= endDate);
    }

    res.json({ results });
});

module.exports = router;
