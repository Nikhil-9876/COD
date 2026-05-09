import { Router } from 'express';
import { listCampaigns, getCampaign, createCampaign, updateCampaign } from '../controllers/campaigns.js';
import { requireRole } from '../middleware/scopeGuard.js';

const router = Router();

router.get('/', listCampaigns);
router.get('/:id', getCampaign);
router.post('/', requireRole('admin'), createCampaign);
router.patch('/:id', requireRole('admin'), updateCampaign);

export default router;
