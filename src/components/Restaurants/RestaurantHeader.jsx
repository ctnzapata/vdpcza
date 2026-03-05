import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const RestaurantHeader = ({ onAddClick }) => {
    return (
        <header className="flex justify-between items-end px-4 pt-10 pb-6 relative z-10">
            <div>
                <p className="text-[10px] text-rose-400 font-bold uppercase tracking-[.4em] mb-2">Guía Culinaria</p>
                <h1 className="text-4xl sm:text-5xl font-serif text-white tracking-tight">Lugares Mágicos</h1>
            </div>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onAddClick}
                className="w-12 h-12 flex items-center justify-center bg-rose-500 text-white rounded-full shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] hover:scale-105 transition-all"
            >
                <Plus size={20} />
            </motion.button>
        </header>
    );
};

export default RestaurantHeader;
