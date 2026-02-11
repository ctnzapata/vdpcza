import React, { useState } from 'react';
import { Heart, Settings } from 'lucide-react';

const Footer = ({ onAdminUnlock }) => {
    const [tapCount, setTapCount] = useState(0);

    const handleHeartClick = () => {
        const newCount = tapCount + 1;
        setTapCount(newCount);

        if (newCount === 3) {
            onAdminUnlock();
            setTapCount(0);
        }

        // Reset after 1 second if not completed
        setTimeout(() => {
            setTapCount(0);
        }, 1000);
    };

    return (
        <footer className="mt-20 pb-8 text-center text-rose-300">
            <div className="flex items-center justify-center gap-2 mb-2">
                <span>Hecho con mucho</span>
                <Heart
                    className="w-4 h-4 text-rose-400 fill-rose-400 cursor-pointer hover:scale-125 transition-transform"
                    onClick={handleHeartClick}
                />
                <span>para Vale</span>
            </div>
            <p className="text-xs opacity-50">&copy; {new Date().getFullYear()} Sorpresa</p>
        </footer>
    );
};

export default Footer;
