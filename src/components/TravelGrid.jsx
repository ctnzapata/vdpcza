import React, { useEffect, useState } from 'react';
import { TravelRepository } from '../repositories/TravelRepository';
import TravelCard from './TravelCard';
import { Loader } from 'lucide-react';

const TravelGrid = () => {
    const [travels, setTravels] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTravels = async () => {
        try {
            const data = await TravelRepository.getTravels();
            setTravels(data);
        } catch (error) {
            console.error('Error fetching travels:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravels();

        // Subscribe to changes for real-time updates (optional but nice)
        const subscription = TravelRepository.subscribeToTravels(fetchTravels);

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader className="w-8 h-8 text-rose-400 animate-spin" />
            </div>
        );
    }

    if (travels.length === 0) {
        return (
            <div className="text-center py-12 bg-white/50 backdrop-blur-sm rounded-xl">
                <p className="text-slate-500 font-light">Aún no hay viajes... ¡pero pronto vendrán muchos!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {travels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
            ))}
        </div>
    );
};

export default TravelGrid;
