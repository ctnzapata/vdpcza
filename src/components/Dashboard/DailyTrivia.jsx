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

    const isCompleted = selectedAnswer !== null;

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

    // We use `question?.q` or `question?.question` depending on DB. Fallback to question.question for now just in case.
    const questionText = question?.q || question?.question || "¿Pregunta?";

    return (
        <div className="relative">
            {showConfetti && <Confetti numberOfPieces={200} recycle={false} gravity={0.3} colors={['#f43f5e', '#6366f1', '#06b6d4']} style={{ position: 'fixed', inset: 0, zIndex: 100 }} />}

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`glass p-8 rounded-[2.5rem] relative overflow-hidden group border ${isCompleted ? 'border-rose-400/30 shadow-[0_20px_40px_-15px_rgba(244,63,94,0.15)] bg-rose-500/5' : 'border-rose-200/5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.3)] bg-white/[0.02]'}`}
            >
                {/* Soft background glow */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-700 ${isCompleted ? 'opacity-100' : 'opacity-0'}`} />

                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl transition-colors ${isCompleted ? 'bg-rose-500/20 text-rose-300' : 'bg-white/5 text-rose-200/50'}`}>
                            {isCompleted ? <Star size={24} className="animate-pulse fill-rose-300/50" /> : <HelpCircle size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-serif font-medium text-rose-50">Trivia de Hoy</h3>
                            <p className="text-[10px] font-bold uppercase tracking-[.3em] text-rose-300/50 mt-1">Te equivocates, No me conoces es nada</p>
                        </div>
                    </div>
                    {isCompleted && (
                        <span className="px-4 py-1.5 bg-rose-500/20 text-rose-300 text-[9px] font-black uppercase tracking-widest rounded-full border border-rose-500/20">
                            Completado
                        </span>
                    )}
                </div>

                {!isCompleted ? (
                    <div className="space-y-6 relative z-10">
                        <p className="text-lg font-serif text-rose-100/90 leading-relaxed font-medium">"{questionText}"</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {question?.options?.map((opt, i) => {
                                const isSelected = selectedAnswer === opt;
                                const isCorrectOpt = opt === question.correct_answer;

                                let style = 'bg-white/5 border border-rose-100/10 text-rose-100/70 hover:bg-white/10 hover:border-rose-300/30';
                                let Icon = null;

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handleAnswer(opt)}
                                        disabled={isCompleted}
                                        className={`group p-5 rounded-[20px] text-left transition-all duration-300 active:scale-95 disabled:opacity-50 flex items-center gap-4 ${style}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full bg-rose-500/10 text-rose-300 flex items-center justify-center text-xs font-black uppercase shrink-0 transition-colors group-hover:bg-rose-500/20`}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors text-rose-100/70 group-hover:text-rose-50`}>
                                            {opt}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="relative z-10 space-y-4">
                        <div className="p-5 rounded-[20px] bg-rose-500/10 border border-rose-500/20 backdrop-blur-sm">
                            <p className="text-rose-100/60 font-serif italic text-sm text-left mb-4">"{questionText}"</p>

                            <div className="space-y-3">
                                {question?.options?.map((opt, i) => {
                                    const isSelected = selectedAnswer === opt;
                                    const isCorrectOpt = opt === question.correct_answer;

                                    let style = 'bg-white/5 border border-white/5 text-white/40 opacity-50';
                                    let Icon = null;

                                    if (isCorrectOpt) {
                                        style = 'bg-green-500/10 border border-green-500/30 text-green-400 font-semibold';
                                        Icon = CheckCircle2;
                                    } else if (isSelected) {
                                        style = 'bg-rose-500/10 border border-rose-500/30 text-rose-400';
                                        Icon = XCircle;
                                    }

                                    return (
                                        <div key={i} className={`p-4 rounded-xl flex justify-between items-center ${style}`}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">
                                                    {String.fromCharCode(65 + i)}
                                                </div>
                                                <span className="text-sm">{opt}</span>
                                            </div>
                                            {Icon && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Icon size={16} strokeWidth={2} /></motion.div>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                <AnimatePresence>
                    {isCorrect !== null && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-center mt-8"
                        >
                            <p className={`text-xs font-semibold tracking-wide ${isCorrect ? 'text-green-400' : 'text-rose-400'}`}>
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
