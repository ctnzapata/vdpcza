import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import Confetti from 'react-confetti';
import { TriviaRepository } from '../../repositories/TriviaRepository';

const DailyTrivia = () => {
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [showConfetti, setShowConfetti] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestion = async () => {
            const fetchedQ = await TriviaRepository.getDailyQuestion();
            if (fetchedQ) {
                setQuestion(fetchedQ);
            } else {
                // Fallback hardcoded if DB fails or empty
                setQuestion({
                    question: "¿Cuál es mi comida favorita?",
                    options: ["Pizza", "Sushi", "Hamburguesa", "Tacos"],
                    correct_answer: "Hamburguesa"
                });
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
                className="glass-card p-10 border-none relative overflow-hidden group"
            >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 blur-[50px] -z-10 group-hover:bg-rose-500/10 transition-colors duration-1000" />

                <div className="flex items-center gap-3 text-rose-500/40 mb-8">
                    <HelpCircle size={18} className="animate-pulse" />
                    <h3 className="font-bold text-[9px] uppercase tracking-[.4em] text-white/30">Reto de Pareja</h3>
                </div>

                <p className="text-2xl font-serif text-white/90 leading-snug mb-10 tracking-wide">
                    {question.question}
                </p>

                <div className="space-y-2">
                    {question.options.map((opt, i) => {
                        const isSelected = selectedAnswer === opt;
                        const isCorrectOpt = opt === question.correct_answer;

                        let style = 'bg-white/[0.02] border-none text-white/40 hover:bg-white/[0.05] hover:text-white/80';
                        let Icon = null;

                        if (selectedAnswer) {
                            if (isCorrectOpt) {
                                style = 'bg-green-500/10 border-none text-green-400 font-bold';
                                Icon = CheckCircle2;
                            } else if (isSelected) {
                                style = 'bg-rose-500/10 border-none text-rose-400';
                                Icon = XCircle;
                            } else {
                                style = 'bg-transparent border-none text-white/20 opacity-50';
                            }
                        }

                        return (
                            <button
                                key={i}
                                disabled={!!selectedAnswer}
                                onClick={() => handleAnswer(opt)}
                                className={`w-full p-5 rounded-[20px] text-left text-sm transition-all duration-300 flex justify-between items-center ${style}`}
                            >
                                <span className="tracking-wide">{opt}</span>
                                {Icon && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon size={20} strokeWidth={1.5} /></motion.div>}
                            </button>
                        );
                    })}
                </div>

                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-center mt-8"
                        >
                            <p className={`text-[9px] font-black uppercase tracking-[.4em] ${isCorrect ? 'text-green-500/80' : 'text-rose-500/50'}`}>
                                {isCorrect ? '✨ Conexión Perfecta ✨' : 'Sigue intentándolo, mi amor'}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default DailyTrivia;
