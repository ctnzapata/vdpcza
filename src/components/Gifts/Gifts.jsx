import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, ExternalLink, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Gifts = () => {
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newGift, setNewGift] = useState({ title: '', description: '', link: '', is_received: false });

    const fetchGifts = async () => {
        const { data } = await supabase.from('gifts').select('*').order('created_at', { ascending: false });
        if (data) setGifts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleAddGift = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('gifts').insert([newGift]);
        if (!error) {
            setShowAddModal(false);
            setNewGift({ title: '', description: '', link: '', is_received: false });
            fetchGifts();
        }
    };

    const toggleReceived = async (gift) => {
        const { error } = await supabase
            .from('gifts')
            .update({ is_received: !gift.is_received })
            .eq('id', gift.id);
        if (!error) fetchGifts();
    };

    const deleteGift = async (id) => {
        const { error } = await supabase.from('gifts').delete().eq('id', id);
        if (!error) fetchGifts();
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-end px-1">
                <div>
                    <h1 className="text-4xl font-serif text-white">Regalos</h1>
                    <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">Deseos y Sorpresas</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAddModal(true)}
                    className="p-4 glass rounded-2xl text-white border-white/20 hover:bg-white/10"
                >
                    <Plus size={20} />
                </motion.button>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="p-20 text-center"><p className="text-slate-500 animate-pulse text-[10px] uppercase tracking-widest">Cargando tesoros...</p></div>
                ) : gifts.length === 0 ? (
                    <div className="glass-card p-12 text-center border-dashed border-white/10">
                        <Gift className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400 font-serif italic">¿Qué te gustaría recibir o regalar?</p>
                    </div>
                ) : (
                    gifts.map((gift, idx) => (
                        <motion.div
                            key={gift.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-6 border-white/10 relative group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex gap-4">
                                    <div className={`p-4 rounded-2xl glass ${gift.is_received ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 'bg-white/5 text-slate-500 border-white/5'}`}>
                                        <Gift size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-serif ${gift.is_received ? 'text-white' : 'text-slate-300'}`}>{gift.title}</h3>
                                        {gift.is_received && <p className="text-[8px] text-rose-400 font-black uppercase tracking-widest mt-1">¡Recibido!</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => toggleReceived(gift)} className="p-2 glass rounded-lg text-slate-400 hover:text-green-400 transition-colors">
                                        <CheckCircle2 size={18} />
                                    </button>
                                    <button onClick={() => deleteGift(gift.id)} className="p-2 glass rounded-lg text-slate-400 hover:text-rose-400 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 leading-relaxed mb-6 font-light">{gift.description}</p>

                            {gift.link && (
                                <a
                                    href={gift.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 w-full py-4 glass bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-slate-300 hover:bg-white/10 border-white/5"
                                >
                                    <span>Ver más detalles</span>
                                    <ExternalLink size={14} />
                                </a>
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showAddModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAddModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
                        <motion.form
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onSubmit={handleAddGift}
                            className="relative glass rounded-[40px] p-8 max-w-sm w-full border-white/10"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">Nuevo Regalo</h2>
                            <div className="space-y-4">
                                <input
                                    placeholder="Nombre del regalo"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-rose-500/20 transition-all"
                                    value={newGift.title} onChange={e => setNewGift({ ...newGift, title: e.target.value })} required
                                />
                                <textarea
                                    placeholder="Descripción corta..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-rose-500/20 transition-all min-h-[100px]"
                                    value={newGift.description} onChange={e => setNewGift({ ...newGift, description: e.target.value })}
                                />
                                <input
                                    placeholder="Enlace (opcional)"
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-rose-500/20 transition-all"
                                    value={newGift.link} onChange={e => setNewGift({ ...newGift, link: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="w-full mt-8 py-5 bg-rose-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[.3em] shadow-2xl shadow-rose-950">
                                Guardar Deseo
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gifts;
