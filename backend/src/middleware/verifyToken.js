import { query } from '../services/db.js';
import { mapRole } from './scopeGuard.js';
import { verifyKeycloakToken } from '../services/keycloak.js';

const DEV_AUTH_EMAIL_HEADER = 'x-dev-auth-email';
let devBypassWarningLogged = false;

function parseBoolean(value) {
    if (typeof value !== 'string') return false;
    return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

function isDevAuthBypassEnabled() {
    if (process.env.NODE_ENV === 'production') return false;
    return parseBoolean(process.env.AUTH_DEV_BYPASS);
}

function getHeaderValue(req, headerName) {
    const raw = req.headers[headerName];
    if (typeof raw === 'string') return raw.trim();
    if (Array.isArray(raw) && raw.length > 0) return String(raw[0]).trim();
    return '';
}

async function resolveDevBypassUser(req) {
    const preferredEmail =
        getHeaderValue(req, DEV_AUTH_EMAIL_HEADER) ||
        (process.env.DEV_AUTH_EMAIL || '').trim();

    if (preferredEmail) {
        const byEmail = await query(
            `SELECT id, email, role, client_id, is_active, keycloak_user_id
             FROM users
             WHERE LOWER(email) = LOWER($1)
             LIMIT 1`,
            [preferredEmail]
        );
        return byEmail.rows[0] || null;
    }

    const fallback = await query(
        `SELECT id, email, role, client_id, is_active, keycloak_user_id
         FROM users
         WHERE is_active = true
         ORDER BY
            CASE role
                WHEN 'agency_admin' THEN 1
                WHEN 'manager' THEN 2
                WHEN 'employee' THEN 3
                WHEN 'client' THEN 4
                ELSE 5
            END,
            created_at ASC
         LIMIT 1`
    );

    return fallback.rows[0] || null;
}

/**
 * Verify Keycloak-issued access tokens, then resolve the corresponding
 * local domain user so the rest of the app can keep using req.user.
 */
async function resolveLocalUser(sub, email) {
    let result = await query(
        `SELECT id, email, role, client_id, is_active, keycloak_user_id
         FROM users
         WHERE keycloak_user_id = $1`,
        [sub]
    );

    if (result.rows.length > 0) {
        return result.rows[0];
    }

    if (!email) return null;

    result = await query(
        `SELECT id, email, role, client_id, is_active, keycloak_user_id
         FROM users
         WHERE LOWER(email) = LOWER($1)`,
        [email]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0];

    if (user.keycloak_user_id && user.keycloak_user_id !== sub) {
        console.error(
            `[AUTH] Keycloak subject mismatch for email=${email} local_user_id=${user.id} token_sub=${sub} stored_sub=${user.keycloak_user_id}`
        );
        return null;
    }

    if (!user.keycloak_user_id) {
        await query(
            `UPDATE users
             SET keycloak_user_id = $1
             WHERE id = $2`,
            [sub, user.id]
        );
        user.keycloak_user_id = sub;
    }

    return user;
}

export async function verifyToken(req, res, next) {
    if (isDevAuthBypassEnabled()) {
        if (!devBypassWarningLogged) {
            console.warn('[AUTH] Development auth bypass is enabled (AUTH_DEV_BYPASS=true). Keycloak token validation is skipped.');
            devBypassWarningLogged = true;
        }

        const localUser = await resolveDevBypassUser(req);
        if (!localUser) {
            return res.status(401).json({
                error: 'Dev auth bypass is enabled, but no local user could be resolved. Set DEV_AUTH_EMAIL or X-Dev-Auth-Email.',
            });
        }

        if (!localUser.is_active) {
            return res.status(403).json({ error: 'User account is inactive' });
        }

        req.user = {
            user_id: localUser.id,
            role: mapRole(localUser.role),
            client_id: localUser.client_id,
            keycloak_user_id: localUser.keycloak_user_id || null,
            email: localUser.email,
        };

        return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.slice(7);

    try {
        const { payload, role: tokenRole } = await verifyKeycloakToken(token);
        const sub = typeof payload.sub === 'string' ? payload.sub : null;
        const email = typeof payload.email === 'string' ? payload.email : null;

        if (!sub) {
            return res.status(401).json({ error: 'Invalid token subject' });
        }

        const localUser = await resolveLocalUser(sub, email);

        if (!localUser) {
            return res.status(401).json({ error: 'No local account is linked to this Keycloak user' });
        }

        if (!localUser.is_active) {
            return res.status(403).json({ error: 'User account is inactive' });
        }

        const localRole = mapRole(localUser.role);
        if (!tokenRole) {
            return res.status(403).json({ error: 'Missing required Keycloak role assignment' });
        }

        if (tokenRole !== localRole) {
            return res.status(403).json({ error: 'Role mismatch between Keycloak and local user record' });
        }

        req.user = {
            user_id: localUser.id,
            role: localRole,
            client_id: localUser.client_id,
            keycloak_user_id: sub,
            email: localUser.email,
        };

        next();
    } catch (err) {
        if (err.code === 'ERR_JWT_EXPIRED') {
            return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(401).json({ error: 'Invalid token' });
    }
}
