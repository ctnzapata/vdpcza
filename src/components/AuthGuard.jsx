import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock } from 'lucide-react';

const AuthGuard = ({ onLoginSuccess }) => {
    const [dateInput, setDateInput] = useState('');
    const [error, setError] = useState(false);

    // Default to a placeholder date if env var is missing during dev
    const keyDate = import.meta.env.VITE_KEY_DATE || '01/01/2020';

    const handleSubmit = (e) => {
        e.preventDefault();
        if (dateInput === keyDate) {
            onLoginSuccess();
        } else {
            setError(true);
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="fixed inset-0 bg-rose-50 flex items-center justify-center p-4 z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/50"
            >
                <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="inline-block mb-4"
                >
                    <Heart className="w-12 h-12 text-rose-400 fill-rose-400" />
                </motion.div>

                <h1 className="text-4xl font-script text-slate-800 mb-6">
                    Sorpresa para Vale
                </h1>

                <p className="text-slate-600 mb-8 font-light">
                    Para entrar, necesito que recuerdes nuestra fecha especial...
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="DD/MM/YYYY"
                            value={dateInput}
                            onChange={(e) => setDateInput(e.target.value)}
                            className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${error
                                    ? 'border-red-400 focus:ring-red-200 bg-red-50'
                                    : 'border-rose-200 focus:ring-rose-200 focus:border-rose-400'
                                }`}
                        />
                        <Lock className="absolute right-3 top-3.5 text-rose-300 w-5 h-5" />
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-red-400 text-sm"
                            >
                                Esa no es... inténtalo de nuevo ❤️
                            </motion.p>
                        )}
                    </AnimatePresence>

                    <button
                        type="submit"
                        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg shadow-rose-200/50"
                    >
                        Entrar
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AuthGuard;
