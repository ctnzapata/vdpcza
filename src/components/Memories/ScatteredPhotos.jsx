import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const ScatteredPhotos = ({ memories, onPhotoClick }) => {

    // Generar rotaciones estáticas basadas en el ID para que no parpadeen cada render
    const photoStyles = useMemo(() => {
        return memories.map((memory, index) => {
            // Un seudo-random basado en el string id
            const seed = String(memory.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

            // Rotación entre -15 y 15 grados
            const rotation = (seed % 30) - 15;

            // Un pequeño offset X e Y para esparcirlas un poco
            const offsetX = (seed % 40) - 20;
            const offsetY = ((seed * 2) % 40) - 20;

            // Z-index para que se sobrepongan bonito
            const zIndex = seed % 50;

            return { rotation, offsetX, offsetY, zIndex };
        });
    }, [memories]);

    return (
        <div className="relative w-full min-h-[70vh] flex flex-wrap justify-center items-center gap-8 sm:gap-16 p-8 pb-40">
            {memories.map((memory, i) => {
                const style = photoStyles[i];

                return (
                    <motion.div
                        key={memory.id}
                        initial={{ opacity: 0, y: -100, rotate: 0 }}
                        animate={{
                            opacity: 1,
                            y: style.offsetY,
                            x: style.offsetX,
                            rotate: style.rotation
                        }}
                        transition={{
                            type: 'spring',
                            damping: 12,
                            stiffness: 100,
                            delay: i * 0.1
                        }}
                        whileHover={{
                            scale: 1.1,
                            rotate: 0,
                            zIndex: 100,
                            boxShadow: "0 40px 60px -15px rgba(0,0,0,0.7)"
                        }}
                        onClick={() => onPhotoClick(memory)}
                        className="relative group cursor-zoom-in rounded-sm bg-white p-3 sm:p-4 pb-12 sm:pb-16 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] border border-slate-200"
                        style={{ zIndex: style.zIndex, maxWidth: '280px', width: '100%' }}
                    >
                        <div className="w-full aspect-[4/5] bg-slate-100 overflow-hidden relative border border-slate-200">
                            <img
                                src={memory.image_url}
                                alt={memory.description || "Recuerdo"}
                                className="w-full h-full object-cover filter saturate-[0.8] contrast-[1.1] group-hover:saturate-100 transition-all duration-500"
                                loading="lazy"
                            />
                        </div>

                        {/* Handwriting date placeholder */}
                        <div className="absolute bottom-4 left-0 w-full text-center">
                            <span className="font-serif italic text-slate-800 text-sm opacity-60">
                                {new Date(memory.date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric', day: '2-digit' })}
                            </span>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
};

export default ScatteredPhotos;
