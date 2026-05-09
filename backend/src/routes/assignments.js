import { Router } from 'express';
import { listAssignments, createAssignment, deleteAssignment } from '../controllers/assignments.js';

const router = Router();

router.get('/', listAssignments);
router.post('/', createAssignment);
router.delete('/:id', deleteAssignment);

export default router;
