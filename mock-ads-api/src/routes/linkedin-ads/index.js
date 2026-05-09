const router = require('express').Router();
const linkedinAdsAuth = require('../../middleware/auth/linkedinAdsAuth');
const campaignsRouter = require('./campaigns');
const creativesRouter = require('./creatives');
const analyticsRouter = require('./analytics');

// Apply auth before all routes
router.use(linkedinAdsAuth);

router.use('/campaigns', campaignsRouter);
router.use('/creatives', creativesRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;
