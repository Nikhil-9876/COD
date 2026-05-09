import { Router } from 'express';
import multer from 'multer';
import { getMetrics, uploadMetrics } from '../controllers/metrics.js';
import { requireRole } from '../middleware/scopeGuard.js';

const upload = multer({ dest: '/tmp/cloudcrm-uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

const router = Router();

router.get('/', getMetrics);
router.post('/upload', requireRole('admin', 'manager'), upload.single('file'), uploadMetrics);

export default router;
