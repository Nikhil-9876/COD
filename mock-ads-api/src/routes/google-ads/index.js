const router = require('express').Router();
const googleAdsAuth = require('../../middleware/auth/googleAdsAuth');
const campaignsRouter = require('./campaigns');
const adgroupsRouter = require('./adgroups');
const analyticsRouter = require('./analytics');

// Apply auth before all routes
router.use(googleAdsAuth);

router.use('/campaigns', campaignsRouter);
router.use('/adgroups', adgroupsRouter);
router.use('/analytics', analyticsRouter);

module.exports = router;
