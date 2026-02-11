import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = () => {
    return (
        <div className="min-h-screen pb-24 relative overflow-hidden bg-rose-50">
            {/* Background Decorations */}
            <div className="fixed top-0 left-0 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-80 h-80 bg-rose-300/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Main Content Area with Routing */}
            <main className="container mx-auto px-4 py-6 relative z-10 max-w-lg">
                <Outlet />
            </main>

            <BottomNav />
        </div>
    );
};

export default Layout;
