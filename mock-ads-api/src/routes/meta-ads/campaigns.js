const router = require('express').Router();
const { campaigns, errorResponse, wrapInPaging } = require('../../data/meta-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/meta-ads/campaigns
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    let data = campaigns;
    if (req.query.clientId) {
        data = campaigns.filter(c => c.account_id === req.query.clientId);
    }
    res.json(wrapInPaging(data));
});

// GET /api/meta-ads/campaigns/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    const campaign = campaigns.find(c => c.id === req.params.id);
    if (!campaign) {
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
    res.json(campaign);
});

module.exports = router;
