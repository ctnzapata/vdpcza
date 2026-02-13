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
                    // 1. Try to fetch the profile
                    let { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    // 2. Hardcoded fallback for the owner (You)
                    const isAdminByEmail = session.user.email?.toLowerCase() === 'ctnzapata@gmail.com';

                    // 3. If profile is missing, try to create it automatically
                    if (!profile && !profileError) {
                        const { data: newProfile } = await supabase
                            .from('profiles')
                            .insert([
                                {
                                    id: session.user.id,
                                    email: session.user.email,
                                    role: isAdminByEmail ? 'admin' : 'user'
                                }
                            ])
                            .select()
                            .maybeSingle();
                        profile = newProfile;
                    }

                    const finalRole = isAdminByEmail ? 'admin' : (profile?.role || 'user');

                    console.log("Sistema de Seguridad - Usuario:", session.user.email);
                    console.log("Sistema de Seguridad - Rol:", finalRole);

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
