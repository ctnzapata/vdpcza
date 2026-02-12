import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { supabase } from '../../supabaseClient';

const DailyTrivia = () => {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            const { data } = await supabase.from('trivia_questions').select('*');
            if (data && data.length > 0) {
                const today = new Date().toDateString();
                const index = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % data.length;
                setQuestion(data[index]);
            }
            setLoading(false);
        };
        fetchQuestion();
    }, []);

    const handleAnswer = (answer) => {
        if (selectedAnswer) return;
        setSelectedAnswer(answer);
        const correct = answer === question.correct_answer;
        setIsCorrect(correct);
        if (correct) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 5000);
        }
    };

    if (loading || !question) return null;

    return (
        <div className="relative">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} gravity={0.3} colors={['#f43f5e', '#6366f1', '#06b6d4']} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border border-white/10 shadow-2xl relative overflow-hidden"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-3xl -z-10" />

                <div className="flex items-center gap-2 text-rose-400 mb-4">
                    <HelpCircle size={20} className="animate-pulse" />
                    <h3 className="font-bold text-[10px] uppercase tracking-[.25em]">Reto de Pareja</h3>
                </div>

                <p className="text-xl font-serif text-white leading-tight mb-6 tracking-wide">
                    {question.question}
                </p>

                <div className="space-y-2">
                    {question.options.map((opt, i) => {
                        const isSelected = selectedAnswer === opt;
                        const isCorrectOpt = opt === question.correct_answer;

                        let style = 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/10';
                        let Icon = null;

                        if (selectedAnswer) {
                            if (isCorrectOpt) {
                                style = 'bg-green-500/20 border-green-500/30 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.2)]';
                                Icon = CheckCircle2;
                            } else if (isSelected) {
                                style = 'bg-red-500/20 border-red-500/30 text-red-400';
                                Icon = XCircle;
                            } else {
                                style = 'bg-white/5 border-white/5 text-slate-600 opacity-50';
                            }
                        }

                        return (
                            <button
                                key={i}
                                disabled={!!selectedAnswer}
                                onClick={() => handleAnswer(opt)}
                                className={`w-full p-4 rounded-2xl text-left text-sm font-medium transition-all duration-300 border flex justify-between items-center ${style}`}
                            >
                                <span className="tracking-wide">{opt}</span>
                                {Icon && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon size={18} /></motion.div>}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-center mt-6"
                        >
                            <p className={`text-[10px] font-bold uppercase tracking-[.3em] ${isCorrect ? 'text-green-400' : 'text-rose-400 opacity-80'}`}>
                                {isCorrect ? '✨ ¡Nivel Experto! ✨' : '💔 ¡Casi! ¡Recuérdalo! 💔'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default DailyTrivia;
