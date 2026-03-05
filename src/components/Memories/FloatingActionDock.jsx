import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, FolderPlus, Loader2 } from 'lucide-react';

const FloatingActionDock = ({
    selectedAlbum,
    uploading,
    onBack,
    onNewAlbum,
    onUploadClick
}) => {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-24 sm:bottom-8 left-1/2 -translate-x-1/2 z-[100] px-4"
            >
                <div className="flex items-center gap-3 p-3 bg-slate-950/60 backdrop-blur-2xl border border-white/10 rounded-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">

                    {selectedAlbum ? (
                        <>
                            <button
                                onClick={onBack}
                                className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
                            >
                                <ChevronLeft size={20} />
                            </button>

                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={onUploadClick}
                                disabled={uploading}
                                className="px-6 h-12 flex items-center gap-3 bg-rose-500 text-white rounded-full font-bold uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all disabled:opacity-50"
                            >
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                                <span>Añadir Foto</span>
                            </motion.button>
                        </>
                    ) : (
                        <button
                            onClick={onNewAlbum}
                            className="px-6 h-12 flex items-center gap-3 bg-gradient-to-r from-rose-500/20 to-rose-400/20 border border-rose-500/30 text-rose-100 rounded-full font-bold uppercase tracking-widest text-[10px] hover:bg-rose-500 hover:text-white transition-all shadow-lg"
                        >
                            <FolderPlus size={16} />
                            <span>Nuevo Álbum</span>
                        </button>
                    )}

                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FloatingActionDock;
