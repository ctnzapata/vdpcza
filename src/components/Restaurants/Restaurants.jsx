import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, MapPin, Plus, Trash2, MessageSquare, ChevronRight, X, Edit2 } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRes, setEditingRes] = useState(null);
    const [selectedRes, setSelectedRes] = useState(null); // For reviews
    const [newRes, setNewRes] = useState({ name: '', cuisine: '', location: '', image_url: '' });

    const fetchRestaurants = async () => {
        const { data } = await supabase.from('restaurants').select('*').order('created_at', { ascending: false });
        if (data) setRestaurants(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (editingRes) {
            await supabase.from('restaurants').update(newRes).eq('id', editingRes.id);
        } else {
            await supabase.from('restaurants').insert([newRes]);
        }
        setShowModal(false);
        setEditingRes(null);
        setNewRes({ name: '', cuisine: '', location: '', image_url: '' });
        fetchRestaurants();
    };

    const deleteRes = async (id) => {
        if (window.confirm('¿Eliminar este restaurante?')) {
            await supabase.from('restaurants').delete().eq('id', id);
            fetchRestaurants();
        }
    };

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-end px-1">
                <div>
                    <h1 className="text-4xl font-serif text-white">Nuestros Lugares</h1>
                    <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">Sabores que amamos</p>
                </div>
                <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => { setShowModal(true); setEditingRes(null); setNewRes({ name: '', cuisine: '', location: '', image_url: '' }); }}
                    className="p-4 glass rounded-2xl text-white border-white/20 hover:bg-white/10"
                >
                    <Plus size={20} />
                </motion.button>
            </header>

            <div className="grid grid-cols-1 gap-8">
                {loading ? (
                    <div className="p-20 text-center"><p className="text-slate-500 animate-pulse text-[10px] uppercase tracking-widest">Buscando mesas...</p></div>
                ) : restaurants.length === 0 ? (
                    <div className="glass-card p-12 text-center border-dashed border-white/10">
                        <Utensils className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                        <p className="text-slate-400 font-serif italic">Aún no hemos anotado ningún sitio...</p>
                    </div>
                ) : (
                    restaurants.map((res, idx) => (
                        <motion.div
                            key={res.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card overflow-hidden group border-white/10"
                        >
                            <div className="relative h-48 overflow-hidden">
                                <img src={res.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'} alt={res.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <button onClick={() => { setEditingRes(res); setNewRes(res); setShowModal(true); }} className="p-2 glass rounded-lg text-white hover:bg-white/20 transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => deleteRes(res.id)} className="p-2 glass rounded-lg text-white hover:bg-rose-500/50 transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-serif text-white">{res.name}</h2>
                                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-1">{res.cuisine || 'Comida Variada'}</p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedRes(res)}
                                        className="p-3 glass rounded-2xl border-white/5 text-slate-400 hover:text-white transition-all flex items-center gap-2 group/btn"
                                    >
                                        <MessageSquare size={18} />
                                        <span className="text-[10px] uppercase font-black tracking-widest hidden sm:inline">Opiniones</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400">
                                    <MapPin size={16} className="text-rose-500" />
                                    <span className="text-sm font-light italic truncate">{res.location || 'Dirección no añadida'}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Modal for CRUD Restaurant */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
                        <motion.form
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            onSubmit={handleSave}
                            className="relative glass rounded-[40px] p-8 max-w-sm w-full border-white/10"
                        >
                            <h2 className="text-2xl font-serif text-white mb-6">{editingRes ? 'Editar Lugar' : 'Añadir Lugar'}</h2>
                            <div className="space-y-4">
                                <input placeholder="Nombre del sitio" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} required />
                                <input placeholder="Tipo de cocina (ej. Italiana)" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white" value={newRes.cuisine} onChange={e => setNewRes({ ...newRes, cuisine: e.target.value })} />
                                <input placeholder="Ubicación / Dirección" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white" value={newRes.location} onChange={e => setNewRes({ ...newRes, location: e.target.value })} />
                                <input placeholder="URL de la imagen" className="w-full bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm text-white" value={newRes.image_url} onChange={e => setNewRes({ ...newRes, image_url: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full mt-8 py-5 bg-rose-500 text-white rounded-[24px] text-[10px] font-black uppercase tracking-[.3em] shadow-2xl">
                                {editingRes ? 'Actualizar' : 'Guardar Lugar'}
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>

            {/* Sub-page/Modal for Reviews */}
            <AnimatePresence>
                {selectedRes && (
                    <ReviewsModal restaurant={selectedRes} onClose={() => setSelectedRes(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};

const ReviewsModal = ({ restaurant, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        const { data } = await supabase.from('restaurant_reviews').select('*').eq('restaurant_id', restaurant.id).order('created_at', { ascending: false });
        if (data) setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [restaurant.id]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('restaurant_reviews').insert([{ ...newReview, restaurant_id: restaurant.id }]);
        if (!error) {
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        }
    };

    const deleteReview = async (id) => {
        await supabase.from('restaurant_reviews').delete().eq('id', id);
        fetchReviews();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-950/90 backdrop-blur-md" />
            <motion.div
                initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                className="relative w-full max-w-md bg-slate-900/50 glass rounded-t-[40px] sm:rounded-[40px] border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="p-8 pb-4 flex justify-between items-center bg-gradient-to-b from-white/5 to-transparent">
                    <div>
                        <h3 className="text-2xl font-serif text-white">{restaurant.name}</h3>
                        <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest mt-1">Opiniones de nosotros</p>
                    </div>
                    <button onClick={onClose} className="p-2 glass rounded-full text-white/50 hover:text-white"><X size={20} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                    <form onSubmit={handleAddReview} className="glass bg-white/5 p-6 rounded-3xl border-white/5 space-y-4">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })} className={`transition-all ${newReview.rating >= s ? 'text-yellow-400 scale-110' : 'text-slate-700'}`}>
                                    <Star size={20} fill={newReview.rating >= s ? 'currentColor' : 'none'} />
                                </button>
                            ))}
                        </div>
                        <textarea placeholder="¿Qué nos pareció?..." className="w-full bg-slate-950/50 border border-white/5 rounded-2xl p-4 text-sm text-white resize-none" value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} required />
                        <button type="submit" className="w-full py-3 bg-white/10 text-white rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/20">Publicar</button>
                    </form>

                    <div className="space-y-4">
                        {loading ? <p className="p-8 text-center text-[10px] text-slate-500 tracking-widest animate-pulse">Cargando...</p> : reviews.map((rev, i) => (
                            <motion.div key={rev.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="p-5 glass border-white/5 rounded-[24px] relative group">
                                <div className="flex justify-between items-center mb-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} size={10} className={idx < rev.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-800'} />
                                        ))}
                                    </div>
                                    <button onClick={() => deleteReview(rev.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-500"><Trash2 size={12} /></button>
                                </div>
                                <p className="text-sm text-slate-300 font-light italic">"{rev.comment}"</p>
                                <p className="text-[8px] text-slate-600 uppercase mt-3 tracking-widest">{new Date(rev.created_at).toLocaleDateString()}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Restaurants;
