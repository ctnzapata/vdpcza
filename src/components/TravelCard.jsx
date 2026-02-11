import React from 'react';
import { motion } from 'framer-motion';
import { Lock, MapPin, Calendar } from 'lucide-react';

const TravelCard = ({ travel }) => {
    const { title, destination, image_url, date, unlocked } = travel;

    if (!unlocked) {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative h-80 rounded-2xl overflow-hidden shadow-xl bg-white/20 backdrop-blur-sm border border-white/30 group cursor-pointer"
            >
                <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/50 transition-colors z-10 flex flex-col items-center justify-center text-white">
                    <Lock className="w-12 h-12 mb-3 text-rose-200" />
                    <h3 className="text-xl font-bold font-script tracking-wider">Próxima Aventura</h3>
                    <p className="text-sm opacity-80 mt-1">???</p>
                </div>
                {/* Blurred placeholder if image exists, otherwise pattern */}
                {image_url ? (
                    <img
                        src={image_url}
                        alt="Locked"
                        className="absolute inset-0 w-full h-full object-cover blur-md scale-110"
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400" />
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4 }}
            className="relative h-80 rounded-2xl overflow-hidden shadow-xl group bg-white"
        >
            <div className="absolute inset-0">
                <img
                    src={image_url || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop'}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
                <div className="flex items-center gap-2 mb-1 text-rose-200 text-sm font-medium uppercase tracking-wide">
                    <Calendar className="w-4 h-4" />
                    <span>{date}</span>
                </div>

                <h3 className="text-2xl font-bold font-script mb-2">{title}</h3>

                <div className="flex items-center gap-2 text-slate-200 text-sm">
                    <MapPin className="w-4 h-4" />
                    <span>{destination}</span>
                </div>
            </div>
        </motion.div>
    );
};

export default TravelCard;
