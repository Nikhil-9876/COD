import { Router } from 'express';
import {
    syncGoogle,
    syncMeta,
    syncMailchimp,
    syncLinkedIn,
    syncTwitter,
    syncAll,
    getSyncLogs,
    getAllSyncLogs
} from '../controllers/sync.js';

const router = Router();

router.get('/all-logs', getAllSyncLogs);
router.post('/:client_id/google', syncGoogle);
router.post('/:client_id/meta', syncMeta);
router.post('/:client_id/linkedin', syncLinkedIn);
router.post('/:client_id/twitter', syncTwitter);
router.post('/:client_id/mailchimp', syncMailchimp);
router.post('/:client_id/all', syncAll);
router.get('/:client_id/logs', getSyncLogs);

export default router;
