const router = require('express').Router();
const { analyticsData, errorResponse, wrapInPaging } = require('../../data/linkedin-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/linkedin-ads/analytics
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(422).json(errorResponse);

    const { clientId, campaignId, startDate, endDate } = req.query;

    let results = [];

    if (clientId && analyticsData[clientId]) {
        results = [...analyticsData[clientId]];
    } else {
        Object.values(analyticsData).forEach(rows => results.push(...rows));
    }

    if (campaignId) {
        const fullUrn = campaignId.startsWith('urn:') ? campaignId : `urn:li:sponsoredCampaign:${campaignId}`;
        results = results.filter(r => r.pivotValues.includes(fullUrn));
    }

    // Date filtering uses the dateRange.start fields
    if (startDate) {
        const [sy, sm, sd] = startDate.split('-').map(Number);
        results = results.filter(r => {
            const d = r.dateRange.start;
            return (d.year > sy) || (d.year === sy && d.month > sm) || (d.year === sy && d.month === sm && d.day >= sd);
        });
    }
    if (endDate) {
        const [ey, em, ed] = endDate.split('-').map(Number);
        results = results.filter(r => {
            const d = r.dateRange.end;
            return (d.year < ey) || (d.year === ey && d.month < em) || (d.year === ey && d.month === em && d.day <= ed);
        });
    }

    res.json(wrapInPaging(results));
});

module.exports = router;
