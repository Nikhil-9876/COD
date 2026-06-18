function normalizeOrigin(value, fallback) {
    const raw = String(value || '').trim();
    if (!raw) return fallback;

    try {
        return new URL(raw).origin;
    } catch {
        return fallback;
    }
}

export function getFrontendOrigin() {
    return normalizeOrigin(process.env.FRONTEND_ORIGIN, 'http://localhost:5173');
}

export function getPublicApiOrigin() {
    return normalizeOrigin(process.env.PUBLIC_API_ORIGIN, 'http://localhost:3001');
}
