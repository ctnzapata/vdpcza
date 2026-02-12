import createGlobe from 'cobe';
import React, { useEffect, useRef } from 'react';

const Globe3D = ({ trips = [] }) => {
    const canvasRef = useRef();

    useEffect(() => {
        let phi = 0;

        // Convert trips to markers
        // Cobe expects markers: { location: [lat, long], size: number }
        const markers = trips
            .filter(t => t.lat && t.lng)
            .map(t => ({ location: [t.lat, t.lng], size: 0.05 }));

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 0,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [1, 1, 1],
            markerColor: [255 / 255, 143 / 255, 163 / 255], // rose-400
            glowColor: [255 / 255, 241 / 255, 242 / 255], // rose-50
            markers: markers,
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.005; // Auto-rotate
            },
        });

        return () => {
            globe.destroy();
        };
    }, [trips]);

    return (
        <div className="w-full aspect-square relative flex items-center justify-center -my-10">
            <canvas
                ref={canvasRef}
                style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: '1' }}
            />
        </div>
    );
};

export default Globe3D;
