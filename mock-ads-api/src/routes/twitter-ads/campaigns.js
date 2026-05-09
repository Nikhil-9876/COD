const router = require('express').Router();
const { campaigns, errorResponse, wrapResponse } = require('../../data/twitter-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/twitter-ads/campaigns
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(401).json(errorResponse);

    let data = campaigns;
    if (req.query.clientId) {
        data = campaigns.filter(c => c.account_id === req.query.clientId);
    }
    const params = req.query.clientId ? { account_id: req.query.clientId } : {};
    res.json(wrapResponse(data, params));
});

// GET /api/twitter-ads/campaigns/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(401).json(errorResponse);

    const campaign = campaigns.find(c => c.id === req.params.id);
    if (!campaign) {
        return res.status(404).json({
            errors: [{ code: 34, message: 'Sorry, that campaign does not exist.', label: 'NOT_FOUND' }],
            request: { params: { campaign_id: req.params.id } }
        });
    }
    res.json(wrapResponse([campaign], { campaign_id: req.params.id }));
});

module.exports = router;
