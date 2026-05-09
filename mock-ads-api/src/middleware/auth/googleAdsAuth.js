/**
 * Google Ads Auth Middleware
 * - Requires `Authorization: Bearer <token>` header
 * - Requires `developer-token` header (any non-empty value)
 * - Uses crypto.timingSafeEqual for token comparison
 */
const crypto = require('crypto');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const devToken = req.headers['developer-token'];

    // Check Authorization header exists and is Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: {
                code: 401,
                message: 'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.',
                status: 'UNAUTHENTICATED',
                details: [
                    {
                        '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                        reason: 'ACCESS_TOKEN_INVALID',
                        domain: 'googleapis.com',
                        metadata: {}
                    }
                ]
            }
        });
    }

    // Extract and compare token
    const token = authHeader.slice(7);
    const expected = process.env.GOOGLE_ADS_ACCESS_TOKEN || '';

    if (!safeCompare(token, expected)) {
        return res.status(401).json({
            error: {
                code: 401,
                message: 'Request had invalid authentication credentials. Expected OAuth 2 access token, login cookie or other valid authentication credential.',
                status: 'UNAUTHENTICATED',
                details: [
                    {
                        '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                        reason: 'ACCESS_TOKEN_INVALID',
                        domain: 'googleapis.com',
                        metadata: {}
                    }
                ]
            }
        });
    }

    // Check developer-token header
    if (!devToken) {
        return res.status(403).json({
            error: {
                code: 403,
                message: 'The caller does not have permission.',
                status: 'PERMISSION_DENIED',
                details: [
                    {
                        '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
                        reason: 'DEVELOPER_TOKEN_NOT_APPROVED',
                        domain: 'googleapis.com',
                        metadata: {}
                    }
                ]
            }
        });
    }

    next();
};

function safeCompare(a, b) {
    if (a.length !== b.length) return false;
    try {
        return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
    } catch {
        return false;
    }
}
