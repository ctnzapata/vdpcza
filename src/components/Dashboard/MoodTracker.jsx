import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Heart, Frown, CloudRain } from 'lucide-react';
import { MoodRepository } from '../../repositories/MoodRepository';
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
            className={`p-6 rounded-[2.5rem] flex items-center gap-5 glass relative overflow-hidden group shadow-[0_20px_40px_-20px_rgba(244,63,94,0.1)]`}
        >
            <div className={`p-4 rounded-[24px] bg-white/[0.03] ${moodInfo.color} transition-transform group-hover:scale-105 border border-[currentColor] border-opacity-10`}>
                <Icon size={26} strokeWidth={1.5} />
            </div>
            <div>
                <p className="text-[10px] font-bold text-rose-300/60 uppercase tracking-[.3em] mb-1.5 flex items-center gap-1.5">
                    Tu pareja se siente <Heart size={10} className="text-rose-400 animate-pulse inline" />
                </p>
                <p className="text-2xl font-serif font-medium text-rose-50/90 tracking-wide">
                    <span className={`${moodInfo.color} font-semibold italic drop-shadow-sm`}>{moodInfo.label}</span>
                </p>
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
            const data = await MoodRepository.getLatestMoods();
            if (data.length > 0) {
                const myLatest = data.find(m => m.user_id === user.id);
                const partnerLatest = data.find(m => m.user_id !== user.id);
                if (myLatest) setCurrentMood(myLatest);
                if (partnerLatest) setPartnerMood(partnerLatest);
            }
        };

        fetchMoods();

        const subscription = MoodRepository.subscribeToMoods(user.id, (newMood) => {
            if (newMood.user_id === user.id) {
                setCurrentMood(newMood);
            } else {
                setPartnerMood(newMood);
            }
        });

        return () => subscription.unsubscribe();
    }, [user]);

    const updateMood = async (type) => {
        if (loading || currentMood?.mood === type) return;

        setLoading(true);
        // Optimistic update
        const optimisticMood = { mood: type, user_id: user.id, created_at: new Date().toISOString() };
        setCurrentMood(optimisticMood);

        try {
            await MoodRepository.insertMood(user.id, type);
        } catch (error) {
            console.error('Error updating mood:', error.message);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-12">
            <PartnerMoodBox partnerMood={partnerMood} />

            <div className="px-2">
                <h3 className="text-[10px] font-black text-rose-200/50 uppercase tracking-[.3em] mb-6 text-center">¿Cómo te sientes hoy, mi amor?</h3>
                <div className="grid grid-cols-4 gap-3">
                    {moods.map(m => {
                        const Icon = m.icon;
                        const isSelected = currentMood?.mood === m.type;
                        return (
                            <button
                                key={m.type}
                                onClick={() => updateMood(m.type)}
                                disabled={loading}
                                className={`group flex flex-col items-center gap-3 p-4 rounded-[24px] transition-all duration-300 relative ${isSelected
                                    ? `bg-white/[0.04] ${m.color} shadow-[0_10px_20px_-10px_currentColor] border border-[currentColor] border-opacity-20 transform scale-105`
                                    : 'bg-transparent text-rose-100/30 hover:text-rose-100/80 hover:bg-white/[0.02]'
                                    }`}
                            >
                                <Icon size={24} strokeWidth={isSelected ? 2 : 1.5} className={`transition-all duration-300 ${isSelected ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110 group-hover:stroke-2'}`} />
                                <span className={`text-[8px] uppercase font-bold tracking-widest transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{m.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MoodTracker;
