import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

const MemoryLightbox = ({ lightboxPhoto, onClose, onDelete }) => {
    return (
        <AnimatePresence>
            {lightboxPhoto && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-3xl p-4 sm:p-8"
                >
                    {/* Background click to close */}
                    <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

                    {/* Floating Top Controls */}
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-8 w-full max-w-4xl flex justify-between items-center px-4 z-10 pointer-events-none"
                    >
                        <div className="pointer-events-auto">
                            <p className="text-white/50 font-serif italic text-lg sm:text-xl">
                                {new Date(lightboxPhoto.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex gap-4 pointer-events-auto">
                            <button
                                onClick={onDelete}
                                className="w-12 h-12 flex items-center justify-center bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-all border border-rose-500/20 backdrop-blur-md"
                                title="Eliminar para siempre"
                            >
                                <Trash2 size={20} />
                            </button>
                            <button
                                onClick={onClose}
                                className="w-12 h-12 flex items-center justify-center bg-white/10 text-white hover:bg-white/20 rounded-full transition-all border border-white/10 backdrop-blur-md"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    </motion.div>

                    {/* The Hero Image */}
                    <motion.img
                        key={lightboxPhoto.id}
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 120 }}
                        src={lightboxPhoto.image_url}
                        alt="Fotografía inmersiva"
                        className="max-w-full max-h-[85vh] object-contain shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] relative z-0"
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default MemoryLightbox;
