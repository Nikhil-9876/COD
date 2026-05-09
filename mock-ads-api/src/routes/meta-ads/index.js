const router = require('express').Router();
const metaAdsAuth = require('../../middleware/auth/metaAdsAuth');
const campaignsRouter = require('./campaigns');
const adsetsRouter = require('./adsets');
const analyticsRouter = require('./analytics');

// Apply auth before all routes
router.use(metaAdsAuth);

router.use('/campaigns', campaignsRouter);
router.use('/adsets', adsetsRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;
