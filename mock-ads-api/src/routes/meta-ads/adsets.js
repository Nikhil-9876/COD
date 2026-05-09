const router = require('express').Router();
const { adSets, errorResponse, wrapInPaging } = require('../../data/meta-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/meta-ads/adsets
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    let data = adSets;
    if (req.query.campaignId) {
        data = adSets.filter(a => a.campaign_id === req.query.campaignId);
    }
    res.json(wrapInPaging(data));
});

// GET /api/meta-ads/adsets/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    const adSet = adSets.find(a => a.id === req.params.id);
    if (!adSet) {
        return res.status(404).json({
            error: {
                message: 'Unsupported get request. Object with ID does not exist.',
                type: 'GraphMethodException',
                code: 100,
                error_subcode: 33,
                fbtrace_id: `mock-trace-${Date.now()}`
            }
        });
    }
    res.json(adSet);
});

module.exports = router;
