import NodeCache from "node-cache";

// Initialize the cache with a default TTL of 5 minutes (300 seconds)
// checkperiod helps clean up expired keys automatically
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

/**
 * Middleware to cache the API response for a specific route.
 * @param {number} duration - The cache TTL in seconds. Overrides default if provided.
 */
export function cacheRoute(duration) {
    return (req, res, next) => {
        // Only cache GET requests
        if (req.method !== "GET") {
            return next();
        }

        // Use the request URL as the cache key
        const key = req.originalUrl;
        const cachedResponse = cache.get(key);

        if (cachedResponse) {
            console.log(`[Cache Hit] Serving ${key} from memory`);
            return res.json(cachedResponse);
        }

        console.log(`[Cache Miss] Fetching ${key} from database`);

        // Override res.json to intercept the response and cache it
        const originalJson = res.json.bind(res);
        res.json = (body) => {
            // Only cache successful responses (HTTP 200-299)
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (duration) {
                    cache.set(key, body, duration);
                } else {
                    cache.set(key, body);
                }
            }
            return originalJson(body);
        };

        next();
    };
}

/**
 * Clear a specific cache key (URL)
 * @param {string} key - The exact URL to clear from cache
 */
export function clearCache(key) {
    cache.del(key);
    console.log(`[Cache Cleared] Key: ${key}`);
}

/**
 * Clear multiple cache keys based on a prefix
 * @param {string} prefix - The start of the URL (e.g., '/api/dashboard')
 */
export function clearCacheByPrefix(prefix) {
    const keys = cache.keys();
    const keysToDelete = keys.filter(key => key.startsWith(prefix));
    if (keysToDelete.length > 0) {
        cache.del(keysToDelete);
        console.log(`[Cache Cleared] Prefix: ${prefix}, Keys: ${keysToDelete.join(", ")}`);
    }
}
