import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Quote } from 'lucide-react';
import { supabase } from '../../supabaseClient';

const Dashboard = () => {
    const [timeLeft, setTimeLeft] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0 });
    const [quote, setQuote] = useState({ text: "Eres mi lugar favorito en el mundo.", author: "Anónimo" });

    // Configuration
    const startDateStr = import.meta.env.VITE_KEY_DATE || '14/02/2024';

    useEffect(() => {
        // Timer Logic
        const calculateTime = () => {
            // Parse DD/MM/YYYY
            const [day, month, year] = startDateStr.split('/').map(Number);
            const start = new Date(year, month - 1, day);
            const now = new Date();

            let years = now.getFullYear() - start.getFullYear();
            let months = now.getMonth() - start.getMonth();
            let days = now.getDate() - start.getDate();
            let hours = now.getHours() - start.getHours();
            let minutes = now.getMinutes() - start.getMinutes();

            if (minutes < 0) {
                minutes += 60;
                hours--;
            }
            if (hours < 0) {
                hours += 24;
                days--;
            }
            if (days < 0) {
                months--;
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }
            if (months < 0) {
                years--;
                months += 12;
            }
            setTimeLeft({ years, months, days, hours, minutes });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000 * 60);

        // Quote Logic (Fetch random quote)
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
        <div className="space-y-6 pb-20">
            {/* Header */}
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <div className="inline-block p-3 rounded-full bg-rose-100 mb-2">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse" />
                </div>
                <h1 className="text-3xl font-serif text-slate-800">vdpcza</h1>
            </motion.header>

            {/* Counter Card */}
            <motion.section
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass p-6 rounded-3xl text-center relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Heart className="w-32 h-32" />
                </div>

                <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-4">Juntos Desde Hace</h2>

                <div className="grid grid-cols-3 gap-4 mb-4">
                    <CounterItem value={timeLeft.years} label="Años" />
                    <CounterItem value={timeLeft.months} label="Meses" />
                    <CounterItem value={timeLeft.days} label="Días" />
                </div>
                <div className="grid grid-cols-2 gap-4 max-w-[200px] mx-auto">
                    <CounterItem value={timeLeft.hours} label="Horas" small />
                    <CounterItem value={timeLeft.minutes} label="Minutos" small />
                </div>
            </motion.section>

            {/* Quote Card */}
            <motion.section
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="glass p-6 rounded-3xl border-l-4 border-rose-400"
            >
                <Quote className="w-8 h-8 text-rose-300 mb-2" />
                <p className="text-xl font-serif italic text-slate-700 mb-4">
                    "{quote.text}"
                </p>
                <p className="text-sm text-right text-slate-500 uppercase tracking-wide">
                    — {quote.author || 'Anónimo'}
                </p>
            </motion.section>
        </div>
    );
};

const CounterItem = ({ value, label, small }) => (
    <div className={`text-center ${small ? 'scale-90' : ''}`}>
        <span className="block text-3xl font-bold text-rose-500">{value}</span>
        <span className="text-xs text-slate-400 uppercase">{label}</span>
    </div>
);

export default Dashboard;
