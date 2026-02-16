import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Quote, Sparkles, Clock, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';
import AIChat from './AIChat';
import MoodTracker from './MoodTracker';
import DailyTrivia from './DailyTrivia';

const Dashboard = () => {
    const { user } = useAuth();
    const [timeLeft, setTimeLeft] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0 });
    const [quote, setQuote] = useState({ text: "Eres mi lugar favorito en el mundo.", author: "vdpcza" });
    const [showCounter, setShowCounter] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    const isAdmin = user?.role === 'admin';

    const startDateStr = import.meta.env.VITE_KEY_DATE || '18/06/2024';

    useEffect(() => {
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
            const { data, error } = await supabase.from('quotes').select('*');
            if (error) console.error("Error fetching quotes:", error);
            if (data && data.length > 0) {
                const random = data[Math.floor(Math.random() * data.length)];
                setQuote(random);
            }
        };
        fetchQuote();

        return () => clearInterval(timer);
    }, [startDateStr]);

    return (
        <div className="space-y-8 pb-32">
            {/* Elegant Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center pt-4"
            >
                <div className="relative mb-6">
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute inset-0 bg-rose-500/20 blur-2xl rounded-full"
                    />
                    <div className="relative glass p-4 rounded-full border-rose-500/30">
                        <Heart className="w-10 h-10 text-rose-500 fill-rose-500" />
                    </div>
                </div>
                <h1 className="text-4xl font-serif text-white tracking-widest uppercase">vdpcza</h1>
                <p className="text-[10px] text-rose-400 font-bold tracking-[.4em] uppercase mt-2">Nuestra Historia</p>

                <AnimatePresence>
                    {showWelcome && user && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="mt-6 glass px-6 py-3 rounded-2xl flex items-center gap-3 border-rose-500/20"
                        >
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-serif italic text-white/90">
                                {isAdmin ? '¡Bienvenido, Administrador de Amor!' : '¡Bienvenida, mi Niña Linda! ✨'}
                            </span>
                            <button onClick={() => setShowWelcome(false)} className="text-white/40 hover:text-white ml-2 text-lg">&times;</button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Live Status */}
            <MoodTracker />

            {/* Counter Section - Redesigned */}
            <motion.section
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 relative overflow-hidden group border-rose-500/20 shadow-[0_0_30px_rgba(244,63,94,0.15)]"
            >
                {/* Dynamic Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-indigo-500/5 opacity-50" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-rose-500/10 blur-3xl rounded-full animate-pulse" />

                <div className="absolute top-4 left-4 text-white/5">
                    <Clock size={80} strokeWidth={1} />
                </div>

                {!showCounter ? (
                    <div className="text-center py-8 relative z-10 flex flex-col items-center">
                        <Heart className="w-12 h-12 text-rose-500 mb-6 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-bounce" />
                        <p className="text-white font-serif italic text-xl leading-relaxed mb-8 max-w-xs">
                            "No me gusta contar el tiempo cuando estoy contigo, pero para celebrar cada segundo a tu lado..."
                        </p>
                        <button
                            onClick={() => setShowCounter(true)}
                            className="px-8 py-4 glass-button border-rose-500/30 text-white font-bold uppercase tracking-[.2em] hover:bg-rose-500/20 hover:border-rose-500/50 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Ver Mágia ✨
                        </button>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                    >
                        <h2 className="text-xs uppercase tracking-[.4em] text-rose-300 mb-10 font-black text-center drop-shadow-md">Nuestro Infinito</h2>

                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <CounterItem value={timeLeft.years} label="Años" primary />
                            <CounterItem value={timeLeft.months} label="Meses" primary />
                            <CounterItem value={timeLeft.days} label="Días" primary />
                        </div>

                        <div className="flex justify-center gap-8 border-t border-white/5 pt-8 bg-white/5 rounded-2xl p-4 backdrop-blur-sm">
                            <CounterItem value={timeLeft.hours} label="Horas" />
                            <div className="w-px bg-white/10 h-10 self-center" />
                            <CounterItem value={timeLeft.minutes} label="Minutos" />
                        </div>

                        <button
                            onClick={() => setShowCounter(false)}
                            className="mt-8 w-full text-[9px] text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
                        >
                            Volver al secreto
                        </button>
                    </motion.div>
                )}
            </motion.section>

            {/* Activity Quests */}
            <DailyTrivia />

            {/* Premium Quote */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass-card p-8 border-r-4 border-indigo-500/40 relative group"
            >
                <div className="absolute top-0 right-0 p-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-colors">
                    <Quote size={40} />
                </div>
                <p className="text-2xl font-serif italic text-white/90 leading-relaxed mb-6 pr-8">
                    "{quote.text}"
                </p>
                <div className="flex items-center gap-3 justify-end">
                    <div className="h-px w-8 bg-indigo-500/30" />
                    <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
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
    <div className="text-center flex flex-col items-center relative group">
        <motion.span
            key={value}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`block font-outfit font-black ${primary ? 'text-5xl text-gradient drop-shadow-lg' : 'text-2xl text-white/80'}`}
        >
            {value}
        </motion.span>
        <span className={`text-[8px] uppercase font-black tracking-[.2em] mt-2 ${primary ? 'text-rose-400' : 'text-slate-500'}`}>{label}</span>
    </div>
);

export default Dashboard;
