import React from 'react';
import { motion } from 'framer-motion';
import { Music, Play, ExternalLink, Headphones } from 'lucide-react';

const Playlist = () => {
    const playlistId = 'PLsCOf8twTcNrQ4ZHeSS6i-PhgiCIR9eg2';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';

    return (
        <div className="space-y-8 pb-32">
            <header className="px-1 text-center py-4">
                <div className="inline-block glass p-5 rounded-full border-indigo-500/30 mb-6 bg-indigo-500/10 relative">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0 border-2 border-dashed border-indigo-500/20 rounded-full"
                    />
                    <Music className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-4xl font-serif text-white">Nuestra Música</h1>
                <p className="text-[9px] text-indigo-400 font-bold uppercase tracking-[.4em] mt-2">La banda sonora de nosotros</p>
            </header>

            <motion.section
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 sm:p-6 border-white/10 shadow-[0_32px_128px_rgba(0,0,0,0.6)] relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl -z-10" />

                <div className="relative aspect-video rounded-[24px] overflow-hidden bg-slate-900 border border-white/5 shadow-inner">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&origin=${origin}&hl=es&modestbranding=1`}
                        title="Nuestra Playlist"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="opacity-90 contrast-[1.1]"
                    />
                </div>

                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between p-4 glass bg-white/5 rounded-2xl border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                                <Headphones size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-serif text-white">vdpcza Session</p>
                                <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">YouTube Music</p>
                            </div>
                        </div>
                        <motion.a
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            href={`https://music.youtube.com/playlist?list=${playlistId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 glass bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all border-white/10"
                        >
                            <ExternalLink size={18} />
                        </motion.a>
                    </div>

                    <div className="p-6 text-center glass bg-indigo-500/5 rounded-[24px] border-indigo-500/10">
                        <p className="text-xs text-indigo-300 font-serif italic opacity-80 leading-relaxed px-4">
                            "Cada canción cuenta un capítulo de nuestra historia. Dale al play y deja que la nostalgia haga el resto."
                        </p>
                    </div>
                </div>
            </motion.section>
        </div>
    );
};

export default Playlist;
