import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const CapsuleModal = ({ selectedCapsule, onClose }) => {
    return (
        <AnimatePresence>
            {selectedCapsule && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative glass-card rounded-[40px] shadow-[0_32px_128px_rgba(244,63,94,0.3)] p-10 max-w-sm w-full border-white/10 overflow-visible"
                    >
                        {/* Decorative Wax Seal */}
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-16 bg-gradient-to-br from-rose-500 to-rose-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-900 z-10">
                            <Heart size={24} className="fill-white text-white drop-shadow-md" />
                        </div>

                        <div className="text-center mt-6 relative z-0">
                            <div className="flex flex-col items-center gap-2 mb-8">
                                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[.4em]">Cápsula del Tiempo</p>
                                <h2 className="text-4xl font-serif text-white">{selectedCapsule.title}</h2>
                            </div>

                            {/* The "Letter" */}
                            <div className="bg-gradient-to-b from-white/10 to-transparent p-[1px] rounded-3xl mb-8">
                                <div className="bg-slate-900/50 p-6 rounded-3xl italic text-slate-300 leading-relaxed text-lg tracking-wide font-serif h-full w-full">
                                    "{selectedCapsule.content}"
                                </div>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-5 bg-white/5 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[.3em] hover:bg-white/10 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all border border-white/10 active:scale-95"
                            >
                                Guardar de nuevo
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CapsuleModal;
