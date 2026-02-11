import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Heart, Loader } from 'lucide-react';
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
            <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
                <div className="glass p-8 rounded-2xl text-center max-w-md w-full">
                    <Heart className="w-16 h-16 text-rose-400 mx-auto mb-4 animate-bounce" />
                    <h2 className="text-2xl font-serif text-slate-800 mb-2">¡Revisa tu correo!</h2>
                    <p className="text-slate-600">Hemos enviado un enlace mágico a <strong>{email}</strong>.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-rose-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 rounded-3xl max-w-md w-full text-center relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-300 to-rose-500" />

                <h1 className="text-4xl font-serif text-slate-800 mb-2">vdpcza</h1>
                <p className="text-slate-500 mb-8 font-light italic">Tu espacio, mi espacio, nuestro universo.</p>

                <form onSubmit={handleLogin} className="space-y-4">
                    <input
                        type="email"
                        placeholder="Tu correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:ring-2 focus:ring-rose-300 focus:border-transparent outline-none bg-white/50 backdrop-blur-sm transition-all"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-rose-400 hover:bg-rose-500 text-white font-medium py-3 rounded-xl transition-colors shadow-lg shadow-rose-200/50 flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader className="animate-spin" /> : 'Entrar con Magia ✨'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
