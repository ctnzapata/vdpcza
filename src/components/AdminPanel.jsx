import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Unlock, Lock } from 'lucide-react';
import { supabase } from '../supabaseClient';

const AdminPanel = ({ onClose }) => {
    const [travels, setTravels] = useState([]);
    const [newTravel, setNewTravel] = useState({
        title: '',
        destination: '',
        date: '',
        image_url: '',
        unlocked: false
    });

    useEffect(() => {
        fetchTravels();
    }, []);

    const fetchTravels = async () => {
        const { data } = await supabase.from('travels').select('*').order('sort_order', { ascending: true });
        setTravels(data || []);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('travels').insert([{
            ...newTravel,
            sort_order: travels.length
        }]);

        if (!error) {
            setNewTravel({ title: '', destination: '', date: '', image_url: '', unlocked: false });
            fetchTravels();
        } else {
            alert('Error creating travel: ' + error.message);
        }
    };

    const toggleLock = async (id, currentStatus) => {
        const { error } = await supabase.from('travels').update({ unlocked: !currentStatus }).eq('id', id);
        if (!error) fetchTravels();
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.1)] rounded-t-3xl z-40 max-h-[80vh] overflow-y-auto p-6 border-t border-rose-100"
        >
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-script text-rose-500">Panel de Control</h2>
                <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full">
                    <X className="w-6 h-6 text-slate-400" />
                </button>
            </div>

            {/* Add New Form */}
            <form onSubmit={handleCreate} className="bg-rose-50/50 p-4 rounded-xl mb-8 space-y-3">
                <h3 className="font-bold text-sm text-slate-600 uppercase tracking-wide mb-2">Nuevo Viaje</h3>
                <div className="grid grid-cols-2 gap-3">
                    <input
                        placeholder="Título"
                        className="p-2 rounded border border-rose-200"
                        value={newTravel.title}
                        onChange={e => setNewTravel({ ...newTravel, title: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Destino"
                        className="p-2 rounded border border-rose-200"
                        value={newTravel.destination}
                        onChange={e => setNewTravel({ ...newTravel, destination: e.target.value })}
                        required
                    />
                    <input
                        placeholder="Fecha"
                        className="p-2 rounded border border-rose-200"
                        value={newTravel.date}
                        onChange={e => setNewTravel({ ...newTravel, date: e.target.value })}
                    />
                    <input
                        placeholder="URL Imagen"
                        className="p-2 rounded border border-rose-200"
                        value={newTravel.image_url}
                        onChange={e => setNewTravel({ ...newTravel, image_url: e.target.value })}
                    />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="bg-rose-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-500">
                        <Plus className="w-4 h-4" /> Agregar
                    </button>
                </div>
            </form>

            {/* List */}
            <div className="space-y-2">
                {travels.map(travel => (
                    <div key={travel.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg">
                        <div>
                            <p className="font-bold text-slate-700">{travel.title}</p>
                            <p className="text-xs text-slate-500">{travel.destination}</p>
                        </div>
                        <button
                            onClick={() => toggleLock(travel.id, travel.unlocked)}
                            className={`p-2 rounded-full ${travel.unlocked ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}
                        >
                            {travel.unlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                        </button>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};

export default AdminPanel;
