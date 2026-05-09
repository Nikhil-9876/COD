/**
 * LinkedIn Ads Auth Middleware
 * - Requires `Authorization: Bearer <token>` header
 * - Requires `X-Restli-Protocol-Version: 2.0.0` header
 * - Uses crypto.timingSafeEqual for token comparison
 */
const crypto = require('crypto');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const protocolVersion = req.headers['x-restli-protocol-version'];

    // Check Authorization header exists and is Bearer format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            status: 401,
            serviceErrorCode: 65600,
            code: 'UNAUTHORIZED',
            message: 'Empty oauth2 access token'
        });
    }

    // Extract and compare token
    const token = authHeader.slice(7);
    const expected = process.env.LINKEDIN_ADS_ACCESS_TOKEN || '';

    if (!safeCompare(token, expected)) {
        return res.status(401).json({
            status: 401,
            serviceErrorCode: 65601,
            code: 'UNAUTHORIZED',
            message: 'The token used in the request has been revoked by the user'
        });
    }

    // Check X-Restli-Protocol-Version header
    if (!protocolVersion || protocolVersion !== '2.0.0') {
        return res.status(400).json({
            status: 400,
            serviceErrorCode: 0,
            code: 'BAD_REQUEST',
            message: 'X-Restli-Protocol-Version header is missing or invalid. Must be 2.0.0'
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
