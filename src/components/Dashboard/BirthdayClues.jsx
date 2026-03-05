import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const BirthdayClues = () => {
    const now = new Date();

    // Testing override using URL param ?testBirthday=true
    const urlParams = new URLSearchParams(window.location.search);
    const testMode = urlParams.get('testBirthday') === 'true';

    const isMarch = now.getMonth() === 2; // 0-indexed, 2 is March
    const currentDay = testMode ? 12 : now.getDate();

    const isBirthdayMode = testMode || (isMarch && currentDay >= 2 && currentDay <= 12);

    if (!isBirthdayMode) return null;

    // Pistas dia a dia (del 2 al 12 de marzo)
    const dailyClues = {
        2: "Hoy empieza la cuenta regresiva... pero tu regalo no se puede envolver en una caja.",
        3: "Será una experiencia inolvidable para nosotros.",
        4: "Tiene que ver con paisajes hermosos y desconexión total de la rutina.",
        5: "Yo sé lo mucho que nos gusta descubrir lugares mágicos juntos",
        6: "No te hagas aun el piercing del omgligo, yo te lo regalo en el momento oportuno",
        7: "Ve pensando en ropa cómoda, tal vez un traje de baño o un buen abrigo, quién sabe...",
        8: "Para ir atando cabos, tendrás que usar toda tu imaginación y sentido aventurero.",
        9: "Solo faltan 3 días para tu sorpresa y la emoción no me cabe en el pecho.",
        10: "Ya puedes ir sacando la maleta, porque nuestra aventura empieza en un par de días.",
        11: "Mañana es tu cumpleaños. El inicio de nuestra próxima gran historia... duerme bien.",
        12: "¡LLEGÓ EL DÍA!"
    };

    const currentClue = dailyClues[currentDay] || "¡Pronto habrá una gran sorpresa!";

    return (
        <div className="relative mb-16 mt-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-8 rounded-[2.5rem] relative overflow-hidden group border border-rose-400/30 shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] bg-rose-500/5"
            >
                {/* Soft background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 opacity-100" />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-4 rounded-2xl transition-colors bg-rose-500/20 text-rose-300">
                            <Star size={24} className="animate-pulse fill-rose-300/50" />
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-medium text-rose-50">Sorpresa de Hoy</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[.3em] text-rose-300/50 mt-1">Pistas escondidas</p>
                        </div>
                    </div>
                </div>

                <motion.div
                    key={currentDay}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative z-10 text-center"
                >
                    {currentDay < 12 ? (
                        <div className="space-y-6 glass p-8 rounded-3xl bg-amber-500/5 border border-amber-300/20 shadow-inner">
                            <p className="text-[10px] uppercase tracking-widest text-amber-300/70 font-bold mb-2">Pista del Día ({currentDay} de Marzo)</p>
                            <p className="text-2xl font-serif text-white/90 leading-relaxed font-medium">"{currentClue}"</p>
                            <p className="text-xs text-rose-200/50 mt-6 italic">Vuelve mañana para una nueva pista especial...</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="p-8 rounded-[20px] bg-rose-500/10 border border-amber-400/30 backdrop-blur-sm shadow-[0_0_30px_rgba(251,191,36,0.15)] overflow-hidden relative"
                        >
                            <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/20 blur-3xl rounded-full" />
                            <h3 className="text-3xl font-serif text-amber-300 mb-4 font-bold relative z-10">Pase a la Aventura</h3>
                            <p className="text-sm font-serif italic text-rose-200/80 mb-8 relative z-10">
                                ¡Feliz Cumpleaños, amor! Tu regalo principal es una escapada a Guatapé alojados en el Viajero Hostel.
                            </p>
                            <a
                                href="https://check-in.hospy.co/viajero-guatape/9743857079518"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block relative z-10 px-8 py-4 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[12px] uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform"
                            >
                                Ver Mi Regalo Oficial
                            </a>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default BirthdayClues;
