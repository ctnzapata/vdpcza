import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Quote, Sparkles, Clock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GiftRepository } from '../../repositories/GiftRepository';
import { QuoteRepository } from '../../repositories/QuoteRepository';
import AIChat from './AIChat';
import MoodTracker from './MoodTracker';
import DailyTrivia from './DailyTrivia';
import { setupPushNotifications } from '../../utils/pushUtils';

const Dashboard = () => {
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0 });
    const [quote, setQuote] = useState({ text: "Eres mi lugar favorito en el mundo.", author: "vdpcza" });
    const [showCounter, setShowCounter] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    const isAdmin = user?.role === 'admin';

    const startDateStr = import.meta.env.VITE_KEY_DATE || '18/06/2024';

    const [newGiftNotification, setNewGiftNotification] = useState(false);

    useEffect(() => {
        const checkGifts = async () => {
            const unseenCount = await GiftRepository.getUnseenGiftsCount();
            setNewGiftNotification(unseenCount);
        };

        checkGifts();

        const calculateTime = () => {
            const [day, month, year] = startDateStr.split('/').map(Number);
            const start = new Date(year, month - 1, day);
            const now = new Date();

            let years = now.getFullYear() - start.getFullYear();
            let months = now.getMonth() - start.getMonth();
            let days = now.getDate() - start.getDate();
            let hours = now.getHours() - start.getHours();
            let minutes = now.getMinutes() - start.getMinutes();

            if (minutes < 0) { minutes += 60; hours--; }
            if (hours < 0) { hours += 24; days--; }
            if (days < 0) {
                months--;
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) { years--; months += 12; }
            setTimeLeft({ years, months, days, hours, minutes });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000 * 60);

        const fetchQuote = async () => {
            const fetchedQuote = await QuoteRepository.getRandomQuote();
            if (fetchedQuote) {
                setQuote(fetchedQuote);
            }
        };
        fetchQuote();

        if (user?.id) {
            setupPushNotifications(user.id);
        }

        return () => clearInterval(timer);
    }, [startDateStr, isAdmin, user]); // Re-run if admin status changes

    return (
        <div className="space-y-16 pb-32">
            {/* Elegant Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center pt-8"
            >
                <div className="relative mb-8">
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 bg-rose-500/10 blur-3xl rounded-full"
                    />
                    <div className="relative glass p-6 rounded-full border-none">
                        <Heart className="w-10 h-10 text-rose-500 fill-rose-500 animate-pulse" />
                    </div>
                </div>
                <h1 className="text-4xl font-serif text-white tracking-widest uppercase">vdpcza</h1>
                <p className="text-[10px] text-rose-400 font-bold tracking-[.4em] uppercase mt-2">Nuestra Historia</p>

                <AnimatePresence>
                    {showWelcome && user && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-8 px-6 py-3 flex items-center gap-3 bg-white/5 border border-white/[0.02] rounded-full backdrop-blur-xl"
                        >
                            <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">
                                {isAdmin ? 'Administrador' : 'Mi Niña Linda'}
                            </span>
                            <button onClick={() => setShowWelcome(false)} className="text-white/30 hover:text-white ml-2 text-sm transition-colors">&times;</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Notifications */}
            {newGiftNotification > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-6 rounded-[32px] flex items-center justify-between gap-4 border-none shadow-[0_20px_40px_-15px_rgba(244,63,94,0.2)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/[0.05] rounded-full">
                            <Sparkles className="w-5 h-5 text-rose-400 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Algo especial</p>
                            <h3 className="text-sm font-bold text-white">Tienes {newGiftNotification} sorpresa{newGiftNotification > 1 ? 's' : ''}</h3>
                        </div>
                    </div>
                    <a href="/gifts" className="px-6 py-3 bg-rose-500/10 text-rose-400 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-rose-500 hover:text-white transition-all">
                        Abrir
                    </a>
                </motion.div>
            )}

            {/* Mood Tracker */}
            <MoodTracker />

            {/* Counter Section - Redesigned to be minimalist */}
            <motion.section
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-10 relative overflow-hidden group border-none"
            >
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-rose-500/5 blur-[80px] rounded-full" />
                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full" />

                <div className="absolute top-6 left-6 text-white/[0.03]">
                    <Clock size={100} strokeWidth={0.5} />
                </div>

                {!showCounter ? (
                    <div className="text-center py-12 relative z-10 flex flex-col items-center">
                        <Heart className="w-8 h-8 text-rose-500/50 mb-8" />
                        <p className="text-white/80 font-serif italic text-2xl leading-relaxed mb-12 max-w-sm">
                            "No me gusta contar el tiempo cuando estoy contigo..."
                        </p>
                        <button
                            onClick={() => setShowCounter(true)}
                            className="px-8 py-3 bg-white/[0.03] border border-white/[0.05] rounded-full text-white/60 text-[10px] font-black uppercase tracking-[.3em] hover:bg-white/[0.08] hover:text-white transition-all transform hover:-translate-y-1"
                        >
                            Revelar
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative z-10 py-6"
                    >
                        <h2 className="text-[10px] uppercase tracking-[.5em] text-white/40 mb-12 font-black text-center">Nuestro Tiempo</h2>

                        <div className="grid grid-cols-3 gap-8 mb-12">
                            <CounterItem value={timeLeft.years} label="Años" primary />
                            <CounterItem value={timeLeft.months} label="Meses" primary />
                            <CounterItem value={timeLeft.days} label="Días" primary />
                        </div>

                        <div className="flex justify-center gap-10">
                            <CounterItem value={timeLeft.hours} label="Horas" />
                            <CounterItem value={timeLeft.minutes} label="Min." />
                        </div>

                        <button
                            onClick={() => setShowCounter(false)}
                            className="mt-12 w-full text-center text-[8px] text-white/30 uppercase tracking-[.3em] hover:text-white/60 transition-colors"
                        >
                            Ocultar
                        </button>
                    </motion.div>
                )}
            </motion.section>



            {/* Activity Quests */}
            <DailyTrivia />

            {/* Premium Quote (Minimalist) */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-10 border-none relative group"
            >
                <div className="absolute top-6 right-6 text-white/[0.02] group-hover:text-white/[0.05] transition-colors">
                    <Quote size={80} />
                </div>
                <div className="relative z-10 w-full flex flex-col items-center text-center">
                    <p className="text-3xl font-serif text-white/90 leading-snug mb-8 font-medium">
                        "{quote.text}"
                    </p>
                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-[.4em]">
                        {quote.author || 'vdpcza'}
                    </p>
                </div>
            </motion.section>

            {/* AI Assistant FAB */}
            <AIChat />
        </div>
    );
};

const CounterItem = ({ value, label, primary }) => (
    <div className="text-center flex flex-col items-center">
        <motion.span
            key={value}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`block font-outfit ${primary ? 'text-6xl font-light text-white tracking-tighter' : 'text-3xl font-light text-white/60 tracking-tighter'}`}
        >
            {value.toString().padStart(2, '0')}
        </motion.span>
        <span className={`text-[9px] uppercase font-black tracking-[.3em] mt-3 ${primary ? 'text-white/40' : 'text-white/20'}`}>{label}</span>
    </div>
);

export default Dashboard;
