import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            handleUserSession(session);
        });

        // Listen for changes on auth state (logged in, signed out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            handleUserSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleUserSession = async (session) => {
        if (session?.user) {
            // Whitelist Logic
            const whitelist = import.meta.env.VITE_WHITELIST_EMAILS?.split(',') || [];
            const userEmail = session.user.email;

            // If whitelist is defined and user is not in it, sign out
            if (whitelist.length > 0 && !whitelist.includes(userEmail)) {
                await supabase.auth.signOut();
                alert('Acceso restringido: Este correo no está en la lista de invitados.');
                setUser(null);
            } else {
                setUser(session.user);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    const value = {
        user,
        loading,
        signIn: (email) => supabase.auth.signInWithOtp({ email }),
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
