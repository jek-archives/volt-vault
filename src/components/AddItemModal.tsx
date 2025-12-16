import React, { useState } from 'react';
import { X, FloppyDisk, LockKey, User, Pen, CreditCard } from '@phosphor-icons/react';
import { api } from '../api';
import { security } from '../utils/security';

interface AddItemModalProps {
    onClose: () => void;
    onSuccess: () => void;
    initialData?: any; // Optional: If provided, we are in EDIT mode
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSuccess, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        username: initialData?.username || '',
        password: initialData?.password || '', // Already decrypted by the UI before passing here? Or we use it as is?
        // Wait, 'initialData' comes from VaultList/App where 'password' IS decrypted (via api.ts).
        // So we can just use it.
        url: initialData?.url || '',
        type: initialData?.type || 'login'
    });
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                type: formData.type as 'login' | 'card' | 'note',
                name: formData.name,
                username: formData.username,
                // password: formData.password, // REMOVED: Never send plain text
                url: formData.url,
                // ENCRYPTION:
                // Whether adding or editing, we encrypt the current password state.
                encryptedData: security.encrypt(formData.password),
                iv: 'iv-' + Date.now(),
                favorite: initialData?.favorite || false
            };

            if (isEditMode) {
                await api.updateVaultItem(initialData.id, payload);
            } else {
                await api.createVaultItem(payload);
            }
            onSuccess();
        } catch (err) {
            alert(isEditMode ? 'Failed to update item.' : 'Failed to save item.');
            setLoading(false);
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: '#171717',
                border: '1px solid #404040',
                width: '100%', maxWidth: '500px',
                position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                {/* Header */}
                <div className="diagonal-stripe" style={{ padding: '1.5rem', borderBottom: '1px solid #262626', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 className="font-tech" style={{ fontSize: '1.5rem', fontWeight: 700, textTransform: 'uppercase' }}>
                        {isEditMode ? 'Edit Secure Entry' : 'New Secure Entry'}
                    </h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#737373', cursor: 'pointer' }}>
                        <X size={24} weight="bold" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Access Type */}
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                        {['login', 'card', 'note'].map(t => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setFormData({ ...formData, type: t })}
                                style={{
                                    flex: 1, padding: '0.75rem',
                                    backgroundColor: formData.type === t ? 'var(--color-ev-yellow)' : 'transparent',
                                    color: formData.type === t ? 'black' : '#737373',
                                    border: formData.type === t ? '1px solid var(--color-ev-yellow)' : '1px solid #404040',
                                    fontWeight: 700, textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em',
                                    cursor: 'pointer'
                                }}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>Entry Name</label>
                        <div style={{ position: 'relative' }}>
                            <Pen size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            <input
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Corporate Email"
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                    backgroundColor: '#0a0a0a', border: '1px solid #262626', color: 'white',
                                    fontFamily: 'monospace'
                                }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>
                            {formData.type === 'card' ? 'Card Number' : 'Username / ID'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            {formData.type === 'card' ?
                                <CreditCard size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} /> :
                                <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            }
                            <input
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                placeholder={formData.type === 'card' ? "0000 0000 0000 0000" : "e.g. user@company.com"}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                    backgroundColor: '#0a0a0a', border: '1px solid #262626', color: 'white',
                                    fontFamily: 'monospace'
                                }}
                            />
                        </div>
                    </div>

                    <div className="input-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#737373', textTransform: 'uppercase' }}>
                            {formData.type === 'card' ? 'CVV / Security Code' : 'Password'}
                        </label>
                        <div style={{ position: 'relative' }}>
                            <LockKey size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                            <input
                                type={formData.type === 'card' ? "text" : "password"}
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder={formData.type === 'card' ? "123" : "••••••••••••"}
                                style={{
                                    width: '100%', padding: '1rem 1rem 1rem 3rem',
                                    backgroundColor: '#0a0a0a', border: '1px solid #262626', color: 'white',
                                    fontFamily: 'monospace'
                                }}
                            />
                        </div>
                    </div>

                    <button
                        disabled={loading}
                        style={{
                            marginTop: '1rem',
                            backgroundColor: 'var(--color-ev-red)', color: 'white',
                            padding: '1rem', border: 'none',
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}
                    >
                        {loading ? 'Encrypting...' : <><FloppyDisk size={20} weight="bold" /> {isEditMode ? 'Update Vault' : 'Save to Vault'}</>}
                    </button>

                </form>
            </div>
        </div>
    );
};
