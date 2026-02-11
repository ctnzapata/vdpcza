import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Plane, Image, Music } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const navItems = [
        { to: '/', icon: Home, label: 'Home' },
        { to: '/travel', icon: Plane, label: 'Viajes' },
        { to: '/memories', icon: Image, label: 'Recuerdos' },
        { to: '/playlist', icon: Music, label: 'Música' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6">
            <div className="glass rounded-2xl flex justify-around items-center p-2 shadow-2xl shadow-rose-200/50">
                {navItems.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `
                            relative p-3 rounded-xl transition-all duration-300
                            ${isActive ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:text-rose-400'}
                        `}
                    >
                        {({ isActive }) => (
                            <div className="flex flex-col items-center">
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-rose-100' : ''}`} />
                                {isActive && (
                                    <motion.span
                                        layoutId="nav-pill"
                                        className="absolute -bottom-1 w-1 h-1 bg-rose-400 rounded-full"
                                    />
                                )}
                            </div>
                        )}
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
