import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, MessageSquare, Edit2, Trash2 } from 'lucide-react';

const RestaurantCard = ({ res, idx, onEdit, onDelete, onReviews }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative glass-card overflow-hidden group border-white/10 rounded-[2rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] cursor-pointer"
            onClick={onReviews}
        >
            {/* Spotlight Image with Parallax & Zoom */}
            <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-slate-900 rounded-[2rem]">
                <motion.img
                    src={res.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'}
                    alt={res.name}
                    className="w-full h-full object-cover transform transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 opacity-80 group-hover:opacity-70 transition-opacity duration-700" />

                {/* Floating Tags (Glass Pilled) */}
                <div className="absolute top-6 left-6">
                    <span className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        {res.cuisine || 'Especial'}
                    </span>
                </div>

                {/* Admin Actions (subtle) */}
                <div onClick={(e) => e.stopPropagation()} className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button onClick={onEdit} className="w-10 h-10 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white/70 hover:text-white hover:bg-black/60 transition-all border border-white/10">
                        <Edit2 size={14} />
                    </button>
                    <button onClick={onDelete} className="w-10 h-10 flex items-center justify-center bg-rose-500/20 backdrop-blur-md rounded-full text-rose-300 hover:text-white hover:bg-rose-500 transition-all border border-rose-500/30">
                        <Trash2 size={14} />
                    </button>
                </div>

                {/* Editorial Content */}
                <div className="absolute bottom-6 left-6 right-6">
                    <div className="flex justify-between items-end">
                        <div className="flex-1">
                            <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight drop-shadow-xl leading-none">
                                {res.name}
                            </h2>
                            <div className="flex items-center gap-2 mt-3 text-white/60">
                                <MapPin size={14} className="text-rose-400" />
                                <span className="text-xs font-light italic truncate">
                                    {res.location || 'Localización secreta...'}
                                </span>
                            </div>
                        </div>

                        {/* Interactive Review Button Indicator */}
                        <div className="w-12 h-12 flex items-center justify-center rounded-full glass bg-white/5 border border-white/20 text-white transform group-hover:-translate-y-2 group-hover:bg-white/20 transition-all duration-300 shadow-xl">
                            <MessageSquare size={18} />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default RestaurantCard;
