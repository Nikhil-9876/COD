import { query } from '../services/db.js';
import { createAssignmentSchema, assignmentQuerySchema } from '../validators/assignments.js';
import { uuidParamSchema } from '../validators/clients.js';

// ─── GET /api/assignments ───────────────────────────────────
// Query: ?employee_id=... or ?client_id=... (admin only)
export async function listAssignments(req, res) {
    const parsed = assignmentQuerySchema.safeParse(req.query);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const conditions = [];
    const values = [];
    let i = 1;

    if (parsed.data.employee_id) {
        conditions.push(`eca.employee_id = $${i}`);
        values.push(parsed.data.employee_id);
        i++;
    }
    if (parsed.data.client_id) {
        conditions.push(`eca.client_id = $${i}`);
        values.push(parsed.data.client_id);
        i++;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const result = await query(
        `SELECT eca.id, eca.employee_id, eca.client_id, eca.assigned_at,
                u.name AS employee_name, u.email AS employee_email,
                c.name AS client_name,
                assigner.name AS assigned_by_name
         FROM employee_client_assignments eca
         JOIN users u ON u.id = eca.employee_id
         JOIN clients c ON c.id = eca.client_id
         LEFT JOIN users assigner ON assigner.id = eca.assigned_by
         ${where}
         ORDER BY eca.assigned_at DESC`,
        values
    );

    return res.json({ assignments: result.rows });
}

// ─── POST /api/assignments ──────────────────────────────────
// Assign a client to an employee (admin only)
export async function createAssignment(req, res) {
    const parsed = createAssignmentSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ error: 'Invalid input', details: parsed.error.flatten().fieldErrors });
    }

    const { employee_id, client_id } = parsed.data;

    // Verify the user is actually an employee
    const empCheck = await query(
        `SELECT id, role FROM users WHERE id = $1 AND is_active = true`,
        [employee_id]
    );
    if (empCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Employee not found' });
    }
    if (empCheck.rows[0].role !== 'employee') {
        return res.status(400).json({ error: 'User is not an employee' });
    }

    // Verify the client exists
    const clientCheck = await query(
        `SELECT id FROM clients WHERE id = $1 AND is_active = true`,
        [client_id]
    );
    if (clientCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Client not found' });
    }

    // Check if already assigned
    const existing = await query(
        `SELECT id FROM employee_client_assignments WHERE employee_id = $1 AND client_id = $2`,
        [employee_id, client_id]
    );
    if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'Client is already assigned to this employee' });
    }

    const result = await query(
        `INSERT INTO employee_client_assignments (employee_id, client_id, assigned_by)
         VALUES ($1, $2, $3)
         RETURNING id, employee_id, client_id, assigned_at`,
        [employee_id, client_id, req.user.user_id]
    );

    return res.status(201).json({
        assignment: result.rows[0],
        message: 'Client assigned to employee successfully',
    });
}

// ─── DELETE /api/assignments/:id ────────────────────────────
// Unassign a client from an employee (admin only)
export async function deleteAssignment(req, res) {
    const idParsed = uuidParamSchema.safeParse(req.params.id);
    if (!idParsed.success) return res.status(400).json({ error: 'Invalid assignment ID' });

    const result = await query(
        `DELETE FROM employee_client_assignments WHERE id = $1 RETURNING id`,
        [idParsed.data]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Assignment not found' });
    return res.json({ message: 'Client unassigned from employee' });
}
