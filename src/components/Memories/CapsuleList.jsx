import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Clock, Gift, Sparkles } from 'lucide-react';

const CapsuleList = ({ capsules, isLocked, getTimeRemaining, onSelectCapsule }) => {
    return (
        <div className="w-full overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory flex gap-4 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {capsules.map((capsule, idx) => {
                const locked = isLocked(capsule.unlock_date);

                return (
                    <motion.button
                        key={capsule.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, type: 'spring' }}
                        onClick={() => !locked && onSelectCapsule(capsule)}
                        className={`relative flex-shrink-0 snap-center w-[85vw] sm:w-[320px] glass-card p-6 sm:p-8 flex flex-col justify-between text-left transition-all overflow-hidden group ${locked
                                ? 'opacity-90 grayscale-[0.3] border-slate-700/50 bg-slate-900/50'
                                : 'border-rose-400/40 shadow-[0_20px_40px_-15px_rgba(244,63,94,0.3)] hover:shadow-[0_20px_50px_-10px_rgba(244,63,94,0.4)] hover:-translate-y-1 bg-gradient-to-br from-rose-500/10 to-transparent'
                            }`}
                        style={{ minHeight: '180px' }}
                    >
                        {/* Background Shine Effect */}
                        {!locked && (
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                        )}

                        <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                            <div className={`p-4 rounded-full backdrop-blur-md shadow-inner transition-colors duration-500 ${locked ? 'bg-slate-800/80 text-slate-500 border border-slate-700' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'
                                }`}>
                                {locked ? <Lock size={24} /> : <Gift size={24} className="animate-pulse" />}
                            </div>

                            {!locked && (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                    className="p-2"
                                >
                                    <Sparkles className="w-6 h-6 text-rose-300 opacity-80" />
                                </motion.div>
                            )}
                        </div>

                        <div className="relative z-10 w-full mt-auto">
                            <h3 className={`font-serif text-2xl sm:text-3xl tracking-tight leading-none mb-2 ${locked ? 'text-slate-400' : 'text-white drop-shadow-md'}`}>
                                {capsule.title}
                            </h3>

                            {locked ? (
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-black uppercase tracking-widest mt-3 bg-slate-950/50 py-2 px-3 rounded-full w-max border border-slate-800">
                                    <Clock size={12} className="text-rose-900" />
                                    <span>Se abre en {getTimeRemaining(capsule.unlock_date)}</span>
                                </div>
                            ) : (
                                <div className="inline-block mt-3 px-4 py-2 bg-rose-500 text-white text-[9px] font-black uppercase tracking-[.3em] rounded-full shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                                    Romper Sello
                                </div>
                            )}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
};

export default CapsuleList;
