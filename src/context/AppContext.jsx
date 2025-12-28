import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const initialState = {
    user: {
        name: "Aspirant",
        streak: 3,
        hoursStudied: 12,
        accuracyHistory: [65, 70, 68, 75, 72, 80, 85]
    },
    quiz: {
        active: false,
        currentQuestionIndex: 0,
        score: 0,
        questions: [],
        subject: 'physics'
    },
    plan: {
        generated: false,
        data: null
    },
    config: {
        apiKey: ''
    }
};

export const AppProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('neetAppState');
        const parsed = saved ? JSON.parse(saved) : initialState;
        // Ensure config exists if loading from old state
        if (!parsed.config) parsed.config = { apiKey: '' };
        // Ensure plan exists if loading from old state
        if (!parsed.plan) parsed.plan = { generated: false, data: null };
        return parsed;
    });

    const { user } = useAuth();

    // Load initial state
    useEffect(() => {
        if (!user) return;

        if (user.id === 'guest_user') {
            // Force reset to demo state
            setState({
                ...initialState,
                user: { ...initialState.user, name: "Guest User" }
            });
            return;
        }

        const loadData = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_data')
                    .select('content')
                    .eq('user_id', user.id)
                    .single();

                if (data?.content) {
                    setState(data.content);
                }
            } catch (error) {
                console.error("Error loading user data:", error);
            }
        };
        loadData();
    }, [user]);

    // Save state changes
    useEffect(() => {
        localStorage.setItem('neetAppState', JSON.stringify(state));

        if (!user || user.id === 'guest_user') return;

        const syncToSupabase = async () => {
            try {
                await supabase
                    .from('user_data')
                    .upsert({
                        user_id: user.id,
                        content: state,
                        updated_at: new Date().toISOString()
                    });
            } catch (error) {
                console.error("Error syncing data:", error);
            }
        };

        const timeoutId = setTimeout(syncToSupabase, 2000);
        return () => clearTimeout(timeoutId);
    }, [state, user]);

    const updateUserData = (updates) => {
        setState(prev => ({
            ...prev,
            user: { ...prev.user, ...updates }
        }));
    };

    const updateQuizState = (updates) => {
        setState(prev => ({
            ...prev,
            quiz: { ...prev.quiz, ...updates }
        }));
    };

    const updatePlan = (updates) => {
        setState(prev => ({
            ...prev,
            plan: { ...prev.plan, ...updates }
        }));
    };

    const setApiKey = (key) => {
        setState(prev => ({
            ...prev,
            config: { ...prev.config, apiKey: key }
        }));
    };

    return (
        <AppContext.Provider value={{ state, updateUserData, updateQuizState, updatePlan, setApiKey }}>
            {children}
        </AppContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext);
