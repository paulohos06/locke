const crypto = require("crypto");

const PBKDF2_ITERATIONS = 600_000;
const KEY_LENGTH = 32; // 256 bits
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

function deriveKey(masterPassword, salt) {
    return crypto.pbkdf2Sync(
        Buffer.from(masterPassword, "utf8"),
        salt,
        PBKDF2_ITERATIONS,
        KEY_LENGTH,
        "sha256"
    );
}

function encrypt(data, masterPassword) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);

    const key = deriveKey(masterPassword, salt);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv, { authTagLength: AUTH_TAG_LENGTH });
    const plaintext = Buffer.from(JSON.stringify(data), "utf8");
    const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
        version: 1,
        algorithm: "aes-256-gcm",
        kdf: "pbkdf2-sha256",
        iterations: PBKDF2_ITERATIONS,
        salt: salt.toString("base64"),
        iv: iv.toString("base64"),
        authTag: authTag.toString("base64"),
        data: encrypted.toString("base64")
    };
}

function decrypt(payload, masterPassword) {
    if (!payload || payload.algorithm !== "aes-256-gcm") {
        throw new Error("Formato de cofre não suportado.");
    }

    const salt = Buffer.from(payload.salt, "base64");
    const iv = Buffer.from(payload.iv, "base64");
    const authTag = Buffer.from(payload.authTag, "base64");
    const encrypted = Buffer.from(payload.data, "base64");

    const key = deriveKey(masterPassword, salt);

    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        iv,
        {
            authTagLength: AUTH_TAG_LENGTH
        }
    );

    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
    ]);

    return JSON.parse(
        decrypted.toString("utf8")
    );
}

module.exports = {
    encrypt,
    decrypt
};
