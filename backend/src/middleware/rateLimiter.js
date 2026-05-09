import rateLimit from 'express-rate-limit';

/**
 * Login rate limiter: max 5 failed attempts per IP → 15 minute lockout.
 */
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    skipSuccessfulRequests: true, // only count failed attempts
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts. Please try again in 15 minutes.' },
    keyGenerator: (req) => req.ip,
});

/**
 * Forgot-password rate limiter: max 3 requests per email per hour.
 */
export const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many password reset requests. Please try again later.' },
    keyGenerator: (req) => {
        // Key by email if provided, otherwise by IP
        return req.body?.email?.toLowerCase?.() || req.ip;
    },
});
