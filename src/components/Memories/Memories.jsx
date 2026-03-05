import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder } from 'lucide-react';
import { MemoriesRepository } from '../../repositories/MemoriesRepository';
import TimeCapsules from './TimeCapsules';

// Nuevos sub-componentes modulares
import FloatingActionDock from './FloatingActionDock';
import AlbumHeader from './AlbumHeader';
import ScatteredPhotos from './ScatteredPhotos';
import MemoryLightbox from './MemoryLightbox';

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
        } catch (error) {
            alert('Error al eliminar la foto: ' + error.message);
        }
    };

    return (
        <div className="space-y-4 pb-48 relative min-h-screen">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="px-4">
                <TimeCapsules />
            </div>

            <AnimatePresence mode="wait">
                {!selectedAlbum ? (
                    <motion.div
                        key="albums-view"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                        className="w-full overflow-x-auto pb-8 pt-4 px-4 snap-x snap-mandatory flex gap-6 hide-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {/* Cover Flow Parallax Horizontal List */}
                        {albums.length === 0 && !loading ? (
                            <div className="w-full flex-shrink-0 snap-center glass-card p-12 text-center flex flex-col items-center">
                                <Folder className="w-12 h-12 text-rose-300/50 mb-6" />
                                <p className="text-white/60 font-serif italic text-xl mb-8">Comienza a escribir nuestra historia.</p>
                            </div>
                        ) : (
                            albums.map((album, i) => (
                                <motion.div
                                    key={album.id}
                                    initial={{ opacity: 0, x: 50 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1, type: 'spring' }}
                                    onClick={() => setSelectedAlbum(album)}
                                    className="relative flex-shrink-0 snap-center w-[280px] sm:w-[320px] h-[400px] sm:h-[450px] rounded-3xl overflow-hidden cursor-pointer group shadow-[0_20px_40px_-15px_rgba(244,63,94,0.2)]"
                                >
                                    {/* Parallax Image Background */}
                                    {album.cover_image_url ? (
                                        <div className="absolute inset-[-10%] w-[120%] h-[120%]">
                                            <img
                                                src={album.cover_image_url}
                                                alt={album.name}
                                                className="w-full h-full object-cover filter brightness-[0.6] group-hover:scale-105 group-hover:brightness-[0.4] transition-all duration-700 ease-out"
                                            />
                                        </div>
                                    ) : (
                                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
                                    )}

                                    {/* Editorial Text Overlay */}
                                    <div className="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent">
                                        <p className="text-[9px] text-rose-300 font-bold uppercase tracking-[.4em] mb-3">
                                            Álbum
                                        </p>
                                        <h3 className="text-white font-serif text-3xl sm:text-4xl leading-none tracking-tight drop-shadow-xl overflow-hidden text-ellipsis display-webkit-box webkit-box-orient-vertical webkit-line-clamp-3">
                                            {album.name}
                                        </h3>
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
                        exit={{ opacity: 0 }}
                    >
                        <AlbumHeader
                            selectedAlbum={selectedAlbum}
                            isEditingName={isEditingName}
                            editNameValue={editNameValue}
                            setEditNameValue={setEditNameValue}
                            onRenameAlbum={handleRenameAlbum}
                            onCancelRename={() => { setIsEditingName(false); setEditNameValue(selectedAlbum.name); }}
                            showAlbumMenu={showAlbumMenu}
                            setShowAlbumMenu={setShowAlbumMenu}
                            onEditClick={() => { setIsEditingName(true); setShowAlbumMenu(false); }}
                            onDeleteAlbum={handleDeleteAlbum}
                        />

                        {memories.length === 0 && !uploading ? (
                            <div className="text-center mt-20 px-8">
                                <p className="text-white/40 font-serif italic text-2xl">Aún no hay fotografías aquí.</p>
                            </div>
                        ) : (
                            <ScatteredPhotos memories={memories} onPhotoClick={setLightboxPhoto} />
                        )}

                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Global Modals & Docks */}
            <MemoryLightbox
                lightboxPhoto={lightboxPhoto}
                onClose={() => setLightboxPhoto(null)}
                onDelete={() => handleDeleteMemory(lightboxPhoto)}
            />

            <FloatingActionDock
                selectedAlbum={selectedAlbum}
                uploading={uploading}
                onBack={() => setSelectedAlbum(null)}
                onNewAlbum={() => setShowNewAlbumModal(true)}
                onUploadClick={() => fileInputRef.current?.click()}
            />

            {/* Simple New Album Modal (Kept clean and minimal) */}
            <AnimatePresence>
                {showNewAlbumModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowNewAlbumModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative glass-card p-10 w-full max-w-sm border-white/10 shadow-3xl text-center">
                            <h2 className="text-2xl font-serif text-white mb-6">Nuevo Capítulo</h2>
                            <form onSubmit={handleCreateAlbum} className="space-y-6">
                                <input autoFocus type="text" value={newAlbumName} onChange={(e) => setNewAlbumName(e.target.value)} className="w-full bg-white/5 border-b border-rose-500/30 text-center px-4 py-3 text-white focus:outline-none focus:border-rose-400 font-serif text-xl" placeholder="Título..." />
                                <div className="flex gap-4">
                                    <button type="button" onClick={() => setShowNewAlbumModal(false)} className="flex-1 py-3 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">Cancelar</button>
                                    <button type="submit" className="flex-1 py-3 bg-rose-500 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-rose-500/20 hover:scale-105 transition-transform">Crear</button>
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
