const router = require('express').Router();
const twitterAdsAuth = require('../../middleware/auth/twitterAdsAuth');
const campaignsRouter = require('./campaigns');
const lineItemsRouter = require('./lineItems');
const analyticsRouter = require('./analytics');

// Apply auth before all routes
router.use(twitterAdsAuth);

router.use('/campaigns', campaignsRouter);
router.use('/line-items', lineItemsRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;
