import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Shield, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ProfileRepository } from '../../repositories/ProfileRepository';
import { Link } from 'react-router-dom';
import AdminTriviaManager from '../AdminTriviaManager';

const TopBar = () => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [showAdmin, setShowAdmin] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        const data = await ProfileRepository.getProfile(user.id);
        setProfile(data);
    };

    if (!user) return null;

    return (
        <div className="relative z-[50] w-full max-w-lg md:max-w-5xl mx-auto px-6 pt-6 transition-all duration-500">
            <div className="glass rounded-[2rem] px-5 py-2.5 flex items-center justify-between shadow-[0_10px_30px_-10px_rgba(244,63,94,0.1)] md:py-3 md:px-6">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.4)] bg-rose-950/40 relative group cursor-pointer">
                        <div className="absolute inset-0 bg-rose-500/20 mix-blend-overlay group-hover:bg-transparent transition-colors" />
                        <img src="/logo.svg?v=2" alt="VDPCZA Logo" className="w-full h-full object-cover p-1 relative z-10" />
                    </div>
                </div>

                {/* Info del Usuario Conectado */}
                <div className="relative">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 p-1 pr-4 bg-rose-500/5 rounded-[2rem] border border-rose-500/10 hover:bg-rose-500/10 hover:border-rose-400/30 transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    >
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-500/20 bg-rose-950/50">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <User size={14} className="text-rose-400" />
                                </div>
                            )}
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-none gap-0.5">
                            <span className="text-[11px] font-serif font-bold text-rose-50/90 max-w-[100px] truncate">
                                {profile?.full_name || user.email.split('@')[0]}
                            </span>
                            <span className="text-[8px] font-black tracking-[.2em] text-rose-300/70 uppercase">
                                {user.role === 'admin' ? 'Admin' : 'Vale'}
                            </span>
                        </div>
                        <ChevronDown size={12} className={`text-rose-300/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.4, ease: "anticipate" }}
                                    className="absolute right-0 mt-4 w-56 glass rounded-[24px] shadow-[0_30px_60px_-15px_rgba(244,63,94,0.15)] p-2 hover:border-rose-300/20 transition-colors overflow-hidden"
                                >
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-3 hover:bg-rose-500/10 rounded-[20px] text-rose-100/70 hover:text-rose-100 transition-colors"
                                    >
                                        <Settings size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Mi Perfil</span>
                                    </Link>

                                    {user.role === 'admin' && (
                                        <div className="px-3 py-2 border-t border-rose-500/10 mt-1">
                                            <button
                                                onClick={() => { setShowAdmin(true); setIsOpen(false); }}
                                                className="w-full flex items-center gap-2 p-2 hover:bg-rose-500/20 rounded-[15px] text-[10px] font-black text-amber-400 uppercase tracking-[.2em] transition-colors"
                                            >
                                                <Shield size={12} /> Gestionar Trivia
                                            </button>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => { signOut(); setIsOpen(false); }}
                                        className="flex items-center gap-3 w-full p-3 hover:bg-rose-500/20 rounded-[20px] text-rose-400 transition-colors mt-1"
                                    >
                                        <LogOut size={16} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Salir</span>
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {showAdmin && <AdminTriviaManager onClose={() => setShowAdmin(false)} />}
            </AnimatePresence>
        </div>
    );
};

export default TopBar;
