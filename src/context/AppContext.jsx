import React, { createContext, useContext, useState, useEffect } from 'react';

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
        generated: false
    }
};

export const AppProvider = ({ children }) => {
    const [state, setState] = useState(() => {
        const saved = localStorage.getItem('neetAppState');
        return saved ? JSON.parse(saved) : initialState;
    });

    useEffect(() => {
        localStorage.setItem('neetAppState', JSON.stringify(state));
    }, [state]);

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

    const setPlanGenerated = (status) => {
        setState(prev => ({
            ...prev,
            plan: { ...prev.plan, generated: status }
        }));
    };

    return (
        <AppContext.Provider value={{ state, updateUserData, updateQuizState, setPlanGenerated }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => useContext(AppContext);
