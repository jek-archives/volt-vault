import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, User, Bell, Shield, Cloud } from '@phosphor-icons/react';

export const Settings: React.FC = () => {
    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h2 className="font-tech" style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', textTransform: 'uppercase', color: 'white' }}>
                System Configuration
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <SettingsSection title="Account Security" icon={<Shield weight="fill" className="text-yellow" />}>
                    <SettingsRow label="Two-Factor Authentication" description="Require TOTP for login" enabled={true} />
                    <SettingsRow label="Biometric Access" description="Allow Windows Hello / TouchID" enabled={false} />
                    <SettingsRow label="Auto-Lock Vault" description="Lock after 5 minutes of inactivity" enabled={true} />
                </SettingsSection>

                <SettingsSection title="Cloud Sync" icon={<Cloud weight="fill" className="text-yellow" />}>
                    <SettingsRow label="Encrypted Backup" description="Daily backup to verified server" enabled={true} />
                    <SettingsRow label="Cross-Device Sync" description="Sync with mobile application" enabled={true} />
                </SettingsSection>

                <SettingsSection title="Notifications" icon={<Bell weight="fill" className="text-yellow" />}>
                    <SettingsRow label="Security Alerts" description="Notify on new login attempts" enabled={true} />
                    <SettingsRow label="Password Expiry" description="Remind to rotate credentials" enabled={false} />
                </SettingsSection>
            </div>

            <div style={{ marginTop: '3rem', textAlign: 'center', color: '#404040', fontSize: '0.75rem' }}>
                VOLTVAULT ENTERPRISE v2.4.0 <br />
                SECURE INSTANCE ID: {Math.random().toString(36).substring(7).toUpperCase()}
            </div>
        </div>
    );
};

const SettingsSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div style={{ backgroundColor: '#171717', border: '1px solid #262626', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ padding: '1rem', borderBottom: '1px solid #262626', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {icon}
            <span className="font-tech" style={{ fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</span>
        </div>
        <div>
            {children}
        </div>
    </div>
);

const SettingsRow: React.FC<{ label: string, description: string, enabled: boolean }> = ({ label, description, enabled }) => {
    const [isOn, setIsOn] = useState(enabled);
    return (
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <div style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>{label}</div>
                <div style={{ color: '#737373', fontSize: '0.75rem' }}>{description}</div>
            </div>
            <div onClick={() => setIsOn(!isOn)} style={{ cursor: 'pointer', color: isOn ? 'var(--color-ev-yellow)' : '#404040', transition: 'color 0.2s ease' }}>
                {isOn ? <ToggleRight weight="fill" size={32} /> : <ToggleLeft weight="fill" size={32} />}
            </div>
        </div>
    );
};
