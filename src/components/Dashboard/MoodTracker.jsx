import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Heart, Frown, CloudRain } from 'lucide-react';
import { supabase } from '../../supabaseClient';
import { useAuth } from '../../context/AuthContext';

const moods = [
    { type: 'happy', icon: Smile, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', label: 'Feliz' },
    { type: 'love', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', label: 'Enamorado' },
    { type: 'angry', icon: Frown, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20', label: 'Enojado' },
    { type: 'miss_you', icon: CloudRain, color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', label: 'Extrañándote' }
];

const PartnerMoodBox = ({ partnerMood }) => {
    if (!partnerMood) return null;
    const moodInfo = moods.find(m => m.type === partnerMood.mood) || moods[0];
    const Icon = moodInfo.icon;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-5 rounded-3xl flex items-center gap-4 glass-premium border border-white/10 ${moodInfo.bg} shadow-2xl relative overflow-hidden`}
        >
            {/* Glow effect */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 blur-3xl opacity-30 rounded-full ${moodInfo.bg}`} />

            <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 ${moodInfo.color}`}>
                <Icon size={28} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-[.2em] font-bold mb-1">Tu pareja dice</p>
                <p className="text-xl font-serif text-white tracking-wide">Hoy estoy: <span className={moodInfo.color}>{moodInfo.label.toLowerCase()}</span></p>
            </div>
        </motion.div>
    );
};

const MoodTracker = () => {
    const { user } = useAuth();
    const [currentMood, setCurrentMood] = useState(null);
    const [partnerMood, setPartnerMood] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchMoods = async () => {
            const { data } = await supabase
                .from('moods')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (data) {
                const myLatest = data.find(m => m.user_id === user.id);
                const partnerLatest = data.find(m => m.user_id !== user.id);
                if (myLatest) setCurrentMood(myLatest);
                if (partnerLatest) setPartnerMood(partnerLatest);
            }
        };

        fetchMoods();

        const subscription = supabase
            .channel('moods_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'moods' }, payload => {
                if (payload.new.user_id === user.id) {
                    setCurrentMood(payload.new);
                } else {
                    setPartnerMood(payload.new);
                }
            })
            .subscribe();

        return () => subscription.unsubscribe();
    }, [user]);

    const updateMood = async (type) => {
        if (loading || currentMood?.mood === type) return;

        setLoading(true);
        // Optimistic update
        const optimisticMood = { mood: type, user_id: user.id, created_at: new Date().toISOString() };
        setCurrentMood(optimisticMood);

        const { error } = await supabase
            .from('moods')
            .insert([{ user_id: user.id, mood: type }]);

        if (error) {
            console.error('Error updating mood:', error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <PartnerMoodBox partnerMood={partnerMood} />

            <div className="glass-card p-6 border border-white/5 shadow-inner">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[.25em] mb-6 px-1">¿Cómo estás hoy?</h3>
                <div className="grid grid-cols-4 gap-3">
                    {moods.map(m => {
                        const Icon = m.icon;
                        const isSelected = currentMood?.mood === m.type;
                        return (
                            <button
                                key={m.type}
                                onClick={() => updateMood(m.type)}
                                disabled={loading}
                                className={`group flex flex-col items-center gap-2 p-4 rounded-[20px] transition-all duration-500 relative ${isSelected
                                    ? `bg-white/10 ${m.color} border border-white/20 shadow-lg scale-105`
                                    : 'bg-white/5 border border-white/5 text-slate-500 hover:text-slate-300 hover:border-white/10'
                                    }`}
                            >
                                <Icon size={24} className={`transition-transform duration-500 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className={`text-[8px] uppercase font-bold tracking-widest ${isSelected ? 'opacity-100' : 'opacity-40'}`}>{m.label}</span>
                                {isSelected && (
                                    <motion.div
                                        layoutId="mood-glow"
                                        className={`absolute inset-0 rounded-[20px] blur-md -z-10 opacity-30 ${m.bg}`}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
