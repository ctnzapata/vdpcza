import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, MapPin, CloudSun, Calendar, ChevronRight } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import Globe3D from './Globe3D';

const Travel = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list');

    useEffect(() => {
        const fetchTrips = async () => {
            const { data } = await supabase.from('trips').select('*').order('start_date', { ascending: true });
            if (data) setTrips(data);
            setLoading(false);
        };
        fetchTrips();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center p-20 space-y-4">
            <CloudSun className="animate-spin w-12 h-12 text-rose-400" />
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Cargando destinos...</p>
        </div>
    );

    return (
        <div className="space-y-8 pb-32">
            <header className="flex justify-between items-center px-1">
                <div>
                    <h1 className="text-4xl font-serif text-white">Viajes</h1>
                    <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mt-1">Explorando el mundo</p>
                </div>

                <div className="flex glass rounded-2xl p-1 border border-white/5">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'list' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Lista
                    </button>
                    <button
                        onClick={() => setViewMode('globe')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'globe' ? 'bg-rose-500 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        3D
                    </button>
                </div>
            </header>

            <AnimatePresence mode="wait">
                {viewMode === 'globe' ? (
                    <motion.div
                        key="globe"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        className="glass-card p-4 overflow-hidden relative min-h-[450px] flex flex-col items-center justify-center border-white/10"
                    >
                        <Globe3D trips={trips.filter(t => t.is_revealed)} />
                        <div className="absolute bottom-6 left-0 right-0 px-8">
                            <div className="glass bg-slate-900/40 p-3 rounded-2xl border-white/10 text-center">
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Gira el mundo para ver nuestros destinos ✨</p>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                    >
                        {trips.length === 0 ? (
                            <div className="glass-card p-12 text-center border-dashed border-white/10">
                                <MapPin className="w-12 h-12 text-slate-700 mx-auto mb-4" />
                                <h2 className="text-xl font-serif text-slate-400">Pronto llenaremos el mapa</h2>
                            </div>
                        ) : (
                            trips.map((trip, index) => <TripCard key={trip.id} trip={trip} index={index} />)
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TripCard = ({ trip, index }) => {
    const { is_revealed, destination_name, start_date, end_date, image_url, hotel_info } = trip;

    if (!is_revealed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-8 relative flex items-center gap-6 group hover:border-white/20"
            >
                <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center border-white/10 shrink-0">
                    <Lock className="w-8 h-8 text-slate-500 group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                    <h3 className="text-xl font-serif text-slate-400">Próximo Destino</h3>
                    <p className="text-[9px] text-slate-600 uppercase tracking-[.3em] font-black mt-1">Bloqueado por amor</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-3xl -z-10" />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card group"
        >
            <div className="relative h-56">
                <img
                    src={image_url || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000'}
                    alt={destination_name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                        <p className="text-[9px] text-rose-400 font-bold uppercase tracking-[.3em] mb-1">Destino Desbloqueado</p>
                        <h2 className="text-3xl font-serif text-white">{destination_name}</h2>
                    </div>
                </div>
            </div>

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 glass rounded-xl border-white/10">
                            <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-300 font-medium tracking-wide">{start_date} - {end_date}</span>
                    </div>
                </div>

                <div className="glass bg-white/5 border-white/5 p-4 rounded-2xl flex items-center justify-between group-hover:border-white/10 transition-all">
                    <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-rose-500" />
                        <span className="text-sm font-serif text-white">{hotel_info || 'Hotel Boutique'}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:translate-x-1 transition-transform" />
                </div>
            </div>
        </motion.div>
    );
};

export default Travel;
