import { Router } from 'express';
import { agencyDashboard, clientDashboard, employeeDashboard } from '../controllers/dashboard.js';
import { requireRole } from '../middleware/scopeGuard.js';
import { cacheRoute } from '../utils/cache.js';

const router = Router();

router.get('/agency', requireRole('admin', 'manager'), cacheRoute(300), agencyDashboard);
router.get('/employee', requireRole('employee'), cacheRoute(300), employeeDashboard);
router.get('/client/:client_id', clientDashboard);

export default router;
