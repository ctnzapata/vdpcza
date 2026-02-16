import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Plane, Image, Music, Gift, Utensils, Rocket, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

const BottomNav = () => {
    const location = useLocation();
    const navRef = useRef(null);

    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [displayCount, setDisplayCount] = useState(0);

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

    const calculateUnseen = (allGifts) => {
        const unseen = allGifts.filter(g => !localStorage.getItem(`vdpcza_seen_${g.id}`));
        setDisplayCount(unseen.length);
    };

    useEffect(() => {
        const fetchGifts = async () => {
            const { data } = await supabase.from('gifts').select('id');
            if (data) {
                calculateUnseen(data);
            }
        };

        fetchGifts();

        const subscription = supabase
            .channel('gifts-nav-global')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'gifts' }, fetchGifts)
            .subscribe();

        // Listen for when a gift is marked as seen in Gifts.jsx
        const handleStorageChange = () => fetchGifts();
        window.addEventListener('storage', handleStorageChange);

        return () => {
            subscription.unsubscribe();
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

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
                ref={navRef}
                className="glass rounded-[32px] flex items-center p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-x-auto no-scrollbar scroll-smooth"
                style={{ scrollSnapType: 'x mandatory' }}
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
                                    {label === 'Regalos' && displayCount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-1 sm:top-0 sm:right-2 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full animate-bounce shadow-lg border border-white/20"
                                        >
                                            {displayCount}
                                        </motion.div>
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
