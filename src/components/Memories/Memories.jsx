import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, Loader2, Image as ImageIcon, Plus, FolderPlus, ChevronLeft, Folder } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import TimeCapsules from './TimeCapsules';

const Memories = () => {
    const [albums, setAlbums] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const [memories, setMemories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showNewAlbumModal, setShowNewAlbumModal] = useState(false);
    const [newAlbumName, setNewAlbumName] = useState('');

    const fileInputRef = useRef(null);

    const fetchAlbums = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('albums').select('*').order('created_at', { ascending: false });
        if (data) setAlbums(data);
        setLoading(false);
    };

    const fetchMemories = async (albumId) => {
        const { data } = await supabase
            .from('memories')
            .select('*')
            .eq('album_id', albumId)
            .order('date', { ascending: false });
        if (data) setMemories(data);
    };

    useEffect(() => {
        fetchAlbums();
    }, []);

    useEffect(() => {
        if (selectedAlbum) {
            fetchMemories(selectedAlbum.id);
        } else {
            setMemories([]);
        }
    }, [selectedAlbum]);

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        if (!newAlbumName.trim()) return;

        const { data, error } = await supabase
            .from('albums')
            .insert([{ name: newAlbumName }])
            .select();

        if (!error && data) {
            setAlbums([data[0], ...albums]);
            setNewAlbumName('');
            setShowNewAlbumModal(false);
        } else {
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

            // Subir a Storage
            const { error: uploadError } = await supabase.storage
                .from('memories')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('memories')
                .getPublicUrl(filePath);

            // Guardar en Base de Datos vinculando al álbum
            const { error: dbError } = await supabase
                .from('memories')
                .insert([{
                    image_url: publicUrl,
                    date: new Date().toISOString(),
                    description: '',
                    album_id: selectedAlbum.id
                }]);

            if (dbError) throw dbError;

            // Si el álbum no tiene portada, usar esta primera foto
            if (!selectedAlbum.cover_image_url) {
                await supabase.from('albums').update({ cover_image_url: publicUrl }).eq('id', selectedAlbum.id);
                fetchAlbums();
            }

            await fetchMemories(selectedAlbum.id);
        } catch (error) {
            console.error('Error uploading memory:', error);
            alert('Error al subir la imagen: ' + error.message + '\n\nIMPORTANTE: Asegúrate de que el bucket "memories" existe en tu Supabase Panel.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-12 pb-32">
            <TimeCapsules />

            <div className="space-y-8">
                <header className="flex justify-between items-end px-1">
                    <div>
                        <h1 className="text-4xl font-serif text-white">
                            {selectedAlbum ? selectedAlbum.name : 'Nuestros Álbumes'}
                        </h1>
                        <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">
                            {selectedAlbum ? 'Dentro de este momento' : 'Momentos Inmortales'}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        {selectedAlbum ? (
                            <>
                                <button
                                    onClick={() => setSelectedAlbum(null)}
                                    className="p-4 glass rounded-2xl border-white/20 text-white shadow-xl hover:bg-white/20 transition-all flex items-center gap-2"
                                >
                                    <ChevronLeft size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                                </button>
                                <div className="relative">
                                    <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} disabled={uploading} />
                                    <motion.button
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={uploading}
                                        className="p-4 glass bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-2xl shadow-xl hover:bg-rose-500/20 transition-all flex items-center gap-2 group"
                                    >
                                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                                        <span className="text-[10px] font-black uppercase tracking-widest">Añadir Foto</span>
                                    </motion.button>
                                </div>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowNewAlbumModal(true)}
                                className="p-4 glass rounded-2xl border-white/20 text-white shadow-xl hover:bg-white/20 transition-all flex items-center gap-2 group"
                            >
                                <FolderPlus size={18} className="group-hover:scale-110 transition-transform" />
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
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-2 gap-4"
                        >
                            {albums.length === 0 && !loading ? (
                                <div className="col-span-2 glass-card p-20 text-center border-dashed border-white/10">
                                    <Folder className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                                    <p className="text-slate-400 font-serif italic text-lg mb-8">No hay álbumes creados...</p>
                                    <button
                                        onClick={() => setShowNewAlbumModal(true)}
                                        className="px-8 py-4 glass bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                                    >
                                        Crear mi primer álbum
                                    </button>
                                </div>
                            ) : (
                                albums.map((album, i) => (
                                    <motion.div
                                        key={album.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        onClick={() => setSelectedAlbum(album)}
                                        className="glass-card group cursor-pointer relative aspect-square overflow-hidden border-white/5"
                                    >
                                        {album.cover_image_url ? (
                                            <img src={album.cover_image_url} alt={album.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                        ) : (
                                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                                                <Folder className="w-12 h-12 text-slate-800" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent group-hover:via-transparent transition-all" />
                                        <div className="absolute bottom-4 left-4 right-4">
                                            <p className="text-[8px] text-rose-400 font-black uppercase tracking-widest mb-1">Álbum</p>
                                            <h3 className="text-white font-serif text-lg leading-tight">{album.name}</h3>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="photos-view"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            {memories.length === 0 && !uploading ? (
                                <div className="glass-card p-20 text-center border-dashed border-white/10">
                                    <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                                    <p className="text-slate-400 font-serif italic text-lg mb-8">Este álbum está vacío...</p>
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-4 glass bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                                    >
                                        Subir primera foto
                                    </button>
                                </div>
                            ) : (
                                <div className="columns-2 gap-4 space-y-4">
                                    {uploading && (
                                        <div className="break-inside-avoid aspect-square glass rounded-[24px] flex flex-col items-center justify-center border-white/5 border-dashed border-2">
                                            <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
                                            <span className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Inmortalizando...</span>
                                        </div>
                                    )}
                                    {memories.map((memory, i) => (
                                        <motion.div
                                            key={memory.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: (i % 6) * 0.1 }}
                                            className="break-inside-avoid relative group rounded-[24px] overflow-hidden shadow-2xl border border-white/5 bg-slate-900"
                                        >
                                            <img
                                                src={memory.image_url}
                                                alt={memory.description || "Recuerdo"}
                                                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                                                <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest">
                                                    {new Date(memory.date).toLocaleDateString()}
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

            {/* New Album Modal */}
            <AnimatePresence>
                {showNewAlbumModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowNewAlbumModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative glass-card p-8 w-full max-w-sm border-white/10"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">Nuevo Álbum</h2>
                            <form onSubmit={handleCreateAlbum} className="space-y-6">
                                <div>
                                    <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-2 px-1">Nombre del Álbum</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        value={newAlbumName}
                                        onChange={(e) => setNewAlbumName(e.target.value)}
                                        className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500/50 transition-all font-serif italic text-lg"
                                        placeholder="Ej: Nuestra Boda..."
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowNewAlbumModal(false)}
                                        className="flex-1 px-4 py-4 rounded-2xl glass border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/5"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-4 rounded-2xl bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-500/20 hover:bg-rose-600 transition-all"
                                    >
                                        Crear Álbum
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

