import React from 'react';

const Playlist = () => {
    // Default playlist ID (User can change this)
    const playlistId = '37i9dQZF1DXcBWIGoYBM5M'; // "Today's Top Hits" placeholder or "Love Songs"

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col pb-20">
            <h1 className="text-3xl font-serif text-slate-800 mb-6 px-2">Nuestra Playlist 🎵</h1>

            <div className="flex-1 glass rounded-3xl overflow-hidden shadow-lg border border-white/50 relative">
                <iframe
                    style={{ borderRadius: '12px' }}
                    src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen=""
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify Playlist"
                ></iframe>
            </div>

            <p className="text-center text-xs text-slate-400 mt-4 italic">
                La banda sonora de nuestra historia.
            </p>
        </div>
    );
};

export default Playlist;
