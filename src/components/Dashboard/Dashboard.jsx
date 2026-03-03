import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Quote, Sparkles, Clock, Star, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GiftRepository } from '../../repositories/GiftRepository';
import { QuoteRepository } from '../../repositories/QuoteRepository';
import AIChat from './AIChat';
import MoodTracker from './MoodTracker';
import DailyTrivia from './DailyTrivia';
import BirthdayCountdown from './BirthdayCountdown';
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
            let seconds = now.getSeconds() - start.getSeconds();

            if (seconds < 0) { seconds += 60; minutes--; }
            if (minutes < 0) { minutes += 60; hours--; }
            if (hours < 0) { hours += 24; days--; }
            if (days < 0) {
                months--;
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) { years--; months += 12; }
            setTimeLeft({ years, months, days, hours, minutes, seconds });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);

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
                <h1 className="text-4xl font-serif text-white tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-rose-100 to-rose-300 drop-shadow-sm">vdpcza</h1>
                <p className="text-[10px] text-rose-300/80 font-bold tracking-[.3em] uppercase mt-2">Nuestra Historia</p>

                <AnimatePresence>
                    {showWelcome && user && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mt-6 px-5 py-2 flex items-center gap-3 bg-white/[0.03] border border-rose-200/10 rounded-full backdrop-blur-xl shadow-[0_0_15px_rgba(244,63,94,0.05)]"
                        >
                            <span className="text-xs font-serif italic text-rose-100/90 tracking-wide">
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
                    className="glass p-6 rounded-[2.5rem] flex items-center justify-between gap-4 border border-rose-500/10 shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="p-3 bg-rose-500/10 rounded-full">
                            <Sparkles className="w-5 h-5 text-rose-300 animate-pulse" />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase font-bold tracking-[.2em] text-rose-300/70 mb-0.5">Algo especial</p>
                            <h3 className="text-sm font-serif text-rose-50">Tienes {newGiftNotification} sorpresa{newGiftNotification > 1 ? 's' : ''}</h3>
                        </div>
                    </div>
                    <a href="/gifts" className="relative z-10 px-6 py-2.5 bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-rose-500 hover:text-white transition-all">
                        Abrir
                    </a>
                </motion.div>
            )}

            {/* Mood Tracker */}
            <MoodTracker />

            {/* Birthday Surprise Countdown */}
            <BirthdayCountdown />

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
                    <motion.div
                        key="hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                        className="text-center py-16 px-6 relative z-10 flex flex-col items-center group cursor-pointer"
                        onClick={() => setShowCounter(true)}
                    >
                        <Heart className="w-10 h-10 text-rose-400/80 mb-6 drop-shadow-[0_0_15px_rgba(244,63,94,0.5)] animate-pulse" />
                        <h2 className="text-xl font-serif text-rose-50 mb-3 font-medium">Nuestro Infinito</h2>
                        <p className="text-sm font-serif italic text-rose-200/70 mb-10 leading-relaxed max-w-sm px-4">
                            "Contigo el tiempo no pasa, se convierte en magia. Descubre cuántos instantes hemos hecho eternos."
                        </p>
                        <button
                            className="px-8 py-3 bg-gradient-to-r from-rose-500/20 to-rose-600/20 border border-rose-400/30 rounded-full text-rose-100 text-[10px] uppercase tracking-[.3em] font-black hover:bg-rose-500 hover:text-white transition-all shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transform hover:-translate-y-1"
                        >
                            Revelar el tiempo
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key="revealed"
                        initial={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="relative z-10 py-10 px-6 rounded-3xl"
                    >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-rose-500/20 blur-[60px] pointer-events-none" />

                        <div className="text-center mb-10 relative z-10">
                            <Sparkles className="w-6 h-6 mx-auto text-rose-300 mb-3" />
                            <h2 className="text-2xl font-serif text-white drop-shadow-md">Cada segundo a tu lado</h2>
                            <p className="text-[9px] uppercase tracking-[.4em] text-rose-200/60 font-black mt-2">Es un regalo del universo</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-400/20 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <CounterItem value={timeLeft.years} label="Años" primary />
                            </div>
                            <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-400/20 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <CounterItem value={timeLeft.months} label="Meses" primary />
                            </div>
                            <div className="p-4 bg-rose-500/10 rounded-3xl border border-rose-400/20 shadow-inner flex flex-col items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                                <CounterItem value={timeLeft.days} label="Días" primary />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 px-4">
                            <div className="flex flex-col items-center justify-center p-2">
                                <CounterItem value={timeLeft.hours} label="Horas" />
                            </div>
                            <div className="flex flex-col items-center justify-center p-2 relative">
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-rose-500/20" />
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[1px] h-8 bg-rose-500/20" />
                                <CounterItem value={timeLeft.minutes} label="Min." />
                            </div>
                            <div className="flex flex-col items-center justify-center p-2">
                                <CounterItem value={timeLeft.seconds} label="Seg." />
                            </div>
                        </div>

                        <button
                            onClick={() => setShowCounter(false)}
                            className="mt-10 mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white/80 hover:border-white/20 transition-all rotate-180"
                        >
                            <ChevronDown size={18} />
                        </button>
                    </motion.div>
                )}
            </motion.section>



            {/* Activity Quests */}
            <DailyTrivia />

            {/* Premium Quote (Romantic) */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-10 border border-rose-500/5 relative group"
            >
                <div className="absolute top-6 right-6 text-rose-500/5 group-hover:text-rose-500/10 transition-colors">
                    <Quote size={80} />
                </div>
                <div className="relative z-10 w-full flex flex-col items-center text-center">
                    <p className="text-3xl font-serif text-rose-50/90 leading-snug mb-8 font-medium">
                        "{quote.text}"
                    </p>
                    <p className="text-[9px] font-bold text-rose-300/60 uppercase tracking-[.4em]">
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
    <div className="text-center w-full">
        <motion.span
            key={value}
            initial={{ y: 5, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            className={`block font-serif ${primary ? 'text-4xl sm:text-5xl text-rose-50 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'text-xl sm:text-2xl text-rose-100/80'}`}
        >
            {value.toString().padStart(2, '0')}
        </motion.span>
        <span className={`block text-[8px] font-black uppercase tracking-[.3em] mt-2 ${primary ? 'text-rose-300/80' : 'text-rose-200/50'}`}>{label}</span>
    </div>
);

export default Dashboard;
