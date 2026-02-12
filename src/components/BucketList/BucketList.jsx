import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, CheckCircle2, Circle, Plus, Trash2, Rocket } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const BucketList = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [newItem, setNewItem] = useState({ title: '', description: '' });

    const fetchItems = async () => {
        const { data } = await supabase.from('bucket_list').select('*').order('created_at', { ascending: false });
        if (data) setItems(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('bucket_list').insert([newItem]);
        if (!error) {
            setShowAdd(false);
            setNewItem({ title: '', description: '' });
            fetchItems();
        }
    };

    const toggleComplete = async (item) => {
        const { error } = await supabase.from('bucket_list').update({ is_completed: !item.is_completed }).eq('id', item.id);
        if (!error) fetchItems();
    };

    const deleteItem = async (id) => {
        await supabase.from('bucket_list').delete().eq('id', id);
        fetchItems();
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-end px-1">
                <div>
                    <h1 className="text-4xl font-serif text-white">Bucket List</h1>
                    <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">Nuestros Sueños</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowAdd(true)}
                    className="p-4 glass rounded-2xl text-white border-white/20 hover:bg-white/10"
                >
                    <Plus size={20} />
                </motion.button>
            </header>

            <div className="space-y-4">
                {loading ? (
                    <div className="p-20 text-center text-[10px] text-slate-500 uppercase tracking-widest animate-pulse">Soñando en alto...</div>
                ) : items.length === 0 ? (
                    <div className="glass-card p-12 text-center border-dashed border-white/10">
                        <Rocket className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400 font-serif italic">¿Qué aventura será la siguiente?</p>
                    </div>
                ) : (
                    items.map((item, idx) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className={`glass-card p-5 flex items-center gap-4 group transition-all ${item.is_completed ? 'opacity-60 grayscale-[0.5]' : 'border-white/10'}`}
                        >
                            <button
                                onClick={() => toggleComplete(item)}
                                className={`p-2 rounded-xl transition-all ${item.is_completed ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-slate-600 hover:text-white hover:bg-white/10'}`}
                            >
                                {item.is_completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <h3 className={`text-lg font-serif tracking-wide truncate ${item.is_completed ? 'line-through text-slate-500' : 'text-white'}`}>{item.title}</h3>
                                {item.description && <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 truncate">{item.description}</p>}
                            </div>

                            <button onClick={() => deleteItem(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-600 hover:text-rose-500">
                                <Trash2 size={18} />
                            </button>
                        </motion.div>
                    ))
                )}
            </div>

            <AnimatePresence>
                {showAdd && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdd(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
                        <motion.form
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onSubmit={handleAdd}
                            className="relative glass rounded-[40px] p-8 max-w-sm w-full border-white/10"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">Nueva Meta</h2>
                            <div className="space-y-4">
                                <input placeholder="¿Qué vamos a hacer?" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} required />
                                <input placeholder="¿Algún detalle? (opcional)" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white" value={newItem.description} onChange={e => setNewItem({ ...newItem, description: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full mt-8 py-5 bg-rose-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[.3em] shadow-2xl">
                                Añadir a la Lista
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default BucketList;
