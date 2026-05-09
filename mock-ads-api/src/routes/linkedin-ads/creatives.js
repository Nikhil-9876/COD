const router = require('express').Router();
const { creatives, errorResponse, wrapInPaging } = require('../../data/linkedin-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/linkedin-ads/creatives
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(422).json(errorResponse);

    let data = creatives;
    if (req.query.campaignId) {
        data = creatives.filter(c => c.campaign === req.query.campaignId || c.campaign === `urn:li:sponsoredCampaign:${req.query.campaignId}`);
    }
    res.json(wrapInPaging(data));
});

// GET /api/linkedin-ads/creatives/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(422).json(errorResponse);

    const creative = creatives.find(c => c.id === req.params.id || c.id === `urn:li:sponsoredCreative:${req.params.id}`);
    if (!creative) {
        return res.status(404).json({
            status: 404, serviceErrorCode: 100, code: 'RESOURCE_NOT_FOUND', message: 'Creative not found.'
        });
    }
    res.json(creative);
});

module.exports = router;
