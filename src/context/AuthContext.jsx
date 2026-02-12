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
        try {
            if (session?.user) {
                const whitelist = import.meta.env.VITE_WHITELIST_EMAILS?.split(',').map(e => e.trim().toLowerCase()) || [];
                const userEmail = session.user.email.toLowerCase();

                if (whitelist.length > 0 && !whitelist.includes(userEmail)) {
                    await supabase.auth.signOut();
                    alert('Acceso restringido: Este correo no está en la lista de invitados.');
                    setUser(null);
                } else {
                    // Use maybeSingle() to avoid errors if the profile doesn't exist yet
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (profileError) console.error("Error fetching profile:", profileError);

                    const finalRole = profile?.role || 'user';
                    console.log("Sistema de Seguridad - Usuario detectado:", session.user.email);
                    console.log("Sistema de Seguridad - Rol asignado:", finalRole);
                    console.log("ID de usuario:", session.user.id);

                    setUser({
                        ...session.user,
                        role: finalRole
                    });
                }
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error("Auth session error:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        signIn: (email) => supabase.auth.signInWithOtp({ email }),
        signInWithPassword: (email, password) => supabase.auth.signInWithPassword({ email, password }),
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
