import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Quote, Sparkles, Clock } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import AIChat from './AIChat';
import MoodTracker from './MoodTracker';
import DailyTrivia from './DailyTrivia';

const Dashboard = () => {
    const [timeLeft, setTimeLeft] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0 });
    const [quote, setQuote] = useState({ text: "Eres mi lugar favorito en el mundo.", author: "vdpcza" });

    const startDateStr = import.meta.env.VITE_KEY_DATE || '14/02/2024';

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
            const { data } = await supabase.from('quotes').select('*');
            if (data && data.length > 0) {
                const random = data[Math.floor(Math.random() * data.length)];
                setQuote(random);
            }
        };
        fetchQuote();

        return () => clearInterval(timer);
    }, []);

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
            </motion.header>

            {/* Live Status */}
            <MoodTracker />

            {/* Counter Section */}
            <motion.section
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass-card p-8 relative"
            >
                <div className="absolute top-4 left-4 text-white/5">
                    <Clock size={80} strokeWidth={1} />
                </div>

                <h2 className="text-[10px] uppercase tracking-[.3em] text-slate-400 mb-8 font-bold text-center">Tiempo Juntos</h2>

                <div className="grid grid-cols-3 gap-6 mb-8 relative z-10">
                    <CounterItem value={timeLeft.years} label="Años" />
                    <CounterItem value={timeLeft.months} label="Meses" />
                    <CounterItem value={timeLeft.days} label="Días" />
                </div>
                <div className="flex justify-center gap-12 relative z-10 border-t border-white/5 pt-6">
                    <CounterItem value={timeLeft.hours} label="Horas" small />
                    <CounterItem value={timeLeft.minutes} label="Minutos" small />
                </div>
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

const CounterItem = ({ value, label, small }) => (
    <div className={`text-center flex flex-col items-center ${small ? 'opacity-80' : ''}`}>
        <motion.span
            key={value}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`block ${small ? 'text-2xl' : 'text-4xl'} font-outfit font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]`}
        >
            {value}
        </motion.span>
        <span className="text-[9px] text-slate-500 uppercase font-black tracking-widest mt-1">{label}</span>
    </div>
);

export default Dashboard;
