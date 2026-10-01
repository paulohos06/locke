const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const VAULT_FILE = path.join(__dirname, "..", "cofre.dat");
const ALGORITHM = "aes-256-gcm";
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const PBKDF2_ITERATIONS = 600000;


function derivarChave(senha, salt) {
    return crypto.pbkdf2Sync(
        senha,
        salt,
        PBKDF2_ITERATIONS,
        KEY_LENGTH,
        "sha256"
    );
}


function vaultExists() {
    return fs.existsSync(VAULT_FILE);
}


function createEmptyVault() {
    return {
        version: 1,
        credentials: []
    };
}


function saveVault(vault, masterPassword) {
    const salt = crypto.randomBytes(SALT_LENGTH);
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = derivarChave(masterPassword, salt);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const json = JSON.stringify(vault);

    const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    const arquivo = Buffer.concat([salt, iv, authTag, encrypted]);

    fs.writeFileSync(VAULT_FILE, arquivo);
}

function loadVault(masterPassword) {

    const arquivo =
        fs.readFileSync(
            VAULT_FILE
        );

    const salt =
        arquivo.subarray(
            0,
            SALT_LENGTH
        );

    const iv =
        arquivo.subarray(
            SALT_LENGTH,
            SALT_LENGTH + IV_LENGTH
        );

    const authTag =
        arquivo.subarray(
            SALT_LENGTH + IV_LENGTH,
            SALT_LENGTH +
            IV_LENGTH +
            AUTH_TAG_LENGTH
        );

    const encrypted =
        arquivo.subarray(
            SALT_LENGTH +
            IV_LENGTH +
            AUTH_TAG_LENGTH
        );

    const key =
        derivarChave(
            masterPassword,
            salt
        );

    const decipher =
        crypto.createDecipheriv(
            ALGORITHM,
            key,
            iv
        );

    decipher.setAuthTag(authTag);

    const decrypted =
        Buffer.concat([
            decipher.update(encrypted),
            decipher.final()
        ]);

    return JSON.parse(
        decrypted.toString("utf8")
    );
}


module.exports = {
    vaultExists,
    createEmptyVault,
    saveVault,
    loadVault
};
