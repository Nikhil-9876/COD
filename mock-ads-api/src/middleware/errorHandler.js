/**
 * Global error handler middleware
 * Returns platform-specific error shapes based on the route prefix
 */
module.exports = (err, req, res, _next) => {
    console.error(`[ERROR] ${err.message}`);

    const path = req.originalUrl;

    // Google Ads error format
    if (path.startsWith('/api/google-ads')) {
        return res.status(err.status || 500).json({
            error: {
                code: err.status || 500,
                message: err.message || 'Internal server error.',
                status: 'INTERNAL',
                details: [
                    {
                        '@type': 'type.googleapis.com/google.ads.googleads.v18.errors.GoogleAdsFailure',
                        errors: [
                            {
                                errorCode: { internalError: 'INTERNAL_ERROR' },
                                message: err.message || 'An internal error occurred.'
                            }
                        ],
                        requestId: `mock-request-id-${Date.now()}`
                    }
                ]
            }
        });
    }

    // Meta Ads error format
    if (path.startsWith('/api/meta-ads')) {
        return res.status(err.status || 500).json({
            error: {
                message: err.message || 'An unknown error occurred.',
                type: 'OAuthException',
                code: err.status || 500,
                error_subcode: 0,
                fbtrace_id: `mock-trace-id-${Date.now()}`
            }
        });
    }

    // LinkedIn Ads error format
    if (path.startsWith('/api/linkedin-ads')) {
        return res.status(err.status || 500).json({
            status: err.status || 500,
            serviceErrorCode: 0,
            code: 'INTERNAL_SERVER_ERROR',
            message: err.message || 'An internal error occurred.'
        });
    }

    // Twitter Ads error format
    if (path.startsWith('/api/twitter-ads')) {
        return res.status(err.status || 500).json({
            errors: [
                {
                    code: 131,
                    message: err.message || 'Internal error.',
                    label: 'INTERNAL_ERROR'
                }
            ],
            request: {
                params: {}
            }
        });
    }

    // Generic fallback
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
};
