/**
 * Meta Ads Auth Middleware
 * - Requires `access_token` query parameter (NOT Authorization header)
 * - Uses crypto.timingSafeEqual for token comparison
 */
const crypto = require('crypto');

module.exports = (req, res, next) => {
    const accessToken = req.query.access_token;

    // Check access_token query param exists
    if (!accessToken) {
        return res.status(400).json({
            error: {
                message: 'An access token is required to request this resource.',
                type: 'OAuthException',
                code: 104,
                fbtrace_id: 'mock-trace-id-missing'
            }
        });
    }

    // Compare token
    const expected = process.env.META_ADS_ACCESS_TOKEN || '';

    if (!safeCompare(accessToken, expected)) {
        return res.status(401).json({
            error: {
                message: 'Invalid OAuth access token - Cannot parse access token',
                type: 'OAuthException',
                code: 190,
                error_subcode: 460,
                fbtrace_id: 'mock-trace-id-invalid'
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
