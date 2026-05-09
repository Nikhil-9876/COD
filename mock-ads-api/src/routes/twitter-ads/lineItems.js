const router = require('express').Router();
const { lineItems, errorResponse, wrapResponse } = require('../../data/twitter-ads.data');

const delay = () => new Promise(r => setTimeout(r, 200 + Math.random() * 600));

// GET /api/twitter-ads/line-items
router.get('/', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(401).json(errorResponse);

    let data = lineItems;
    if (req.query.clientId) {
        data = lineItems.filter(li => li.account_id === req.query.clientId);
    }
    if (req.query.campaignId) {
        data = data.filter(li => li.campaign_id === req.query.campaignId);
    }
    const params = {};
    if (req.query.clientId) params.account_id = req.query.clientId;
    if (req.query.campaignId) params.campaign_id = req.query.campaignId;
    res.json(wrapResponse(data, params));
});

// GET /api/twitter-ads/line-items/:id
router.get('/:id', async (req, res) => {
    await delay();
    if (req.query.simulate === 'error') return res.status(401).json(errorResponse);

    const lineItem = lineItems.find(li => li.id === req.params.id);
    if (!lineItem) {
        return res.status(404).json({
            errors: [{ code: 34, message: 'Sorry, that line item does not exist.', label: 'NOT_FOUND' }],
            request: { params: { line_item_id: req.params.id } }
        });
    }
    res.json(wrapResponse([lineItem], { line_item_id: req.params.id }));
});

module.exports = router;
