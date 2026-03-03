import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Pencil, Trash2, CheckCircle2 } from 'lucide-react';
import { TriviaRepository } from '../repositories/TriviaRepository';

const AdminTriviaManager = ({ onClose }) => {
    const [questions, setQuestions] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form state
    const [formData, setFormData] = useState({
        question: '',
        q: '',
        options: ['', '', '', ''],
        correct_answer: ''
    });

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        setLoading(true);
        try {
            const data = await TriviaRepository.getAllQuestions();
            setQuestions(data);
        } catch (error) {
            alert('Error loading trivia: ' + error.message);
        }
        setLoading(false);
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const handleEdit = (question) => {
        setEditingId(question.id);
        const qText = question.question || question.q || '';
        const opts = question.options || ['', '', '', ''];
        setFormData({
            question: qText,
            q: qText,
            options: opts,
            correct_answer: question.correct_answer || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            question: '',
            q: '',
            options: ['', '', '', ''],
            correct_answer: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation ensuring correct answer matches exactly one option
        if (!formData.options.includes(formData.correct_answer)) {
            alert("La respuesta correcta debe ser exactamente igual a una de las opciones.");
            return;
        }

        const dataToSave = {
            question: formData.question,
            options: formData.options,
            correct_answer: formData.correct_answer
        };

        try {
            if (editingId) {
                await TriviaRepository.updateQuestion(editingId, dataToSave);
            } else {
                await TriviaRepository.createQuestion(dataToSave);
            }
            handleCancelEdit();
            fetchQuestions();
        } catch (error) {
            alert('Error saving question: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta pregunta?")) return;
        try {
            await TriviaRepository.deleteQuestion(id);
            fetchQuestions();
        } catch (error) {
            alert('Error deleting question: ' + error.message);
        }
    };

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 bg-[#0a0508] text-rose-100 shadow-[0_-10px_40px_rgba(244,63,94,0.15)] rounded-t-[3rem] z-50 h-[85vh] flex flex-col border-t border-rose-500/20"
        >
            <div className="flex-none p-6 pb-2 flex justify-between items-center border-b border-rose-500/10 mb-4 relative overflow-hidden rounded-t-[3rem]">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent pointer-events-none" />
                <h2 className="text-2xl font-serif font-bold text-rose-50 relative z-10">Preguntas de Trivia</h2>
                <button onClick={onClose} className="p-2 hover:bg-rose-500/20 rounded-full transition-colors relative z-10 glass">
                    <X className="w-5 h-5 text-rose-300" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-6">

                {/* Form Section */}
                <form onSubmit={handleSubmit} className="glass p-6 rounded-3xl space-y-4 border border-rose-500/10">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-rose-300/70">
                        {editingId ? 'Editar Pregunta' : 'Nueva Pregunta'}
                    </h3>

                    <div>
                        <label className="text-xs text-rose-200/50 mb-1 block uppercase tracking-wider">Pregunta</label>
                        <input
                            placeholder="Ej. ¿Cuál es mi color favorito?"
                            className="w-full p-3 rounded-2xl bg-white/5 border border-rose-500/20 text-white placeholder-white/20 focus:outline-none focus:border-rose-400 focus:bg-white/10 transition-colors"
                            value={formData.question}
                            onChange={e => setFormData({ ...formData, question: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-xs text-rose-200/50 mb-2 block uppercase tracking-wider">Opciones</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {formData.options.map((opt, i) => (
                                <div key={i} className="flex flex-col relative">
                                    <input
                                        placeholder={`Opción ${i + 1}`}
                                        className="w-full p-3 rounded-2xl bg-white/5 border border-rose-500/20 text-white placeholder-white/20 focus:outline-none focus:border-rose-400"
                                        value={opt}
                                        onChange={e => handleOptionChange(i, e.target.value)}
                                        required
                                    />
                                    {/* Quick set as correct answer button */}
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, correct_answer: opt })}
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${formData.correct_answer === opt && opt !== '' ? 'text-green-400 bg-green-500/10' : 'text-white/20 hover:text-rose-300'}`}
                                        title="Marcar como correcta"
                                    >
                                        <CheckCircle2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-rose-200/50 mb-1 block uppercase tracking-wider">Respuesta Correcta Exacta</label>
                        <input
                            placeholder="Debe ser idéntica a una opción"
                            className="w-full p-3 rounded-2xl bg-white/5 border border-rose-500/20 text-green-300 font-bold focus:outline-none focus:border-green-400"
                            value={formData.correct_answer}
                            onChange={e => setFormData({ ...formData, correct_answer: e.target.value })}
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-6 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest text-rose-300 hover:bg-rose-500/10 border border-transparent transition-colors"
                            >
                                Cancelar
                            </button>
                        )}
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-rose-500 to-rose-400 text-white px-6 py-3 rounded-full text-[10px] uppercase font-bold tracking-widest flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-shadow"
                        >
                            {editingId ? <Pencil size={14} /> : <Plus size={14} />}
                            {editingId ? 'Guardar Cambios' : 'Agregar Pregunta'}
                        </button>
                    </div>
                </form>

                {/* List Section */}
                <div className="space-y-3">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-rose-300/70 pl-2">Banco de Preguntas ({questions.length})</h3>

                    {loading ? (
                        <div className="text-center text-rose-200/50 text-sm py-10 animate-pulse">Cargando trivia...</div>
                    ) : questions.length === 0 ? (
                        <div className="text-center text-rose-200/50 text-sm py-10 glass rounded-3xl">No hay preguntas registradas.</div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {questions.map(q => (
                                <div key={q.id} className="glass p-5 rounded-3xl border border-rose-500/5 flex flex-col gap-3 group">
                                    <div className="flex justify-between items-start gap-4">
                                        <p className="font-serif text-rose-50 text-lg leading-tight">"{q.question || q.q}"</p>
                                        <div className="flex items-center gap-2 shrink-0 opacity-50 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(q)}
                                                className="p-2 rounded-full glass hover:bg-rose-500/20 text-amber-300 transition-colors"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q.id)}
                                                className="p-2 rounded-full glass hover:bg-rose-500/20 text-rose-400 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 text-[10px] font-bold tracking-wider">
                                        {q.options?.map((opt, i) => (
                                            <span
                                                key={i}
                                                className={`px-3 py-1 rounded-full border ${opt === q.correct_answer ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-white/5 border-white/5 text-rose-200/50'}`}
                                            >
                                                {opt}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default AdminTriviaManager;
