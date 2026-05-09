const router = require('express').Router();
const { statsData, errorResponse } = require('../../data/twitter-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/twitter-ads/analytics
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(401).json(errorResponse);

    const { clientId, campaignId, startDate, endDate } = req.query;

    let results = [];
    if (clientId && statsData[clientId]) {
        results = [...statsData[clientId]];
    } else {
        Object.values(statsData).forEach(rows => results.push(...rows));
    }

    if (campaignId) {
        results = results.filter(r => r.id === campaignId);
    }

    const params = {};
    if (clientId) params.account_id = clientId;
    if (campaignId) params.campaign_id = campaignId;
    if (startDate) params.start_time = startDate;
    if (endDate) params.end_time = endDate;

    res.json({
        data: results,
        total_count: results.length,
        request: { params }
    });
});

module.exports = router;
