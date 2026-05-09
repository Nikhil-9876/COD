import { Router } from 'express';
import {
    listClients, getClient, createClient, updateClient, deleteClient,
    connectPlatform, getOnboardingStatus, updateOnboardingStatus,
} from '../controllers/clients.js';
import { requireRole } from '../middleware/scopeGuard.js';

const router = Router();

router.use(requireRole('admin', 'manager', 'employee'));
router.get('/', listClients);
router.get('/:id', getClient);
router.post('/', requireRole('admin'), createClient);
router.patch('/:id', requireRole('admin'), updateClient);
router.delete('/:id', requireRole('admin'), deleteClient);
router.post('/:id/connect/:platform', connectPlatform);
router.get('/:id/onboarding-status', getOnboardingStatus);
router.patch('/:id/onboarding-status', updateOnboardingStatus);

export default router;
