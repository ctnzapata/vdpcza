import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Calendar, ExternalLink } from 'lucide-react';
import Confetti from 'react-confetti';

const BirthdayCountdown = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isBirthday, setIsBirthday] = useState(false);
    const [isOpened, setIsOpened] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // Target date: March 12, 2026
    const targetDate = new Date('2026-03-12T00:00:00');

    useEffect(() => {
        const calculateTime = () => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                setIsBirthday(true);
            } else {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleOpen = () => {
        setIsOpened(true);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mx-auto my-8 relative"
        >
            {showConfetti && <Confetti numberOfPieces={300} gravity={0.2} colors={['#fbbf24', '#f43f5e', '#ffffff']} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />}

            <div className="glass-card p-8 border border-amber-300/20 shadow-[0_20px_40px_-15px_rgba(251,191,36,0.15)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-rose-500/5" />
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/20 blur-[50px] rounded-full" />

                <div className="relative z-10 flex flex-col items-center text-center">
                    {!isBirthday ? (
                        <>
                            <div className="p-4 bg-amber-500/10 rounded-full mb-4 border border-amber-500/20">
                                <Calendar className="w-8 h-8 text-amber-300 animate-pulse" />
                            </div>
                            <h3 className="text-xl font-serif text-amber-50 mb-2">Falta poco para tu sorpresa...</h3>
                            <p className="text-[10px] uppercase tracking-[.3em] text-amber-200/60 font-bold mb-6">12 de Marzo</p>

                            <div className="grid grid-cols-4 gap-2 w-full">
                                {[
                                    { v: timeLeft.days, l: 'Días' },
                                    { v: timeLeft.hours, l: 'Hrs' },
                                    { v: timeLeft.minutes, l: 'Min' },
                                    { v: timeLeft.seconds, l: 'Seg' }
                                ].map((t, i) => (
                                    <div key={i} className="flex flex-col items-center bg-white/5 rounded-xl p-2 border border-white/5">
                                        <span className="text-xl font-serif text-amber-100">{t.v.toString().padStart(2, '0')}</span>
                                        <span className="text-[8px] uppercase tracking-widest text-amber-300/50 mt-1">{t.l}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : !isOpened ? (
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            className="flex flex-col items-center"
                        >
                            <div className="p-6 bg-rose-500/20 rounded-full mb-6 border border-rose-400/30 shadow-[0_0_30px_rgba(244,63,94,0.3)] group-hover:scale-110 transition-transform cursor-pointer" onClick={handleOpen}>
                                <Gift className="w-12 h-12 text-rose-300 animate-bounce" />
                            </div>
                            <h3 className="text-2xl font-serif text-white drop-shadow-md mb-2">¡Feliz Cumpleaños, Mi Amorcito!</h3>
                            <p className="text-sm font-serif italic text-rose-200/80 mb-6">Tu regalo está listo. Toca para abrirlo.</p>
                            <button
                                onClick={handleOpen}
                                className="px-8 py-3 bg-gradient-to-r from-rose-500 to-amber-500 rounded-full text-white text-[10px] uppercase tracking-[.3em] font-black shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                            >
                                Descubrir Regalo
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5, rotateY: 90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.8, type: 'spring' }}
                            className="w-full flex flex-col items-center"
                        >
                            <div className="w-full p-6 bg-white/[0.05] rounded-3xl border border-amber-300/30 shadow-inner backdrop-blur-md relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Gift className="w-24 h-24" />
                                </div>
                                <h4 className="text-[10px] text-amber-300 uppercase tracking-widest font-black mb-4">Pase VIP • Escapada Romántica</h4>
                                <h2 className="text-3xl font-serif text-white mb-2 leading-tight">Nos vamos a Guatapé</h2>
                                <p className="text-rose-200/80 italic font-serif text-sm mb-6">Porque te mereces el mundo entero.</p>

                                <div className="space-y-3 text-left bg-black/20 p-4 rounded-xl mb-6">
                                    <p className="text-xs text-white/70"><span className="text-amber-200 font-bold tracking-widest uppercase text-[9px] mr-2">Destino:</span> Viajero Hostel Guatapé</p>
                                    <p className="text-xs text-white/70"><span className="text-amber-200 font-bold tracking-widest uppercase text-[9px] mr-2">Fecha:</span> 14 de Marzo</p>
                                </div>

                                <a
                                    href="https://check-in.hospy.co/viajero-guatape/9743857079518"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex justify-center items-center gap-2 px-6 py-3 bg-amber-500/20 border border-amber-400/50 hover:bg-amber-500/30 text-amber-100 rounded-2xl text-[10px] uppercase tracking-[.2em] font-bold transition-all"
                                >
                                    Ver Reserva <ExternalLink size={14} />
                                </a>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default BirthdayCountdown;
