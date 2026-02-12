import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Loader, Sparkles, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await signIn(email);
        if (error) {
            alert('Error al enviar el link mágico: ' + error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    if (sent) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
                <div className="aurora-container">
                    <div className="aurora-blob aurora-1" />
                    <div className="aurora-blob aurora-2" />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-12 text-center max-w-md w-full border-rose-500/20 shadow-[0_32px_128px_rgba(244,63,94,0.2)]"
                >
                    <div className="p-6 glass rounded-full w-24 h-24 mx-auto mb-8 border-rose-500/30">
                        <Heart className="w-full h-full text-rose-500 fill-rose-500 animate-pulse" />
                    </div>
                    <h2 className="text-3xl font-serif text-white mb-4">¡Revisa tu correo!</h2>
                    <p className="text-slate-400 leading-relaxed font-light italic">
                        Hemos enviado un enlace mágico a <br />
                        <span className="text-rose-400 font-bold not-italic">{email}</span>
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
            {/* Animated Aurora Background */}
            <div className="aurora-container">
                <div className="aurora-blob aurora-1" />
                <div className="aurora-blob aurora-2" />
                <div className="aurora-blob aurora-3" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass rounded-[48px] p-10 sm:p-14 max-w-md w-full text-center relative overflow-hidden shadow-[0_32px_128px_rgba(0,0,0,0.8)] border border-white/10"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500/0 via-rose-500/40 to-rose-500/0" />

                <div className="flex flex-col items-center mb-12">
                    <div className="p-4 glass rounded-3xl border-rose-500/20 mb-6 bg-rose-500/5">
                        <Heart className="w-10 h-10 text-rose-500" />
                    </div>
                    <h1 className="text-5xl font-serif text-white tracking-[.1em] uppercase">vdpcza</h1>
                    <div className="flex items-center gap-3 mt-4">
                        <div className="h-px w-6 bg-rose-500/30" />
                        <p className="text-[10px] text-rose-400/60 font-black uppercase tracking-[.4em]">Nuestro Universo</p>
                        <div className="h-px w-6 bg-rose-500/30" />
                    </div>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative group">
                        <input
                            type="email"
                            placeholder="Introduce tu correo..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-6 py-5 rounded-[24px] bg-white/5 border border-white/5 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500/20 outline-none transition-all placeholder:text-slate-600 text-white text-center tracking-wide"
                            required
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-500 hover:bg-rose-600 text-white font-black uppercase tracking-[.25em] text-[10px] py-5 rounded-[24px] transition-all shadow-2xl shadow-rose-950 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader className="animate-spin" size={18} /> : (
                            <>
                                <span>Entrar con Magia</span>
                                <Sparkles size={16} className="text-white/60" />
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="mt-12 text-[10px] text-slate-500 uppercase tracking-[.3em] font-medium opacity-40">
                    vdpcza · 2024
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
