import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Shield, Settings, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import { Link } from 'react-router-dom';

const TopBar = () => {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();
        setProfile(data);
    };

    if (!user) return null;

    return (
        <div className="relative z-[50] w-full max-w-lg mx-auto px-4 pt-4">
            <div className="glass rounded-[24px] px-4 py-2 flex items-center justify-between border border-white/10 shadow-xl">
                {/* Logo o Nombre de la App */}
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 glass rounded-xl flex items-center justify-center border-rose-500/20">
                        <span className="text-rose-500 font-serif font-bold text-xs">V</span>
                    </div>
                </div>

                {/* Info del Usuario Conectado */}
                <div className="relative">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 p-1 pr-3 glass rounded-full border-white/5 hover:bg-white/5 transition-all"
                    >
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-rose-500/30 glass">
                            {profile?.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-rose-500/10">
                                    <User size={14} className="text-rose-500" />
                                </div>
                            )}
                        </div>
                        <div className="hidden sm:flex flex-col items-start leading-none">
                            <span className="text-[10px] text-white font-bold max-w-[80px] truncate">
                                {profile?.full_name || user.email.split('@')[0]}
                            </span>
                            <span className="text-[8px] text-rose-400 font-black uppercase tracking-tighter">
                                {user.role === 'admin' ? 'Admin' : 'Vale'}
                            </span>
                        </div>
                        <ChevronDown size={12} className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                        {isOpen && (
                            <>
                                <div className="fixed inset-0 z-[-1]" onClick={() => setIsOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 glass rounded-2xl border border-white/10 shadow-2xl p-2 overflow-hidden"
                                >
                                    <Link
                                        to="/profile"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-slate-300 transition-colors"
                                    >
                                        <Settings size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Mi Perfil</span>
                                    </Link>

                                    {user.role === 'admin' && (
                                        <div className="px-3 py-2 border-t border-white/5 mt-1">
                                            <div className="flex items-center gap-2 text-[8px] text-rose-400 font-black uppercase tracking-[.2em]">
                                                <Shield size={10} /> Panel Admin
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        onClick={() => { signOut(); setIsOpen(false); }}
                                        className="flex items-center gap-3 w-full p-3 hover:bg-rose-500/10 rounded-xl text-rose-400 transition-colors mt-1"
                                    >
                                        <LogOut size={16} />
                                        <span className="text-xs font-bold uppercase tracking-widest">Salir</span>
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default TopBar;
