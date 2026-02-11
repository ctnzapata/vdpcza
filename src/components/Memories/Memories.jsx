import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudUpload } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Memories = () => {
    const [memories, setMemories] = useState([]);

    useEffect(() => {
        const fetchMemories = async () => {
            const { data } = await supabase.from('memories').select('*').order('date', { ascending: false });
            if (data) setMemories(data);
        };
        fetchMemories();
    }, []);

    return (
        <div className="pb-20">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-serif text-slate-800">Recuerdos 📸</h1>
                <button className="p-2 bg-rose-100 rounded-full text-rose-500 hover:bg-rose-200">
                    <CloudUpload className="w-6 h-6" />
                </button>
            </header>

            {memories.length === 0 ? (
                <div className="text-center p-10 bg-white/40 rounded-3xl border border-white/60">
                    <p className="text-slate-500">Sube nuestra primera foto...</p>
                </div>
            ) : (
                <div className="columns-2 md:columns-3 gap-4 space-y-4">
                    {memories.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="break-inside-avoid relative group rounded-2xl overflow-hidden shadow-md"
                        >
                            <img
                                src={memory.image_url}
                                alt={memory.description}
                                className="w-full h-auto object-cover"
                            />
                            {memory.description && (
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                    <p className="text-white text-sm text-center font-medium">{memory.description}</p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Memories;
