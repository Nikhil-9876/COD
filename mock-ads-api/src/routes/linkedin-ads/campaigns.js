const router = require('express').Router();
const { campaigns, errorResponse, wrapInPaging } = require('../../data/linkedin-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/linkedin-ads/campaigns
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(422).json(errorResponse);

    let data = campaigns;
    if (req.query.clientId) {
        data = campaigns.filter(c => c.account === req.query.clientId);
    }
    res.json(wrapInPaging(data));
});

// GET /api/linkedin-ads/campaigns/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(422).json(errorResponse);

    // Support both full URN and just the numeric part
    const campaign = campaigns.find(c => c.id === req.params.id || c.id === `urn:li:sponsoredCampaign:${req.params.id}`);
    if (!campaign) {
        return res.status(404).json({
            status: 404,
            serviceErrorCode: 100,
            code: 'RESOURCE_NOT_FOUND',
            message: 'Campaign not found.'
        });
    }
    res.json(campaign);
});

module.exports = router;
