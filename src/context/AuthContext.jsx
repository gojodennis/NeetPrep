import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const signUp = async (email, password) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        setUser(null);
        setSession(null);
    };

    const loginAsGuest = () => {
        setUser({ id: 'guest_user', email: 'guest@demo.com', user_metadata: { full_name: 'Guest User' } });
        setSession(null);
    };

    return (

        <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut, loginAsGuest }}>
            {loading ? (
                <div className="min-h-screen w-full flex items-center justify-center bg-[#fefae0] text-[#283618]">
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-[#283618] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <div className="font-bold text-lg animate-pulse">Initializing App...</div>
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );

};

export const useAuth = () => useContext(AuthContext);
