import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Plane, Image, Music, Gift, Utensils, Rocket, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
    const location = useLocation();
    const navRef = useRef(null);

    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        ...(isAdmin ? [
            { to: '/travel', icon: Plane, label: 'Viajes' },
            { to: '/memories', icon: Image, label: 'Recuerdos' },
        ] : []),
        { to: '/restaurants', icon: Utensils, label: 'Comer' },
        { to: '/gifts', icon: Gift, label: 'Regalos' },
        { to: '/bucket-list', icon: Rocket, label: 'Metas' },
        { to: '/playlist', icon: Music, label: 'Música' },
    ];

    // Scroll to active item on mount/change
    useEffect(() => {
        const activeItem = navRef.current?.querySelector('.active-nav-item');
        if (activeItem) {
            activeItem.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }, [location.pathname]);

    return (
        <nav className="fixed z-40 transition-all duration-500 bottom-6 left-1/2 -translate-x-1/2 w-[95%] max-w-lg">
            <div
                className="glass rounded-[32px] flex items-center p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
                <div className="flex w-full justify-between gap-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `
                                relative flex flex-col items-center justify-center p-2 rounded-2xl transition-all duration-500 flex-1 min-w-0
                                ${isActive ? 'text-white active-nav-item' : 'text-slate-500 hover:text-rose-400'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex flex-col items-center relative z-10 gap-1 w-full">
                                        <Icon size={20} className={`transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : ''}`} />
                                        <span className={`text-[9px] uppercase font-black tracking-widest transition-opacity duration-500 truncate w-full text-center ${isActive ? 'opacity-100' : 'opacity-40 hidden sm:block'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-glow-flat"
                                            className="absolute inset-1 bg-rose-500/20 rounded-xl blur-[6px] -z-10"
                                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
