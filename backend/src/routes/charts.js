import { Router } from 'express';
import { performanceChart, platformSplit, agencySpend } from '../controllers/charts.js';
import { requireRole } from '../middleware/scopeGuard.js';

const router = Router();

router.get('/performance', performanceChart);
router.get('/platform-split', platformSplit);
router.get('/agency-spend', requireRole('admin', 'manager'), agencySpend);

export default router;
