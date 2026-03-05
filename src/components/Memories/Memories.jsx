import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Image as ImageIcon, Plus, FolderPlus, ChevronLeft, Folder, Edit2, Trash2, X, Check, MoreVertical } from 'lucide-react';
import { MemoriesRepository } from '../../repositories/MemoriesRepository';
import TimeCapsules from './TimeCapsules';

const Memories = () => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [memories, setMemories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);

    // Modals & Overlays
    const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    // Editing Album
    const [isEditingName, setIsEditingName] = useState(false);
    const [editNameValue, setEditNameValue] = useState('');
    const [showAlbumMenu, setShowAlbumMenu] = useState(false);

    const fileInputRef = useRef(null);
    const menuRef = useRef(null);

    const fetchAlbums = async () => {
        setLoading(true);
        const data = await MemoriesRepository.getAlbums();
        setAlbums(data);
        setLoading(false);
    };

    const fetchMemories = async (albumId) => {
        const data = await MemoriesRepository.getMemoriesByAlbum(albumId);
        setMemories(data);
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        if (selectedAlbum) {
            fetchMemories(selectedAlbum.id);
            setEditNameValue(selectedAlbum.name);
            setIsEditingName(false);
            setShowAlbumMenu(false);
        } else {
            setMemories([]);
        }
    }, [selectedAlbum]);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowAlbumMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        if (!newAlbumName.trim()) return;

        try {
            const newAlbum = await MemoriesRepository.createAlbum(newAlbumName);
            if (newAlbum) {
                setAlbums([newAlbum, ...albums]);
                setNewAlbumName('');
                setShowNewAlbumModal(false);
            }
        } catch (error) {
            alert('Error al crear álbum: ' + error.message);
        }
    };

    const handleUpload = async (event) => {
        if (!selectedAlbum) return;

        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${selectedAlbum.id}/${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const publicUrl = await MemoriesRepository.uploadMemoryFile(filePath, file);
            await MemoriesRepository.insertMemoryMetadata(publicUrl, selectedAlbum.id);

            if (!selectedAlbum.cover_image_url) {
                await MemoriesRepository.updateAlbumCover(selectedAlbum.id, publicUrl);
                fetchAlbums();
                setSelectedAlbum({ ...selectedAlbum, cover_image_url: publicUrl });
            }

            await fetchMemories(selectedAlbum.id);
        } catch (error) {
            console.error('Error uploading memory:', error);
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRenameAlbum = async () => {
        if (!editNameValue.trim() || editNameValue === selectedAlbum.name) {
            setIsEditingName(false);
            return;
        }
        try {
            await MemoriesRepository.updateAlbumName(selectedAlbum.id, editNameValue);
            setSelectedAlbum({ ...selectedAlbum, name: editNameValue });
            fetchAlbums(); // refresh list in background
        } catch (error) {
            alert('Error al renombrar el álbum: ' + error.message);
        }
        setIsEditingName(false);
    };

    const handleDeleteAlbum = async () => {
        if (!window.confirm(`¿Estás seguro de que quieres eliminar MUY PERMANENTEMENTE el álbum "${selectedAlbum.name}" y TODO su contenido?`)) return;

        try {
            await MemoriesRepository.deleteAlbum(selectedAlbum.id);
            setSelectedAlbum(null);
            fetchAlbums();
        } catch (error) {
            alert('Error al eliminar el álbum: ' + error.message);
        }
    };

    const handleDeleteMemory = async (memory) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta fotografía de nuestra historia?')) return;

        try {
            await MemoriesRepository.deleteMemory(memory.id, memory.image_url);
            setLightboxPhoto(null);
            await fetchMemories(selectedAlbum.id);

            // If the deleted memory was the cover (rough estimate), might want to update cover later, but ok for now.
        } catch (error) {
            alert('Error al eliminar la foto: ' + error.message);
        }
    };

    return (
        <div className="space-y-12 pb-32">
            <TimeCapsules />

            <div className="relative">
                {/* Dynamic Gradient Meshes in Background */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 px-1 mb-10 relative z-10">
                    <div className="w-full sm:w-auto flex-1">
                        {isEditingName && selectedAlbum ? (
                            <div className="flex items-center gap-3">
                                <input
                                    autoFocus
                                    type="text"
                                    value={editNameValue}
                                    onChange={(e) => setEditNameValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleRenameAlbum()}
                                    className="bg-white/5 border border-rose-400/30 rounded-xl px-4 py-2 text-2xl font-serif text-white focus:outline-none focus:border-rose-400 w-full sm:w-auto"
                                />
                                <button onClick={handleRenameAlbum} className="p-2 bg-green-500/20 text-green-400 rounded-xl hover:bg-green-500/30 transition-colors">
                                    <Check size={20} />
                                </button>
                                <button onClick={() => { setIsEditingName(false); setEditNameValue(selectedAlbum.name); }} className="p-2 bg-rose-500/20 text-rose-400 rounded-xl hover:bg-rose-500/30 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-4xl font-serif text-white flex items-center gap-3">
                                        {selectedAlbum ? selectedAlbum.name : 'Nuestros Álbumes'}
                                        {selectedAlbum && (
                                            <div className="relative" ref={menuRef}>
                                                <button
                                                    onClick={() => setShowAlbumMenu(!showAlbumMenu)}
                                                    className="p-1.5 rounded-full hover:bg-white/10 text-white/50 transition-colors"
                                                >
                                                    <MoreVertical size={20} />
                                                </button>
                                                <AnimatePresence>
                                                    {showAlbumMenu && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                                            className="absolute top-full left-0 mt-2 w-48 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                                                        >
                                                            <button
                                                                onClick={() => { setIsEditingName(true); setShowAlbumMenu(false); }}
                                                                className="w-full text-left px-4 py-3 text-sm text-white/80 hover:bg-white/5 flex items-center gap-3 transition-colors"
                                                            >
                                                                <Edit2 size={16} /> Renombrar
                                                            </button>
                                                            <button
                                                                onClick={() => { handleDeleteAlbum(); setShowAlbumMenu(false); }}
                                                                className="w-full text-left px-4 py-3 text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-3 transition-colors"
                                                            >
                                                                <Trash2 size={16} /> Eliminar Álbum
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                    </h1>
                                    <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">
                                        {selectedAlbum ? 'Dentro de este momento' : 'Momentos Inmortales'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 w-full sm:w-auto shrink-0 justify-end">
                        {selectedAlbum ? (
                            <>
                                <button
                                    onClick={() => setSelectedAlbum(null)}
                                    className="p-4 glass rounded-[20px] border-white/10 text-white shadow-xl hover:bg-white/10 transition-all flex items-center gap-2"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="relative">
                                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} disabled={uploading} />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="px-6 py-4 glass bg-rose-500/10 border-rose-500/20 text-rose-300 rounded-[20px] shadow-xl hover:bg-rose-500/20 transition-all flex items-center gap-2 group"
                                    >
                                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Añadir Foto</span>
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowNewAlbumModal(true)}
                                className="px-6 py-4 glass bg-rose-500/5 border-white/10 text-white shadow-xl hover:bg-white/10 transition-all flex items-center gap-3 group rounded-[20px]"
                            >
                                <FolderPlus size={18} className="group-hover:scale-110 text-rose-300 transition-transform" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Nuevo Álbum</span>
                            </button>
                        )}
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    {!selectedAlbum ? (
                        <motion.div
                            key="albums-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 relative z-10"
                        >
                            {albums.length === 0 && !loading ? (
                                <div className="col-span-full glass-card p-12 sm:p-20 text-center border-dashed border-white/10 flex flex-col items-center">
                                    <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                        <Folder className="w-10 h-10 text-rose-300/50" />
                                    </div>
                                    <p className="text-white/60 font-serif italic text-lg mb-8 max-w-sm">Aún no hemos enmarcado nuestra primera historia en un álbum.</p>
                                    <button
                                        onClick={() => setShowNewAlbumModal(true)}
                                        className="px-8 py-4 bg-gradient-to-r from-rose-500/20 to-rose-600/20 border-rose-400/30 border text-rose-100 rounded-full text-[10px] font-black uppercase tracking-[.2em] hover:bg-rose-500 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                                    >
                                        Crear mi primer álbum
                                    </button>
                                </div>
                            ) : (
                                albums.map((album, i) => (
                                    <motion.div
                                        key={album.id}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                                        onClick={() => setSelectedAlbum(album)}
                                        className="glass-card group cursor-pointer relative aspect-[4/5] sm:aspect-square overflow-hidden border-white/10 hover:border-rose-400/30 hover:shadow-[0_20px_40px_-15px_rgba(244,63,94,0.2)]"
                                    >
                                        {album.cover_image_url ? (
                                            <motion.img
                                                src={album.cover_image_url}
                                                alt={album.name}
                                                className="w-full h-full object-cover"
                                                whileHover={{ scale: 1.05 }}
                                                transition={{ duration: 0.6 }}
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex flex-col items-center justify-center">
                                                <Folder className="w-10 h-10 text-slate-800 mb-2" />
                                                <span className="text-[8px] text-slate-600 uppercase font-black tracking-widest">Vacío</span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-6 left-6 right-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <p className="text-[8px] text-rose-300 font-black uppercase tracking-[.3em] mb-2 flex items-center gap-2">
                                                <span className="w-3 h-[1px] bg-rose-400/50 block"></span> Álbum
                                            </p>
                                            <h3 className="text-white font-serif text-xl sm:text-2xl leading-tight drop-shadow-lg">{album.name}</h3>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="photos-view"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.4 }}
                            className="relative z-10"
                        >
                            {memories.length === 0 && !uploading ? (
                                <div className="glass-card p-12 sm:p-20 text-center border-dashed border-white/10 flex flex-col items-center mt-4">
                                    <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-white/20" />
                                    </div>
                                    <p className="text-white/60 font-serif italic text-lg mb-8 max-w-sm">Un álbum es solo un libro esperando ser llenado de magia.</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-4 bg-gradient-to-r from-rose-500/20 to-rose-600/20 border-rose-400/30 border text-rose-100 rounded-full text-[10px] font-black uppercase tracking-[.2em] hover:bg-rose-500 hover:text-white transition-all hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]"
                                    >
                                        Subir primera foto
                                    </button>
                                </div>
                            ) : (
                                <div className="columns-2 sm:columns-3 md:columns-4 gap-4 space-y-4">
                                    {uploading && (
                                        <div className="break-inside-avoid aspect-[3/4] glass rounded-[24px] flex flex-col items-center justify-center border-rose-500/30 border-dashed border-2 bg-rose-500/5 mb-4 shadow-inner">
                                            <Loader2 className="w-8 h-8 text-rose-400 animate-spin mb-3" />
                                            <span className="text-[8px] text-rose-300 font-black uppercase tracking-widest text-center px-4">Revelando momento...</span>
                                        </div>
                                    )}
                                    {memories.map((memory, i) => (
                                        <motion.div
                                            key={memory.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (i % 8) * 0.08, type: 'spring', damping: 25 }}
                                            onClick={() => setLightboxPhoto(memory)}
                                            className="break-inside-avoid relative group rounded-[20px] overflow-hidden shadow-2xl border border-white/5 bg-slate-900 cursor-zoom-in mb-4"
                                        >
                                            <img
                                                src={memory.image_url}
                                                alt={memory.description || "Recuerdo"}
                                                className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110"
                                                loading="lazy"
                                            />
                                            {/* Vignette overlay */}
                                            <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                                                <p className="text-[9px] font-black text-white/90 uppercase tracking-widest drop-shadow-md">
                                                    {new Date(memory.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Interactive Lightbox Modal */}
            <AnimatePresence>
                {lightboxPhoto && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4 sm:p-8"
                    >
                        {/* Close bg trigger */}
                        <div className="absolute inset-0 cursor-zoom-out" onClick={() => setLightboxPhoto(null)} />

                        {/* Top controls */}
                        <div className="absolute top-6 right-6 flex items-center gap-4 z-10">
                            <button
                                onClick={() => handleDeleteMemory(lightboxPhoto)}
                                className="p-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-full transition-all flex items-center gap-2 group border border-rose-500/20"
                            >
                                <Trash2 size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block pr-2">Eliminar</span>
                            </button>
                            <button
                                onClick={() => setLightboxPhoto(null)}
                                className="p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-all border border-white/10"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Date overlay */}
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 mix-blend-difference text-white">
                            <p className="text-sm font-serif italic opacity-80">Guardado el</p>
                            <p className="text-xl font-bold tracking-widest uppercase mt-1">
                                {new Date(lightboxPhoto.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        <motion.img
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25 }}
                            src={lightboxPhoto.image_url}
                            alt="Fotografía completa"
                            className="max-w-full max-h-full object-contain rounded-xl relative z-0 shadow-2xl shadow-black/50"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* New Album Modal */}
            <AnimatePresence>
                {showNewAlbumModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewAlbumModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="relative glass-card p-10 w-full max-w-sm border-white/10 shadow-2xl"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/20 rounded-bl-full blur-[40px] pointer-events-none" />
                            <h2 className="text-3xl font-serif text-white mb-8 relative z-10">Nuevo Álbum</h2>
                            <form onSubmit={handleCreateAlbum} className="space-y-8 relative z-10">
                                <div>
                                    <label className="text-[10px] text-rose-300 uppercase font-black tracking-widest block mb-3 px-1">Título del capítulo</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newAlbumName}
                                        onChange={(e) => setNewAlbumName(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-400 focus:bg-white/5 transition-all font-serif text-xl"
                                        placeholder="Ej: Nuestra Boda..."
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewAlbumModal(false)}
                                        className="flex-1 px-4 py-4 rounded-2xl glass border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5 hover:text-white"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-400 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:scale-105 transition-all"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Memories;
