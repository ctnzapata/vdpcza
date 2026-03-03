import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Lock, Unlock, Sparkles, Mail, Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import { GiftRepository } from '../../repositories/GiftRepository';
import { useAuth } from '../../context/AuthContext';
import { notifyPartner } from '../../utils/sendPushNotification';

const Gifts = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const [gifts, setGifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLetter, setSelectedLetter] = useState(null);
    const [editingGift, setEditingGift] = useState(null); // For Add/Edit modal

    const fetchGifts = async () => {
        const data = await GiftRepository.getGifts();
        setGifts(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchGifts();
    }, []);

    const handleEnvelopeClick = (gift) => {
        if (!gift.is_received && !isAdmin) { // Admin can always see content
            alert('🔒 Este regalo está bloqueado. Ten paciencia, muy pronto lo podrás ver. PD: TE AMO');
        } else {
            // Mark as seen when opened
            if (gift.id) {
                localStorage.setItem(`vdpcza_seen_${gift.id}`, 'true');
                // Trigger a storage event for other components to update
                window.dispatchEvent(new Event('storage'));
            }
            setSelectedLetter(gift);
        }
    };

    const toggleLock = async (e, gift) => {
        e.stopPropagation();
        if (!isAdmin) return;

        try {
            await GiftRepository.toggleLock(gift.id, gift.is_received);
            fetchGifts();

            // Si estaba bloqueado (false) y ahora se desbloqueó (true), avisar
            if (!gift.is_received) {
                notifyPartner(user.id, "🔓 ¡Se ha desbloqueado una sorpresa!", `Puedes ir a leer: ${gift.title}`, "/gifts");
            }
        } catch (error) {
            alert('Error toggling lock: ' + error.message);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!confirm('¿Seguro que quieres borrar este sobre?')) return;

        try {
            await GiftRepository.deleteGift(id);
            fetchGifts();
        } catch (error) {
            alert('Error deleting gift: ' + error.message);
        }
    };

    const handleEditClick = (e, gift) => {
        e.stopPropagation();
        setEditingGift(gift);
    };

    const handleSaveGift = async (e) => {
        e.preventDefault();
        const giftData = {
            title: editingGift.title,
            description: editingGift.description,
            is_received: editingGift.is_received ?? false
        };

        try {
            if (editingGift.id) {
                await GiftRepository.updateGift(editingGift.id, giftData);
            } else {
                await GiftRepository.createGift(giftData);
                // Notificar sobre un sobre nuevo creado
                if (giftData.is_received) {
                    notifyPartner(user.id, "💌 Tienes una nueva carta", "Hice algo especial, ya puedes abrirlo.");
                } else {
                    notifyPartner(user.id, "✨ He preparado una sorpresa", "Hay un nuevo sobre secreto esperando por ti...");
                }
            }
            setEditingGift(null);
            fetchGifts();
        } catch (error) {
            alert('Error saving gift: ' + error.message);
        }
    };

    return (
        <div className="space-y-12 pb-32">
            <header className="px-1 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-serif text-white">Cartas & Regalos</h1>
                    <p className="text-sm font-medium text-rose-400 mt-2 tracking-wide">Nuestra Colección de Momentos</p>
                </div>
                {isAdmin && (
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingGift({ title: '', description: '', is_received: false })}
                        className="p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-all border border-white/10 shadow-sm"
                    >
                        <Plus size={20} />
                    </motion.button>
                )}
            </header>

            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse text-xs tracking-widest uppercase">Buscando sobres...</div>
            ) : gifts.length === 0 ? (
                <div className="text-center py-20 text-slate-500 text-sm italic font-serif">Aún no hay cartas mágicas.</div>
            ) : (
                <div className="grid grid-cols-1 gap-8">
                    {gifts.map((gift, idx) => (
                        <motion.div
                            key={gift.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => handleEnvelopeClick(gift)}
                            className={`relative aspect-[4/3] sm:aspect-[3/1] rounded-3xl cursor-pointer group transition-all duration-500 transform overflow-hidden ${gift.is_received
                                ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-lg hover:-translate-y-1'
                                : 'bg-[#1c1c1e] border border-white/10 text-slate-400 hover:border-white/20 hover:bg-[#2c2c2e]'
                                }`}
                        >
                            {/* Admin Controls */}
                            {isAdmin && (
                                <div className="absolute top-4 right-4 z-20 flex gap-2">
                                    <button onClick={(e) => toggleLock(e, gift)} className="p-2 glass rounded-full text-white hover:bg-white/20">
                                        {gift.is_received ? <Unlock size={14} /> : <Lock size={14} />}
                                    </button>
                                    <button onClick={(e) => handleEditClick(e, gift)} className="p-2 glass rounded-full text-blue-300 hover:bg-blue-500/20">
                                        <Pencil size={14} />
                                    </button>
                                    <button onClick={(e) => handleDelete(e, gift.id)} className="p-2 glass rounded-full text-red-300 hover:bg-red-500/20">
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                                {gift.is_received ? (
                                    <>
                                        <Sparkles className="w-12 h-12 text-white animate-pulse" />
                                        <div>
                                            <h3 className="font-serif text-2xl font-bold mb-1">{gift.title}</h3>
                                            <p className="font-serif italic text-sm opacity-80 decoration-rose-200">¡Clic para leer!</p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Mail className="w-12 h-12 opacity-30" />
                                        <div className="flex flex-col items-center">
                                            <h3 className="text-lg font-serif mb-1 opacity-80">{gift.title}</h3>
                                            <p className="text-xs font-semibold uppercase tracking-widest opacity-60 mb-2">Bloqueado</p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Envelope Flap Effect */}
                            {!gift.is_received && (
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 rounded-t-[32px] origin-top transform group-hover:scale-y-90 transition-transform hidden sm:block" />
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Read Letter Modal */}
            <AnimatePresence>
                {selectedLetter && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedLetter(null)} className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" />
                        <motion.div
                            initial={{ scale: 0.8, rotate: -2, opacity: 0 }}
                            animate={{ scale: 1, rotate: 0, opacity: 1 }}
                            exit={{ scale: 0.8, rotate: 2, opacity: 0 }}
                            className="relative bg-[#fff1f2] text-slate-900 p-8 sm:p-12 rounded-[2px] max-w-lg w-full shadow-2xl overflow-y-auto max-h-[80vh]"
                            style={{ backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '100% 28px', lineHeight: '28px' }}
                        >
                            <h2 className="text-2xl font-serif font-bold text-rose-600 mb-6 text-center">{selectedLetter.title}</h2>
                            <div className="font-serif text-lg whitespace-pre-line mb-8 text-slate-800">
                                {selectedLetter.description}
                            </div>
                            <p className="text-right font-serif italic text-rose-500 mt-8">— Con todo mi amor</p>

                            <button onClick={() => setSelectedLetter(null)} className="mt-8 w-full py-3 bg-rose-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-rose-600 shadow-md transition-colors">
                                Guardar Carta
                            </button>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit/Create Modal */}
            <AnimatePresence>
                {editingGift && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingGift(null)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />
                        <motion.form
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onSubmit={handleSaveGift}
                            className="relative glass rounded-[32px] p-8 max-w-md w-full border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif text-white">{editingGift.id ? 'Editar Carta' : 'Nueva Carta'}</h2>
                                <button type="button" onClick={() => setEditingGift(null)} className="p-2 text-white/50 hover:text-white"><X size={20} /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Título del Sobre</label>
                                    <input
                                        type="text"
                                        placeholder="Ej: Para cuando me extrañes..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all font-serif"
                                        value={editingGift.title}
                                        onChange={e => setEditingGift({ ...editingGift, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-white/50">Contenido de la Carta</label>
                                    <textarea
                                        placeholder="Escribe aquí tu mensaje secreto..."
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white outline-none focus:border-rose-500/50 focus:bg-white/10 transition-all min-h-[200px] font-serif leading-relaxed"
                                        value={editingGift.description}
                                        onChange={e => setEditingGift({ ...editingGift, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors" onClick={() => setEditingGift({ ...editingGift, is_received: !editingGift.is_received })}>
                                    <div className={`w-10 h-6 rounded-full relative transition-colors ${editingGift.is_received ? 'bg-rose-500' : 'bg-slate-600'}`}>
                                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${editingGift.is_received ? 'left-5' : 'left-1 shadow-sm'}`} />
                                    </div>
                                    <span className="text-sm font-medium text-white/80">¿Desbloqueado inmediatamente?</span>
                                </div>
                            </div>

                            <button type="submit" className="w-full mt-8 py-4 bg-rose-500 text-white rounded-2xl font-bold uppercase tracking-wider shadow-md hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
                                <Save size={18} />
                                <span>Guardar</span>
                            </button>
                        </motion.form>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gifts;
