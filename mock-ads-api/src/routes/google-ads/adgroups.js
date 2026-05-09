const router = require('express').Router();
const { adGroups, errorResponse } = require('../../data/google-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/google-ads/adgroups
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    let results = adGroups;
    if (req.query.clientId) {
        results = adGroups.filter(ag => ag.adGroup.resourceName.includes(`customers/${req.query.clientId}`));
    }
    if (req.query.campaignId) {
        results = results.filter(ag => ag.adGroup.campaign.includes(`campaigns/${req.query.campaignId}`));
    }
    res.json({ results });
});

// GET /api/google-ads/adgroups/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(500).json(errorResponse);

    const adGroup = adGroups.find(ag => ag.adGroup.id === req.params.id);
    if (!adGroup) {
        return res.status(404).json({
            error: { code: 404, message: 'Ad group not found.', status: 'NOT_FOUND', details: [] }
        });
    }
    res.json(adGroup);
});

module.exports = router;
