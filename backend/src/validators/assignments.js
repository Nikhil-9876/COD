import { z } from 'zod';

export const createAssignmentSchema = z.object({
    employee_id: z.string().uuid('Invalid employee ID'),
    client_id: z.string().uuid('Invalid client ID'),
});

export const assignmentQuerySchema = z.object({
    employee_id: z.string().uuid().optional(),
    client_id: z.string().uuid().optional(),
});
