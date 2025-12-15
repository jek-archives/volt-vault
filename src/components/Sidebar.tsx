import React, { useState, useEffect } from 'react';
import { Lightning, CirclesFour, Vault, CreditCard, Password, ShieldCheck, GearSix, List, SignOut } from '@phosphor-icons/react';
import defaultProfile from '../assets/default_profile.jpg';

interface SidebarProps {
    view: string;
    setView: (view: string) => void;
    onLogout: () => void;
    totalItems: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ view, setView, onLogout, totalItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { id: 'dashboard', icon: CirclesFour, label: 'Dashboard' },
        { id: 'vault', icon: Vault, label: 'Logins' },
        { id: 'cards', icon: CreditCard, label: 'Payment Cards' },
        { id: 'generator', icon: Password, label: 'Generator' },
        { id: 'security', icon: ShieldCheck, label: 'Security Check' },
        { id: 'settings', icon: GearSix, label: 'Settings' },
    ];

    return (
        <>
            {/* MOBILE TOGGLE */}
            {isMobile && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    style={{
                        position: 'fixed', top: '1rem', left: '1rem', zIndex: 60,
                        backgroundColor: 'black', color: 'white', border: '1px solid #404040',
                        padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                >
                    <List size={24} />
                </button>
            )}

            {/* SIDEBAR CONTAINER */}
            <aside style={{
                position: 'fixed',
                left: 0, top: 0, bottom: 0,
                width: 'var(--sidebar-width)',
                backgroundColor: 'black',
                borderRight: '1px solid #171717',
                display: 'flex', flexDirection: 'column',
                zIndex: 50,
                transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'none',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
            }}>

                {/* LOGO AREA (Desktop) */}
                {!isMobile && (
                    <div style={{ padding: '2rem', borderBottom: '1px solid #262626' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#737373', letterSpacing: '0.1em' }}>VAULT STATUS</div>
                            {totalItems > 0 && <span style={{ backgroundColor: 'var(--color-ev-red)', color: 'white', fontSize: '0.65rem', padding: '2px 6px', fontWeight: 700 }}>{totalItems} ITEMS</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{
                                width: '40px', height: '40px',
                                backgroundColor: 'var(--color-ev-yellow)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)'
                            }}>
                                <Lightning weight="fill" size={24} color="black" />
                            </div>
                            <div className="font-tech" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                                VOLT<span className="text-yellow">VAULT</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* USER PROFILE SNIPPET */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #262626', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img
                            src={defaultProfile}
                            alt="Profile"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #404040' }}
                        />
                        <div style={{ position: 'absolute', bottom: -2, right: -2, width: '12px', height: '12px', backgroundColor: 'var(--color-ev-green)', borderRadius: '50%', border: '2px solid black' }}></div>
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>Jek Lloyd</div>
                        <div style={{ fontSize: '0.75rem', color: '#737373' }}>IT Admin</div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <nav style={{ flex: 1, padding: '1.5rem 0' }}>
                    {menuItems.map(item => {
                        const active = view === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setView(item.id);
                                    if (isMobile) setIsOpen(false);
                                }}
                                style={{
                                    width: '100%',
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '1rem 1.5rem',
                                    backgroundColor: active ? '#171717' : 'transparent',
                                    border: 'none',
                                    borderLeft: active ? '4px solid var(--color-ev-yellow)' : '4px solid transparent',
                                    color: active ? 'white' : '#a3a3a3',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    textAlign: 'left'
                                }}
                                className="sidebar-item"
                            >
                                <item.icon size={20} weight={active ? 'fill' : 'regular'} color={active ? 'var(--color-ev-yellow)' : 'currentColor'} />
                                <span style={{ fontWeight: active ? 700 : 400, fontSize: '0.875rem' }}>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                {/* FOOTER */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid #262626' }}>
                    <button
                        onClick={onLogout}
                        style={{
                            width: '100%',
                            display: 'flex', alignItems: 'center', gap: '0.75rem',
                            padding: '0.75rem',
                            backgroundColor: '#1a0000',
                            border: '1px solid #400000',
                            color: 'var(--color-ev-red)',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            justifyContent: 'center',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#400000'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#1a0000'}
                    >
                        <SignOut size={18} />
                        DISCONNECT
                    </button>
                    <div style={{ marginTop: '1rem', fontSize: '0.65rem', color: '#404040', textAlign: 'center' }}>
                        ENERGIZER SECURE SYSTEMS v1.0
                    </div>
                </div>

            </aside>
        </>
    );
};


