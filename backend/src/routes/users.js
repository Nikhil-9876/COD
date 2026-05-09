import { Router } from 'express';
import { listUsers, getMe, createUser, updateUser, deleteUser } from '../controllers/users.js';
import { requireRole } from '../middleware/scopeGuard.js';

const router = Router();

// /me must come BEFORE /:id to avoid treating "me" as a UUID
router.get('/me', getMe);

router.get('/', requireRole('admin'), listUsers);
router.post('/', requireRole('admin'), createUser);
router.patch('/:id', requireRole('admin'), updateUser);
router.delete('/:id', requireRole('admin'), deleteUser);

export default router;
