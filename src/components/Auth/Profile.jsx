import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Camera, Mail, Shield, Save, LogOut, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../supabaseClient';

const Profile = () => {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [profile, setProfile] = useState({
        full_name: '',
        avatar_url: '',
        bio: '',
        role: 'user'
    });
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (user) fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) setProfile(data);
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: profile.full_name,
                    bio: profile.bio,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (error) throw error;
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (error) {
            alert('Error al actualizar: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    const handleAvatarUpload = async (event) => {
        try {
            setUpdating(true);
            const file = event.target.files[0];
            if (!file) return;

            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Math.random()}.${fileExt}`;
            const filePath = `avatars/${fileName}`;

            // Upload to a hypothetical 'avatars' bucket (create it in Storage first!)
            const { error: uploadError } = await supabase.storage
                .from('memories') // Reusing memories bucket for now to simplify
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('memories')
                .getPublicUrl(filePath);

            const { error: updateError } = await supabase
                .from('profiles')
                .update({ avatar_url: publicUrl })
                .eq('id', user.id);

            if (updateError) throw updateError;
            setProfile({ ...profile, avatar_url: publicUrl });

        } catch (error) {
            alert('Error al subir foto: ' + error.message);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <Loader className="animate-spin text-rose-500" size={32} />
        </div>
    );

    return (
        <div className="space-y-8 pb-32">
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <h1 className="text-3xl font-serif text-white tracking-wider mb-2">Tu Perfil</h1>
                <p className="text-[10px] text-rose-400 font-black uppercase tracking-[.3em]">Gestión de Cuenta</p>
            </motion.header>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-8 relative overflow-hidden"
            >
                <div className="flex flex-col items-center gap-6">
                    {/* Avatar Selection */}
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-rose-500/20 glass shadow-2xl relative">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-rose-500/10">
                                    <User size={48} className="text-rose-500/40" />
                                </div>
                            )}
                            {updating && (
                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                    <Loader className="animate-spin text-white" />
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 p-3 bg-rose-500 rounded-full cursor-pointer shadow-xl hover:scale-110 transition-transform active:scale-90">
                            <Camera size={18} className="text-white" />
                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                        </label>
                    </div>

                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                            <h2 className="text-xl font-serif text-white">{profile.full_name || 'Sin nombre'}</h2>
                            {profile.role === 'admin' && (
                                <Shield size={16} className="text-rose-400" title="Administrador" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">{user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleUpdate} className="mt-10 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-4">Nombre Completo</label>
                        <input
                            type="text"
                            value={profile.full_name}
                            onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:ring-2 focus:ring-rose-500/20 outline-none text-white text-sm"
                            placeholder="Tu nombre..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black tracking-widest ml-4">Tu Mensaje o Estado</label>
                        <textarea
                            value={profile.bio}
                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                            className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/5 focus:ring-2 focus:ring-rose-500/20 outline-none text-white text-sm min-h-[100px]"
                            placeholder="Escribe algo sobre ti..."
                        />
                    </div>

                    <div className="flex gap-4">
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={updating}
                            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 shadow-lg shadow-rose-950/20"
                        >
                            {updating ? <Loader className="animate-spin" size={16} /> : <><Save size={16} /> Guardar Cambios</>}
                        </motion.button>

                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            type="button"
                            onClick={() => signOut()}
                            className="px-6 bg-white/5 hover:bg-white/10 text-slate-400 py-4 rounded-2xl border border-white/5"
                        >
                            <LogOut size={18} />
                        </motion.button>
                    </div>
                </form>

                <AnimatePresence>
                    {showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 px-6 py-3 rounded-full"
                        >
                            <CheckCircle size={14} className="text-emerald-400" />
                            <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">¡Actualizado!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* User Access Info Card */}
            <div className="glass-card p-6 border-l-4 border-rose-500/40">
                <div className="flex items-center gap-4">
                    <div className="p-3 glass rounded-xl text-rose-500">
                        <Shield size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Nivel de Acceso</p>
                        <p className="text-sm text-white font-medium">
                            {profile.role === 'admin' ? 'Administrador del Universo' : 'Usuario Invitado'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
