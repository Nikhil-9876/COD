import { createRemoteJWKSet, jwtVerify } from 'jose';

const APP_ROLES = ['admin', 'manager', 'employee', 'client'];

let jwksCache = null;
let adminTokenCache = {
    accessToken: null,
    expiresAt: 0,
};

function trimTrailingSlash(value = '') {
    return value.replace(/\/+$/, '');
}

export function getKeycloakConfig() {
    const url = trimTrailingSlash(process.env.KEYCLOAK_URL || '');
    const realm = process.env.KEYCLOAK_REALM;
    const clientId = process.env.KEYCLOAK_CLIENT_ID;

    if (!url || !realm || !clientId) {
        throw new Error('Keycloak is not configured. Set KEYCLOAK_URL, KEYCLOAK_REALM, and KEYCLOAK_CLIENT_ID.');
    }

    const issuer = process.env.KEYCLOAK_ISSUER || `${url}/realms/${realm}`;
    const jwksUrl = process.env.KEYCLOAK_JWKS_URL || `${issuer}/protocol/openid-connect/certs`;
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;
    const adminRealm = process.env.KEYCLOAK_ADMIN_REALM || realm;
    const adminTokenUrl = `${url}/realms/${adminRealm}/protocol/openid-connect/token`;
    const adminBaseUrl = `${url}/admin/realms/${realm}`;

    return {
        url,
        realm,
        clientId,
        issuer,
        jwksUrl,
        tokenUrl,
        adminRealm,
        adminTokenUrl,
        adminBaseUrl,
        expectedAudience: process.env.KEYCLOAK_AUDIENCE || clientId,
        adminClientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID,
        adminClientSecret: process.env.KEYCLOAK_ADMIN_CLIENT_SECRET,
    };
}

function getJwks(jwksUrl) {
    if (!jwksCache || jwksCache.url !== jwksUrl) {
        jwksCache = {
            url: jwksUrl,
            set: createRemoteJWKSet(new URL(jwksUrl)),
        };
    }
    return jwksCache.set;
}

function collectRoles(payload, clientId) {
    const roles = new Set();

    if (Array.isArray(payload?.realm_access?.roles)) {
        payload.realm_access.roles.forEach((role) => roles.add(role));
    }

    const resourceAccess = payload?.resource_access;
    if (resourceAccess && typeof resourceAccess === 'object') {
        for (const [resource, access] of Object.entries(resourceAccess)) {
            if (resource !== clientId && resource !== 'account') continue;
            if (Array.isArray(access?.roles)) {
                access.roles.forEach((role) => roles.add(role));
            }
        }
    }

    return roles;
}

export function extractAppRole(payload, clientId) {
    const roles = collectRoles(payload, clientId);
    return APP_ROLES.find((role) => roles.has(role)) || null;
}

function hasExpectedAudience(payload, expectedAudience) {
    const audience = payload.aud;
    const authorizedParty = payload.azp;

    if (typeof audience === 'string') {
        return audience === expectedAudience || authorizedParty === expectedAudience;
    }

    if (Array.isArray(audience)) {
        return audience.includes(expectedAudience) || authorizedParty === expectedAudience;
    }

    return authorizedParty === expectedAudience;
}

export async function verifyKeycloakToken(token) {
    const config = getKeycloakConfig();
    const { payload } = await jwtVerify(token, getJwks(config.jwksUrl), {
        issuer: config.issuer,
    });

    if (!hasExpectedAudience(payload, config.expectedAudience)) {
        throw new Error(`Token audience mismatch. Expected audience or azp "${config.expectedAudience}".`);
    }

    return {
        payload,
        role: extractAppRole(payload, config.clientId),
    };
}

export function isKeycloakAdminConfigured() {
    const config = getKeycloakConfig();
    return Boolean(config.adminClientId && config.adminClientSecret);
}

async function getAdminAccessToken() {
    const now = Date.now();
    if (adminTokenCache.accessToken && adminTokenCache.expiresAt > now + 30_000) {
        return adminTokenCache.accessToken;
    }

    const config = getKeycloakConfig();

    if (!config.adminClientId || !config.adminClientSecret) {
        throw new Error('Keycloak admin provisioning is not configured.');
    }

    const response = await fetch(config.adminTokenUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: config.adminClientId,
            client_secret: config.adminClientSecret,
        }),
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Failed to obtain Keycloak admin token: ${response.status} ${body}`);
    }

    const data = await response.json();
    adminTokenCache = {
        accessToken: data.access_token,
        expiresAt: now + (Math.max(30, (data.expires_in || 60) - 15) * 1000),
    };

    return adminTokenCache.accessToken;
}

async function keycloakAdminRequest(path, init = {}) {
    const config = getKeycloakConfig();
    const accessToken = await getAdminAccessToken();

    const response = await fetch(`${config.adminBaseUrl}${path}`, {
        ...init,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            ...(init.body ? { 'Content-Type': 'application/json' } : {}),
            ...(init.headers || {}),
        },
    });

    if (!response.ok) {
        const body = await response.text();
        throw new Error(`Keycloak admin request failed (${response.status}): ${body}`);
    }

    return response;
}

async function findKeycloakUserByEmail(email) {
    const response = await keycloakAdminRequest(`/users?email=${encodeURIComponent(email)}&exact=true`);
    const users = await response.json();
    return Array.isArray(users) ? users[0] || null : null;
}

async function getRealmRole(roleName) {
    const response = await keycloakAdminRequest(`/roles/${encodeURIComponent(roleName)}`);
    return response.json();
}

async function replaceRealmRoles(userId, roleName) {
    const currentResponse = await keycloakAdminRequest(`/users/${userId}/role-mappings/realm`);
    const currentRoles = await currentResponse.json();
    const appRoles = Array.isArray(currentRoles) ? currentRoles.filter((role) => APP_ROLES.includes(role.name)) : [];

    if (appRoles.length > 0) {
        await keycloakAdminRequest(`/users/${userId}/role-mappings/realm`, {
            method: 'DELETE',
            body: JSON.stringify(appRoles),
        });
    }

    const targetRole = await getRealmRole(roleName);
    await keycloakAdminRequest(`/users/${userId}/role-mappings/realm`, {
        method: 'POST',
        body: JSON.stringify([targetRole]),
    });
}

export async function provisionKeycloakUser({ email, name, role, tempPassword }) {
    if (!isKeycloakAdminConfigured()) {
        throw new Error('Keycloak admin provisioning is not configured.');
    }

    const existing = await findKeycloakUserByEmail(email);
    if (existing) {
        throw new Error('A Keycloak user with this email already exists.');
    }

    const createResponse = await keycloakAdminRequest('/users', {
        method: 'POST',
        body: JSON.stringify({
            username: email,
            email,
            enabled: true,
            emailVerified: process.env.NODE_ENV !== 'production',
            firstName: name,
            requiredActions: ['UPDATE_PASSWORD'],
        }),
    });

    const location = createResponse.headers.get('location');
    const keycloakUserId = location?.split('/').pop();
    const fallbackUser = keycloakUserId ? null : await findKeycloakUserByEmail(email);
    const userId = keycloakUserId || fallbackUser?.id;

    if (!userId) {
        throw new Error('Failed to determine the created Keycloak user ID.');
    }

    await keycloakAdminRequest(`/users/${userId}/reset-password`, {
        method: 'PUT',
        body: JSON.stringify({
            type: 'password',
            value: tempPassword,
            temporary: true,
        }),
    });

    await replaceRealmRoles(userId, role);

    return { id: userId };
}

export async function syncKeycloakUser({ keycloakUserId, email, name, role, isActive }) {
    if (!keycloakUserId || !isKeycloakAdminConfigured()) return;

    const payload = {};
    if (typeof email === 'string') {
        payload.email = email;
        payload.username = email;
    }
    if (typeof name === 'string') {
        payload.firstName = name;
    }
    if (typeof isActive === 'boolean') {
        payload.enabled = isActive;
    }

    if (Object.keys(payload).length > 0) {
        await keycloakAdminRequest(`/users/${keycloakUserId}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
        });
    }

    if (role) {
        await replaceRealmRoles(keycloakUserId, role);
    }
}

export async function disableKeycloakUser(keycloakUserId) {
    if (!keycloakUserId || !isKeycloakAdminConfigured()) return;

    await keycloakAdminRequest(`/users/${keycloakUserId}`, {
        method: 'PUT',
        body: JSON.stringify({ enabled: false }),
    });
}

export async function deleteKeycloakUser(keycloakUserId) {
    if (!keycloakUserId || !isKeycloakAdminConfigured()) return;

    await keycloakAdminRequest(`/users/${keycloakUserId}`, {
        method: 'DELETE',
    });
}
