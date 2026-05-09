import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = parseInt(process.env.AES_IV_LENGTH || '12', 10);
const AUTH_TAG_LENGTH = 16;

function getKey() {
    const hex = process.env.AES_ENCRYPTION_KEY;
    if (!hex || hex.length !== 64) {
        throw new Error('AES_ENCRYPTION_KEY must be a 64-character hex string (32 bytes)');
    }
    return Buffer.from(hex, 'hex');
}

/**
 * Encrypt plaintext with AES-256-GCM.
 * Returns a string: iv:authTag:ciphertext (all hex-encoded).
 */
export function encrypt(plaintext) {
    const key = getKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');

    return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypt a string produced by encrypt().
 * @param {string} encryptedStr  Format: iv:authTag:ciphertext (hex)
 */
export function decrypt(encryptedStr) {
    const key = getKey();
    const [ivHex, authTagHex, ciphertext] = encryptedStr.split(':');

    if (!ivHex || !authTagHex || !ciphertext) {
        throw new Error('Invalid encrypted data format');
    }

    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(ciphertext, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
