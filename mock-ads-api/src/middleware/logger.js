/**
 * Request logger middleware
 * Logs method, full path, timestamp, and response time for every request
 */
module.exports = (req, res, next) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} — ${res.statusCode} (${duration}ms)`
        );
    });

    next();
};
