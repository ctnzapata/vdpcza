import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Clock, Gift, X, Sparkles } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const TimeCapsules = () => {
    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCapsule, setSelectedCapsule] = useState(null);

    useEffect(() => {
        const fetchCapsules = async () => {
            const { data } = await supabase
                .from('capsules')
                .select('*')
                .order('unlock_date', { ascending: true });

            if (data) setCapsules(data);
            setLoading(false);
        };
        fetchCapsules();
    }, []);

    const isLocked = (date) => new Date() < new Date(date);

    const getTimeRemaining = (date) => {
        const diff = new Date(date) - new Date();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        return `${days}d ${hours}h`;
    };

    if (loading) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-[10px] text-rose-400 font-black uppercase tracking-[.3em] px-1">Cápsulas del Tiempo</h2>

            <div className="grid grid-cols-1 gap-4">
                {capsules.map((capsule, idx) => {
                    const locked = isLocked(capsule.unlock_date);
                    return (
                        <motion.button
                            key={capsule.id}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => !locked && setSelectedCapsule(capsule)}
                            className={`glass-card p-5 flex items-center gap-5 text-left transition-all relative group ${locked ? 'opacity-80 grayscale-[0.5]' : 'border-rose-500/30 shadow-[0_10px_30px_rgba(244,63,94,0.15)] hover:scale-[1.02]'
                                }`}
                        >
                            {!locked && <div className="absolute top-0 right-0 p-3"><Sparkles className="w-4 h-4 text-rose-400" /></div>}

                            <div className={`p-4 rounded-2xl shrink-0 transition-colors duration-500 ${locked ? 'bg-white/5 text-slate-600' : 'bg-rose-500/20 text-rose-400'}`}>
                                {locked ? <Lock size={24} /> : <Gift size={24} className="animate-bounce" />}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className={`font-serif text-lg tracking-wide truncate ${locked ? 'text-slate-400' : 'text-white'}`}>{capsule.title}</h3>
                                {locked ? (
                                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                        <Clock size={12} />
                                        <span>Bloqueado · {getTimeRemaining(capsule.unlock_date)}</span>
                                    </div>
                                ) : (
                                    <p className="text-[10px] text-rose-400 font-black uppercase tracking-[.2em] mt-1">¡Listo para abrir!</p>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>

            <AnimatePresence>
                {selectedCapsule && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCapsule(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative glass rounded-[40px] shadow-[0_32px_128px_rgba(0,0,0,0.8)] p-10 max-w-sm w-full border-white/10"
                        >
                            {/* Decorative Seal */}
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 h-12 w-12 bg-rose-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-950">
                                <Heart size={20} className="fill-white text-white" />
                            </div>

                            <div className="text-center mt-4">
                                <div className="flex flex-col items-center gap-2 mb-8">
                                    <p className="text-[9px] text-rose-400 font-black uppercase tracking-[.4em]">Cápsula del Tiempo</p>
                                    <h2 className="text-3xl font-serif text-white">{selectedCapsule.title}</h2>
                                </div>
                                <div className="glass bg-white/5 p-6 rounded-3xl border-white/5 italic text-slate-300 mb-10 leading-relaxed text-lg tracking-wide">
                                    "{selectedCapsule.content}"
                                </div>
                                <button
                                    onClick={() => setSelectedCapsule(null)}
                                    className="w-full py-5 glass bg-white/10 text-white rounded-[24px] text-sm font-black uppercase tracking-[.3em] hover:bg-white/20 transition-all border-white/10 active:scale-95"
                                >
                                    Cerrar de nuevo
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TimeCapsules;
