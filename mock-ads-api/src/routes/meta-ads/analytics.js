const router = require('express').Router();
const { insightsData, errorResponse, wrapInPaging } = require('../../data/meta-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/meta-ads/analytics
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    const { clientId, campaignId, startDate, endDate } = req.query;

    let results = [];

    if (clientId && insightsData[clientId]) {
        results = [...insightsData[clientId]];
    } else {
        Object.values(insightsData).forEach(rows => results.push(...rows));
    }

    if (campaignId) {
        results = results.filter(r => r.campaign_id === campaignId);
    }
    if (startDate) {
        results = results.filter(r => r.date_start >= startDate);
    }
    if (endDate) {
        results = results.filter(r => r.date_stop <= endDate);
    }

    res.json(wrapInPaging(results));
});

module.exports = router;
