import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, MessageCircle } from 'lucide-react';

const AIChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'assistant', text: '¡Hola! Soy tu acompañante de vdpcza. ¿En qué puedo ayudarte hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            let response = "¡Qué lindo lo que dices! Me encantaría ayudarte con eso, pero por ahora sigo aprendiendo sobre vuestra historia. ❤️";
            if (input.toLowerCase().includes('hola')) response = "¡Hola de nuevo! Recordaba cuando me contaste sobre vuestro primer viaje... ¡qué tiempos!";
            if (input.toLowerCase().includes('te quiero')) response = "¡Y yo a vosotros! Sois mi pareja favorita del universo digital. ✨";
            setMessages(prev => [...prev, { role: 'assistant', text: response }]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-28 right-6 z-40 glass p-4 rounded-full shadow-[0_10px_30px_rgba(244,63,94,0.3)] border-rose-500/30 text-rose-500 active:bg-rose-500/20"
            >
                <Sparkles size={24} className="animate-pulse" />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
                        />

                        <motion.div
                            initial={{ y: '100%', opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: '100%', opacity: 0 }}
                            className="relative w-full max-w-md glass rounded-t-[40px] sm:rounded-[40px] shadow-[0_32px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden max-h-[85vh] border-white/10"
                        >
                            {/* Header */}
                            <div className="p-8 bg-gradient-to-br from-rose-500/20 to-indigo-500/20 text-white flex justify-between items-center shrink-0 border-b border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 glass rounded-2xl border-white/20">
                                        <Sparkles size={24} className="text-rose-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-xl tracking-wide">AI Companion</h3>
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                            <p className="text-[9px] uppercase tracking-[.2em] opacity-60 font-black">Conectado</p>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Messages */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950/20">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[85%] p-4 px-6 rounded-[24px] text-sm leading-relaxed shadow-lg ${m.role === 'user'
                                                ? 'bg-rose-500 text-white rounded-tr-none'
                                                : 'glass bg-white/5 text-slate-200 rounded-tl-none border-white/10'
                                            }`}>
                                            {m.text}
                                        </div>
                                    </motion.div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start">
                                        <div className="glass bg-white/5 border-white/10 p-4 px-6 rounded-[24px] rounded-tl-none shadow-sm flex gap-1.5">
                                            <span className="w-1.5 h-1.5 bg-rose-400/50 rounded-full animate-bounce" />
                                            <span className="w-1.5 h-1.5 bg-rose-400/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1.5 h-1.5 bg-rose-400/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Input */}
                            <form onSubmit={handleSend} className="p-6 bg-slate-900/50 border-t border-white/5 flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Escribe algo..."
                                    className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-5 py-4 text-sm focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/20 outline-none transition-all placeholder:text-slate-600 text-white"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    className="bg-rose-500 text-white p-4 rounded-2xl disabled:opacity-30 hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/10 active:scale-95"
                                >
                                    <Send size={20} />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AIChat;
