const router = require('express').Router();
const { campaigns, errorResponse } = require('../../data/google-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/google-ads/campaigns
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    let results = campaigns;
    if (req.query.clientId) {
        results = campaigns.filter(c => c.campaign.resourceName.includes(`customers/${req.query.clientId}`));
    }
    res.json({ results });
});

// GET /api/google-ads/campaigns/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    const campaign = campaigns.find(c => c.campaign.id === req.params.id);
    if (!campaign) {
        return res.status(404).json({
            error: { code: 404, message: 'Campaign not found.', status: 'NOT_FOUND', details: [] }
        });
    }
    res.json(campaign);
});

module.exports = router;
