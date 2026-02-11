import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import AuthGuard from './components/AuthGuard';
import Hero from './components/Hero';
import TravelGrid from './components/TravelGrid';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdminOpen, setIsAdminOpen] = useState(false);

    useEffect(() => {
        // Check for existing auth cookie
        const authCookie = Cookies.get('sorpresa_auth');
        if (authCookie === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSuccess = () => {
        Cookies.set('sorpresa_auth', 'true', { expires: 365 }); // Expire in 1 year
        setIsAuthenticated(true);
    };

    if (!isAuthenticated) {
        return <AuthGuard onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-rose-50 text-slate-700 overflow-x-hidden">
            <Hero />

            <main className="container mx-auto px-4 py-12 relative z-10">
                <h2 className="text-4xl md:text-5xl font-script text-rose-400 text-center mb-12 drop-shadow-sm">
                    Nuestra Historia de Viajes
                </h2>
                <TravelGrid />
            </main>

            <Footer onAdminUnlock={() => setIsAdminOpen(prev => !prev)} />

            {isAdminOpen && <AdminPanel onClose={() => setIsAdminOpen(false)} />}
        </div>
    );
}

export default App;
