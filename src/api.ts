// Automatically switches: Vercel? -> Cloud URL. Local? -> Localhost.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
    // Auth
    login: async (username: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Login failed');
        const data = await res.json();
        localStorage.setItem('token', data.token);
        return data;
    },

    register: async (username: string, password: string) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        if (!res.ok) throw new Error('Registration failed');
        return await res.json();
    },

    // Vault
    getVaultItems: async () => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/vault`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to fetch items');
        const data = await res.json();

        import { security } from './utils/security';

        // ... (inside getVaultItems)

        // CLIENT-SIDE DECRYPTION:
        // The DB returns ciphertext (e.g. "aGW8..."). We must decrypt it here.
        return data.map((item: any) => ({
            ...item,
            password: security.decrypt(item.encryptedData)
        }));
    },

    createVaultItem: async (item: any) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/vault`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(item)
        });
        if (!res.ok) throw new Error('Failed to create item');
        return await res.json();
    },

    deleteVaultItem: async (id: string) => {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/vault/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error('Failed to delete item');
        return await res.json();
    }
};
