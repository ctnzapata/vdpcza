import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, MapPin, CloudSun, Calendar } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Travel = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            const { data } = await supabase.from('trips').select('*').order('start_date', { ascending: true });
            if (data) setTrips(data);
            setLoading(false);
        };
        fetchTrips();
    }, []);

    if (loading) return <div className="text-center p-10"><CloudSun className="animate-spin w-10 h-10 text-rose-400 mx-auto" /></div>;

    if (trips.length === 0) return (
        <div className="text-center p-10">
            <h2 className="text-xl font-serif text-slate-600">No hay viajes planeados... aún.</h2>
            <p className="text-sm text-slate-400 mt-2">¡Pronto llenaremos el mapa!</p>
        </div>
    );

    return (
        <div className="space-y-6 pb-20">
            <h1 className="text-3xl font-serif text-slate-800 mb-6">Nuestros Viajes ✈️</h1>

            {trips.map((trip, index) => (
                <TripCard key={trip.id} trip={trip} index={index} />
            ))}
        </div>
    );
};

const TripCard = ({ trip, index }) => {
    const { is_revealed, destination_name, start_date, end_date, image_url, hotel_info } = trip;

    if (!is_revealed) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass p-6 rounded-3xl relative overflow-hidden h-48 flex items-center justify-center group"
            >
                <div className="absolute inset-0 bg-slate-200 blur-sm opacity-50" />
                <div className="relative z-10 text-center">
                    <Lock className="w-12 h-12 text-rose-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h3 className="text-xl font-serif text-slate-500">Destino Secreto</h3>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Próximamente</p>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="glass rounded-3xl overflow-hidden shadow-lg"
        >
            <div className="relative h-48">
                <img
                    src={image_url || 'https://via.placeholder.com/400x300'}
                    alt={destination_name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h2 className="text-2xl font-serif text-white">{destination_name}</h2>
                    <div className="flex items-center text-white/80 text-sm gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{start_date} - {end_date}</span>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-rose-500 font-medium">
                    <MapPin className="w-5 h-5" />
                    <span>{hotel_info || 'Hotel Sorpresa'}</span>
                </div>

                {/* Weather Widget Placeholder */}
                <div className="bg-rose-50 rounded-xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <CloudSun className="w-6 h-6 text-yellow-500" />
                        <span className="text-sm text-slate-600">Clima Actual</span>
                    </div>
                    <span className="font-bold text-slate-800">24°C</span>
                </div>

                <p className="text-xs text-center text-slate-400 italic mt-2">
                    ¡Prepara las maletas! ❤️
                </p>
            </div>
        </motion.div>
    );
};

export default Travel;
