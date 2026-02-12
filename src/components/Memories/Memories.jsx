import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, Loader2, Image as ImageIcon, Plus } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import TimeCapsules from './TimeCapsules';

const Memories = () => {
    const [memories, setMemories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    const fetchMemories = async () => {
        const { data } = await supabase.from('memories').select('*').order('date', { ascending: false });
        if (data) setMemories(data);
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    const handleUpload = async (event) => {
        try {
            setUploading(true);
            const file = event.target.files?.[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('memories')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('memories')
                .getPublicUrl(filePath);

            const { error: dbError } = await supabase
                .from('memories')
                .insert([{ image_url: publicUrl, date: new Date().toISOString(), description: '' }]);

            if (dbError) throw dbError;
            await fetchMemories();
        } catch (error) {
            console.error('Error uploading memory:', error);
            alert('Error al subir la imagen: ' + error.message);
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-12 pb-32">
            {/* Time Capsules Section */}
            <TimeCapsules />

            <div className="space-y-8">
                <header className="flex justify-between items-end px-1">
                    <div>
                        <h1 className="text-4xl font-serif text-white">Nuestras Fotos</h1>
                        <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">Momentos Inmortales</p>
                    </div>

                    <div className="relative">
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleUpload} disabled={uploading} />
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="p-4 glass rounded-2xl border-white/20 text-white shadow-xl hover:bg-white/20 transition-all flex items-center gap-2 group"
                        >
                            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
                            <span className="text-[10px] font-black uppercase tracking-widest px-1">Subir</span>
                        </motion.button>
                    </div>
                </header>

                {memories.length === 0 && !uploading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="glass-card p-20 text-center border-dashed border-white/10"
                    >
                        <ImageIcon className="w-16 h-16 text-slate-700 mx-auto mb-6" />
                        <p className="text-slate-400 font-serif italic text-lg mb-8">Nuestra galería espera su primera joya...</p>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="px-8 py-4 glass bg-rose-500/10 border-rose-500/20 text-rose-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                        >
                            Comenzar Álbum
                        </button>
                    </motion.div>
                ) : (
                    <div className="columns-2 gap-4 space-y-4">
                        <AnimatePresence>
                            {uploading && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="break-inside-avoid aspect-square glass rounded-[24px] flex flex-col items-center justify-center border-white/5 border-dashed border-2"
                                >
                                    <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-3" />
                                    <span className="text-[8px] text-rose-400 font-black uppercase tracking-widest">Inmortalizando...</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {memories.map((memory, i) => (
                            <motion.div
                                key={memory.id}
                                layout
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
            </div>
        </div>
    );
};

export default Memories;
