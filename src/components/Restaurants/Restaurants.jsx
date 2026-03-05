import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, X, Trash2 } from 'lucide-react';
import { RestaurantRepository } from '../../repositories/RestaurantRepository';

import RestaurantHeader from './RestaurantHeader';
import RestaurantCard from './RestaurantCard';
import FloatingActionDock from '../Memories/FloatingActionDock';

const Restaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingRes, setEditingRes] = useState(null);
    const [selectedRes, setSelectedRes] = useState(null); // For reviews
    const [newRes, setNewRes] = useState({ name: '', cuisine: '', location: '', image_url: '' });

    const fetchRestaurants = async () => {
        const data = await RestaurantRepository.getRestaurants();
        setRestaurants(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingRes) {
                await RestaurantRepository.updateRestaurant(editingRes.id, newRes);
            } else {
                await RestaurantRepository.createRestaurant(newRes);
            }
            setShowModal(false);
            setEditingRes(null);
            setNewRes({ name: '', cuisine: '', location: '', image_url: '' });
            fetchRestaurants();
        } catch (error) {
            alert("Error: " + error.message);
        }
    };

    const deleteRes = async (id) => {
        if (window.confirm('¿Eliminar este restaurante de nuestra guía?')) {
            try {
                await RestaurantRepository.deleteRestaurant(id);
                fetchRestaurants();
            } catch (error) {
                alert("Error al eliminar: " + error.message);
            }
        }
    };

    return (
        <div className="space-y-8 pb-48 relative min-h-screen">
            {/* Dynamic Michelin Background */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[#050505]" />
                <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] bg-amber-900/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-rose-900/5 rounded-full blur-[120px]" />
            </div>

            <RestaurantHeader onAddClick={() => { setShowModal(true); setEditingRes(null); setNewRes({ name: '', cuisine: '', location: '', image_url: '' }); }} />

            <div className="px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-10 max-w-6xl mx-auto">
                {loading ? (
                    <div className="col-span-full py-32 text-center text-rose-500/50 animate-pulse text-[10px] uppercase tracking-[.4em]">Buscando reservas...</div>
                ) : restaurants.length === 0 ? (
                    <div className="col-span-full glass-card p-16 sm:p-24 text-center border-dashed border-white/5 flex flex-col items-center justify-center rounded-[3rem]">
                        <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Utensils className="w-10 h-10 text-rose-400/50" />
                        </div>
                        <p className="text-white/40 font-serif italic text-2xl mb-8 max-w-sm">El mapa está en blanco. ¿Dónde será nuestra próxima cita?</p>
                        <button onClick={() => setShowModal(true)} className="px-8 py-4 bg-rose-500 rounded-full text-white text-[10px] font-black uppercase tracking-[.3em] shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:scale-105 transition-transform">Agregar Lugar</button>
                    </div>
                ) : (
                    restaurants.map((res, idx) => (
                        <RestaurantCard
                            key={res.id}
                            res={res}
                            idx={idx}
                            onEdit={() => { setEditingRes(res); setNewRes(res); setShowModal(true); }}
                            onDelete={() => deleteRes(res.id)}
                            onReviews={() => setSelectedRes(res)}
                        />
                    ))
                )}
            </div>

            {/* Modal for CRUD Restaurant */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />
                        <motion.form
                            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            onSubmit={handleSave}
                            className="relative glass-card rounded-[40px] p-8 sm:p-12 max-w-md w-full border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.8)]"
                        >
                            <button type="button" onClick={() => setShowModal(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors"><X size={20} /></button>
                            <h2 className="text-3xl font-serif text-white mb-8 pr-8">{editingRes ? 'Editar Experiencia' : 'Nueva Experiencia'}</h2>
                            <div className="space-y-5">
                                <div>
                                    <label className="text-[10px] text-rose-400 uppercase font-black tracking-widest block mb-2 px-1">Nombre del Lugar</label>
                                    <input autoFocus placeholder="El Rincón Italiano..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500 focus:bg-white/5 transition-all text-lg font-serif" value={newRes.name} onChange={e => setNewRes({ ...newRes, name: e.target.value })} required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-1">
                                        <label className="text-[10px] text-rose-400 uppercase font-black tracking-widest block mb-2 px-1">Cocina</label>
                                        <input placeholder="Italiana..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500 focus:bg-white/5 transition-all text-sm" value={newRes.cuisine} onChange={e => setNewRes({ ...newRes, cuisine: e.target.value })} />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="text-[10px] text-rose-400 uppercase font-black tracking-widest block mb-2 px-1">Ubicación</label>
                                        <input placeholder="Centro histórico..." className="w-full bg-slate-900 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-rose-500 focus:bg-white/5 transition-all text-sm" value={newRes.location} onChange={e => setNewRes({ ...newRes, location: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest block mb-2 px-1">URL de la Imagen (Paster Link)</label>
                                    <input placeholder="https://..." className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-white/50 focus:outline-none focus:border-rose-500 focus:bg-white/5 transition-all text-xs" value={newRes.image_url} onChange={e => setNewRes({ ...newRes, image_url: e.target.value })} />
                                </div>
                            </div>
                            <button type="submit" className="w-full mt-10 py-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white rounded-full text-[10px] font-black uppercase tracking-[.3em] shadow-[0_10px_30px_rgba(244,63,94,0.4)] hover:scale-105 transition-transform">
                                {editingRes ? 'Guardar Cambios' : 'Añadir a la Guía'}
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
        const data = await RestaurantRepository.getReviews(restaurant.id);
        setReviews(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchReviews();
    }, [restaurant.id]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        try {
            await RestaurantRepository.addReview({ ...newReview, restaurant_id: restaurant.id });
            setNewReview({ rating: 5, comment: '' });
            fetchReviews();
        } catch (error) {
            alert("Error al añadir opinión: " + error.message);
        }
    };

    const deleteReview = async (id) => {
        try {
            await RestaurantRepository.deleteReview(id);
            fetchReviews();
        } catch (error) {
            alert("Error al eliminar opinión: " + error.message);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" />
            <motion.div
                initial={{ y: '100%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative w-full max-w-2xl bg-slate-900 border-t sm:border border-white/10 rounded-t-[3rem] sm:rounded-[3rem] overflow-hidden flex flex-col h-[90vh] sm:h-[85vh] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]"
            >
                {/* Header (Review Card Cover) */}
                <div className="relative h-48 sm:h-56 w-full flex-shrink-0">
                    <img src={restaurant.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80'} alt={restaurant.name} className="w-full h-full object-cover filter brightness-[0.4]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />

                    <button onClick={onClose} className="absolute top-6 right-6 p-3 bg-black/50 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:bg-black/80 transition-all border border-white/10 z-10"><X size={20} /></button>

                    <div className="absolute bottom-6 left-8 right-8">
                        <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.4em] mb-1">Diario Gastronómico</p>
                        <h3 className="text-4xl font-serif text-white tracking-tight drop-shadow-lg">{restaurant.name}</h3>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-900">

                    {/* Add Review Form */}
                    <form onSubmit={handleAddReview} className="bg-slate-950/50 p-6 rounded-3xl border border-white/5 space-y-5">
                        <div className="flex gap-2 justify-center py-2">
                            {[1, 2, 3, 4, 5].map(s => (
                                <button key={s} type="button" onClick={() => setNewReview({ ...newReview, rating: s })} className={`transition-transform duration-300 ${newReview.rating >= s ? 'text-amber-400 scale-125' : 'text-slate-800 hover:scale-110'}`}>
                                    <Star size={28} fill={newReview.rating >= s ? 'currentColor' : 'none'} strokeWidth={1.5} />
                                </button>
                            ))}
                        </div>
                        <textarea placeholder="¿Qué fue lo mejor de esta cita?..." className="w-full bg-slate-900 border border-white/5 rounded-[2rem] p-5 text-sm text-white/90 resize-none font-serif italic focus:outline-none focus:border-rose-500/50 transition-colors" rows={3} value={newReview.comment} onChange={e => setNewReview({ ...newReview, comment: e.target.value })} required />
                        <button type="submit" className="w-full py-4 bg-white text-slate-900 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:text-rose-600 transition-colors shadow-lg">Dejar Recuerdo</button>
                    </form>

                    {/* Review List */}
                    <div className="space-y-4 pb-12">
                        {loading ? <p className="py-12 text-center text-[10px] text-rose-500/50 tracking-[.3em] font-bold uppercase animate-pulse">Leyendo el diario...</p> : reviews.length === 0 ? (
                            <p className="text-center text-slate-500 font-serif italic py-8">Aún no hay reseñas escritas sobre este lugar.</p>
                        ) : reviews.map((rev, i) => (
                            <motion.div key={rev.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] relative group hover:bg-white/[0.04] transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex gap-1 bg-amber-900/10 border border-amber-500/20 px-3 py-1.5 rounded-full">
                                        {[...Array(5)].map((_, idx) => (
                                            <Star key={idx} size={10} className={idx < rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} />
                                        ))}
                                    </div>
                                    <button onClick={() => deleteReview(rev.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-full"><Trash2 size={14} /></button>
                                </div>
                                <p className="text-lg text-slate-300 font-serif leading-relaxed px-1">"{rev.comment}"</p>
                                <div className="mt-4 flex items-center gap-2 px-1">
                                    <div className="w-8 h-[1px] bg-rose-500/30" />
                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{new Date(rev.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric', day: 'numeric' })}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Restaurants;
