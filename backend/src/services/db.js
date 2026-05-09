import pg from 'pg';

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 20,
    idleTimeoutMillis: 10000,
    connectionTimeoutMillis: 20000,
    allowExitOnIdle: true,
});

pool.on('error', (err) => {
    console.error('Unexpected PostgreSQL pool error:', err.message);
});

/**
 * Execute a parameterised query.
 * @param {string} text  SQL with $1, $2… placeholders
 * @param {any[]}  params  Values for the placeholders
 */
export function query(text, params) {
    return pool.query(text, params);
}

/**
 * Get a dedicated client for transactions.
 */
export function getClient() {
    return pool.connect();
}

export default pool;
