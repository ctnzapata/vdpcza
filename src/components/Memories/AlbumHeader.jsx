import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, MoreVertical, Edit2, Trash2 } from 'lucide-react';

const AlbumHeader = ({
    selectedAlbum,
    isEditingName,
    editNameValue,
    setEditNameValue,
    onRenameAlbum,
    onCancelRename,
    showAlbumMenu,
    setShowAlbumMenu,
    onEditClick,
    onDeleteAlbum
}) => {
    return (
        <header className="relative z-10 px-4 pt-10 pb-8 flex justify-center items-center">
            {isEditingName ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center gap-4 w-full max-w-sm"
                >
                    <input
                        autoFocus
                        type="text"
                        value={editNameValue}
                        onChange={(e) => setEditNameValue(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && onRenameAlbum()}
                        className="bg-white/5 border-b-2 border-rose-400/50 text-center px-4 py-2 text-3xl font-serif text-white focus:outline-none focus:border-rose-400 w-full"
                    />
                    <div className="flex gap-2">
                        <button onClick={onRenameAlbum} className="px-6 py-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30 transition-colors uppercase text-[10px] font-bold tracking-widest flex items-center gap-2">
                            <Check size={14} /> Guardar
                        </button>
                        <button onClick={onCancelRename} className="px-6 py-2 bg-rose-500/20 text-rose-400 rounded-full hover:bg-rose-500/30 transition-colors uppercase text-[10px] font-bold tracking-widest flex items-center gap-2">
                            <X size={14} /> Cancelar
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="text-center relative group">
                    <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[.4em] mb-4">
                        Colección de Momentos
                    </p>
                    <div className="flex items-center justify-center gap-4">
                        <h1 className="text-5xl sm:text-6xl font-serif text-white tracking-tight">
                            {selectedAlbum.name}
                        </h1>
                        <div className="relative">
                            <button
                                onClick={() => setShowAlbumMenu(!showAlbumMenu)}
                                className="p-2 rounded-full hover:bg-white/10 text-white/50 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <MoreVertical size={24} />
                            </button>
                            <AnimatePresence>
                                {showAlbumMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                        className="absolute top-full right-0 sm:left-0 mt-2 w-48 bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[200]"
                                    >
                                        <button
                                            onClick={onEditClick}
                                            className="w-full text-left px-5 py-4 text-xs text-white uppercase tracking-wider font-bold hover:bg-white/10 flex items-center gap-3 transition-colors"
                                        >
                                            <Edit2 size={14} /> Renombrar
                                        </button>
                                        <div className="h-[1px] bg-white/10 w-full" />
                                        <button
                                            onClick={onDeleteAlbum}
                                            className="w-full text-left px-5 py-4 text-xs text-rose-400 uppercase tracking-wider font-bold hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                                        >
                                            <Trash2 size={14} /> Eliminar
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default AlbumHeader;
