import React, { useState, useEffect } from 'react';
import { TimeCapsuleRepository } from '../../repositories/TimeCapsuleRepository';

import CapsuleList from './CapsuleList';
import CapsuleModal from './CapsuleModal';

const TimeCapsules = () => {
    const [capsules, setCapsules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCapsule, setSelectedCapsule] = useState(null);

    useEffect(() => {
        const fetchCapsules = async () => {
            const data = await TimeCapsuleRepository.getCapsules();
            setCapsules(data);
            setLoading(false);
        };
        fetchCapsules();
    }, []);

    const isLocked = (date) => new Date() < new Date(date);

    const getTimeRemaining = (date) => {
        const diff = new Date(date) - new Date();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        return `${days}d ${hours}h`;
    };

    if (loading) return null;
    if (capsules.length === 0) return null;

    return (
        <div className="space-y-4 mb-16 relative">
            <h2 className="text-[10px] text-rose-400 font-black uppercase tracking-[.4em] px-4 w-full">Cartas al Futuro</h2>

            <CapsuleList
                capsules={capsules}
                isLocked={isLocked}
                getTimeRemaining={getTimeRemaining}
                onSelectCapsule={setSelectedCapsule}
            />

            <CapsuleModal
                selectedCapsule={selectedCapsule}
                onClose={() => setSelectedCapsule(null)}
            />
        </div>
    );
};

export default TimeCapsules;
