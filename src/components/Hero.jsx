import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
    const [timeLeft, setTimeLeft] = useState({ years: 0, months: 0, days: 0 });

    // Parse the key date from env or use fallback
    const keyDateStr = import.meta.env.VITE_KEY_DATE || '01/01/2020';

    useEffect(() => {
        const calculateTime = () => {
            // Parse DD/MM/YYYY
            const [day, month, year] = keyDateStr.split('/').map(Number);
            const startDate = new Date(year, month - 1, day);
            const now = new Date();

            let years = now.getFullYear() - startDate.getFullYear();
            let months = now.getMonth() - startDate.getMonth();
            let days = now.getDate() - startDate.getDate();

            if (days < 0) {
                months -= 1;
                // Get days in previous month
                const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
                days += prevMonth.getDate();
            }

            if (months < 0) {
                years -= 1;
                months += 12;
            }

            setTimeLeft({ years, months, days });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000 * 60 * 60); // Update every hour is enough for days

        return () => clearInterval(timer);
    }, [keyDateStr]);

    return (
        <div className="relative h-[60vh] w-full flex items-center justify-center overflow-hidden">
            {/* Background Image Placeholder - In real app, replacing with actual image */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-200 to-rose-100 z-0">
                {/* If user provides image, un-comment the img tag below */}
                <img
                    src="/hero.jpg"
                    alt="Nosotros"
                    className="w-full h-full object-cover opacity-50 mix-blend-overlay"
                    onError={(e) => e.target.style.display = 'none'}
                />
            </div>

            <div className="relative z-10 text-center px-4">
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-7xl font-script text-rose-500 mb-6 drop-shadow-md"
                >
                    Juntos desde...
                </motion.h1>

                <div className="flex justify-center gap-4 md:gap-8 text-slate-700">
                    <CounterItem value={timeLeft.years} label="Años" delay={0.2} />
                    <CounterItem value={timeLeft.months} label="Meses" delay={0.4} />
                    <CounterItem value={timeLeft.days} label="Días" delay={0.6} />
                </div>
            </div>
        </div>
    );
};

const CounterItem = ({ value, label, delay }) => (
    <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay, type: "spring", stiffness: 100 }}
        className="flex flex-col items-center bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg w-20 md:w-28"
    >
        <span className="text-3xl md:text-5xl font-bold text-rose-400 font-sans">{value}</span>
        <span className="text-xs md:text-sm font-light uppercase tracking-wider mt-1">{label}</span>
    </motion.div>
);

export default Hero;
