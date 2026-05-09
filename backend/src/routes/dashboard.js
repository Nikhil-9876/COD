import { Router } from 'express';
import { agencyDashboard, clientDashboard, employeeDashboard } from '../controllers/dashboard.js';
import { requireRole } from '../middleware/scopeGuard.js';

const router = Router();

router.get('/agency', requireRole('admin', 'manager'), agencyDashboard);
router.get('/employee', requireRole('employee'), employeeDashboard);
router.get('/client/:client_id', clientDashboard);

export default router;
