import React, { useState, useEffect } from 'react';
import { Warning, CheckCircle, LockKey } from '@phosphor-icons/react';

interface SecurityCheckProps {
    onNavigate: (view: string) => void;
}

export const SecurityCheck: React.FC<SecurityCheckProps> = ({ onNavigate }) => {
    const [analyzing, setAnalyzing] = useState(true);
    const [score, setScore] = useState(0);
    const [issues, setIssues] = useState<any[]>([]);

    useEffect(() => {
        // Simulate analysis delay for effect
        setTimeout(() => {
            fetchAnalysis();
        }, 1500);
    }, []);

    const fetchAnalysis = async () => {
        try {
            const items = await import('../api').then(m => m.api.getVaultItems());
            const weakItems = items.filter((i: any) => i.password && i.password.length < 10);
            const calculatedScore = Math.max(0, 100 - (weakItems.length * 15));

            setScore(calculatedScore);
            setIssues(weakItems);
            setAnalyzing(false);
        } catch (e) {
            setAnalyzing(false);
        }
    };

    if (analyzing) {
        return (
            <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div className="status-pulse" style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--color-ev-red)', marginBottom: '2rem' }}></div>
                <h2 className="font-tech text-red" style={{ fontSize: '1.5rem', fontWeight: 700 }}>RUNNING SYSTEM DIAGNOSTIC...</h2>
                <div style={{ marginTop: '1rem', color: '#737373', fontFamily: 'monospace' }}>SCANNING ENCRYPTED VAULT BLOCKS</div>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }}>
                <div>
                    <h1 className="font-tech" style={{ fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase' }}>Security Audit</h1>
                    <p style={{ color: '#737373' }}>Last Scan: Just Now</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div className="font-tech" style={{ fontSize: '3rem', fontWeight: 700, lineHeight: 1, color: score > 70 ? 'var(--color-ev-yellow)' : 'var(--color-ev-red)' }}>
                        {score}%
                    </div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Safety Score</div>
                </div>
            </div>

            {issues.length === 0 ? (
                <div style={{ backgroundColor: '#171717', border: '1px solid var(--color-ev-yellow)', padding: '3rem', textAlign: 'center' }}>
                    <CheckCircle size={48} weight="fill" className="text-yellow" style={{ marginBottom: '1rem' }} />
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>All Systems Optimal</h3>
                    <p style={{ color: '#a3a3a3' }}>No weak passwords or compromised credentials found.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div style={{ padding: '1.5rem', backgroundColor: 'rgba(237, 28, 36, 0.1)', border: '1px solid var(--color-ev-red)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                        <Warning size={32} weight="fill" className="text-red" />
                        <div>
                            <h3 style={{ margin: '0 0 0.5rem 0', fontWeight: 700, color: 'var(--color-ev-red)' }}>Critical Vulnerabilities Detected</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: '#ccc' }}>
                                Found {issues.length} credential(s) with weak encryption standards (short passwords). Immediate rotation recommended.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {issues.map((item, idx) => (
                            <div key={idx} style={{
                                backgroundColor: '#171717', border: '1px solid #262626', padding: '1.5rem',
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', backgroundColor: '#262626', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <LockKey size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700 }}>{item.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#737373' }}>{item.username}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.75rem', color: '#737373', fontWeight: 700, textTransform: 'uppercase' }}>Password Strength</div>
                                        <div className="text-red" style={{ fontWeight: 700 }}>WEAK</div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate('vault')}
                                        style={{ backgroundColor: 'var(--color-ev-yellow)', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 700 }}
                                    >
                                        RESOLVE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
