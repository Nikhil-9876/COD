import { Router } from 'express';
import { performanceChart, platformSplit, agencySpend } from '../controllers/charts.js';
import { requireRole } from '../middleware/scopeGuard.js';
import { cacheRoute } from '../utils/cache.js';

const router = Router();

router.get('/performance', cacheRoute(300), performanceChart);
router.get('/platform-split', cacheRoute(300), platformSplit);
router.get('/agency-spend', requireRole('admin', 'manager'), cacheRoute(300), agencySpend);

export default router;
