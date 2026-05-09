/**
 * Twitter/X Ads Auth Middleware
 * - Requires `Authorization: OAuth ...` header (OAuth 1.0a style)
 * - Extracts oauth_token from header and compares against env var
 * - Uses crypto.timingSafeEqual for token comparison
 */
const crypto = require('crypto');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    // Check Authorization header exists
    if (!authHeader) {
        return res.status(401).json({
            errors: [
                {
                    code: 135,
                    message: 'Timestamp out of bounds.',
                    label: 'TIMESTAMP_OUT_OF_BOUNDS'
                }
            ],
            request: { params: {} }
        });
    }

    // Must start with "OAuth "
    if (!authHeader.startsWith('OAuth ')) {
        return res.status(401).json({
            errors: [
                {
                    code: 32,
                    message: 'Could not authenticate you.',
                    label: 'AUTHENTICATION_ERROR'
                }
            ],
            request: { params: {} }
        });
    }

    // Extract oauth_token value from header
    const tokenMatch = authHeader.match(/oauth_token="([^"]+)"/);
    if (!tokenMatch) {
        return res.status(401).json({
            errors: [
                {
                    code: 32,
                    message: 'Could not authenticate you.',
                    label: 'AUTHENTICATION_ERROR'
                }
            ],
            request: { params: {} }
        });
    }

    // Compare token
    const token = tokenMatch[1];
    const expected = process.env.TWITTER_ADS_ACCESS_TOKEN || '';

    if (!safeCompare(token, expected)) {
        return res.status(401).json({
            errors: [
                {
                    code: 32,
                    message: 'Could not authenticate you.',
                    label: 'AUTHENTICATION_ERROR'
                }
            ],
            request: { params: {} }
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
