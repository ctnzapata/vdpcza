import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
    return (
        <div className="min-h-screen pb-24 relative overflow-hidden bg-slate-950">
            {/* Animated Aurora Background */}
            <div className="aurora-container">
                <div className="aurora-blob aurora-1" />
                <div className="aurora-blob aurora-2" />
                <div className="aurora-blob aurora-3" />
            </div>

            {/* Subtle Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-[1]" />

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 relative z-10 max-w-lg">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
};

export default Layout;
