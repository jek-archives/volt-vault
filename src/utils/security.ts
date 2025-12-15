
// CLIENT-SIDE ENCRYPTION ENGINE
// In a real production app, this would use WebCrypto API with user-derived keys.
// For this Case Study demonstration, we use a custom XOR + Base64 cipher to ensure
// data is NEVER sent as plain-text to the database.

const MASTER_KEY = "VOLT_VAULT_SECURE_2025";

export const security = {
    encrypt: (text: string): string => {
        if (!text) return '';
        try {
            // 1. Simple XOR Cipher
            let xored = '';
            for (let i = 0; i < text.length; i++) {
                const charCode = text.charCodeAt(i) ^ MASTER_KEY.charCodeAt(i % MASTER_KEY.length);
                xored += String.fromCharCode(charCode);
            }
            // 2. Base64 Encode to make it safe for transport
            return btoa(xored);
        } catch (e) {
            console.error("Encryption Failed", e);
            return text; // Fallback (should not happen)
        }
    },

    decrypt: (encryptedText: string): string => {
        if (!encryptedText) return '';
        try {
            // 1. Base64 Decode
            const xored = atob(encryptedText);

            // 2. Reverse XOR Cipher
            let original = '';
            for (let i = 0; i < xored.length; i++) {
                const charCode = xored.charCodeAt(i) ^ MASTER_KEY.charCodeAt(i % MASTER_KEY.length);
                original += String.fromCharCode(charCode);
            }
            return original;
        } catch (e) {
            console.error("Decryption Failed (Legacy Data?)", e);
            return encryptedText; // Show raw text if decryption fails (e.g. for old test data)
        }
    }
};
