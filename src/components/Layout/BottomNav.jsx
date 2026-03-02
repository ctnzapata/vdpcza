import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Plane, Image, Music, Gift, Utensils, Rocket, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { GiftRepository } from '../../repositories/GiftRepository';

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
            const unseen = await GiftRepository.getUnseenGiftsCount();
            setDisplayCount(unseen);
        };

        fetchGifts();

        const subscription = GiftRepository.subscribeToGifts(fetchGifts);

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
        <nav className="fixed z-40 transition-all duration-500 bottom-8 left-1/2 -translate-x-1/2 w-[98%] max-w-lg">
            <div
                ref={navRef}
                className="glass rounded-[40px] flex items-center p-3 shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-none overflow-x-auto no-scrollbar scroll-smooth"
                style={{ scrollSnapType: 'x mandatory' }}
            >
                <div className="flex w-full justify-between gap-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) => `
                                relative flex flex-col items-center justify-center p-3 rounded-[24px] transition-all duration-500 flex-1 min-w-0
                                ${isActive ? 'text-white active-nav-item' : 'text-white/20 hover:text-white/50'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex flex-col items-center relative z-10 gap-1.5 w-full">
                                        <Icon size={22} strokeWidth={isActive ? 2 : 1.5} className={`transition-all duration-500 ${isActive ? 'scale-110 drop-shadow-[0_4px_10px_rgba(255,255,255,0.3)]' : ''}`} />
                                        <span className={`text-[8px] uppercase font-black tracking-widest transition-opacity duration-500 truncate w-full text-center ${isActive ? 'opacity-100' : 'opacity-0 hidden sm:block'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-bg"
                                            className="absolute inset-0 bg-white/[0.05] rounded-[24px] -z-10"
                                            transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                                        />
                                    )}
                                    {label === 'Regalos' && displayCount > 0 && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute top-1 right-2 sm:top-1 sm:right-3 w-4 h-4 bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center rounded-full shadow-[0_0_15px_rgba(244,63,94,0.6)] border-none"
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
