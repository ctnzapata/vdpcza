import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import TopBar from './TopBar';

const Layout = () => {
    return (
        <div className="min-h-screen pb-24 relative overflow-hidden bg-slate-950">
            <TopBar />
            {/* Animated Aurora Background */}
            <div className="aurora-container">
                <div className="aurora-blob aurora-1" />
                <div className="aurora-blob aurora-2" />
                <div className="aurora-blob aurora-3" />
                <div className="aurora-blob aurora-4" /> {/* Deep space accent */}
            </div>

            {/* Subtle Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('/noise.svg')] z-[1]" />

            {/* Main Content Area */}
            <main className="container mx-auto px-4 py-8 relative max-w-lg md:max-w-5xl md:pb-8 transition-all duration-500">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
};

export default Layout;
