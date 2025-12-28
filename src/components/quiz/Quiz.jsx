import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Play, ArrowRight, Clock, Trophy, Zap, Target, BarChart2, RotateCcw, CheckCircle, XCircle, Atom, FlaskConical, Dna } from 'lucide-react';
import './Quiz.css';

const questionBank = {
    physics: [
        { q: "Which of the following is a vector quantity?", options: ["Speed", "Work", "Torque", "Energy"], ans: 2, exp: "Torque has both magnitude and direction." },
        { q: "The unit of Planck's constant is:", options: ["Js", "J/s", "Js⁻¹", "J/Hz"], ans: 0, exp: "Planck's constant (h) has dimensions of energy multiplied by time." },
        { q: "If the momentum of a body is increased by 50%, its kinetic energy will increase by:", options: ["50%", "100%", "125%", "150%"], ans: 2, exp: "KE is proportional to p². If p becomes 1.5p, KE becomes 2.25KE, an increase of 125%." },
        { q: "Mirror formula is valid for:", options: ["Plane mirror only", "Convex mirror only", "Concave mirror only", "All spherical mirrors"], ans: 3, exp: "The formula 1/f = 1/v + 1/u applies to all spherical mirrors under paraxial approximation." }
    ],
    chemistry: [
        { q: "The number of electrons in the outermost shell of alkali metals is:", options: ["1", "2", "3", "4"], ans: 0, exp: "Alkali metals belong to Group 1 (IA), having 1 electron in valence shell." },
        { q: "Which has the highest electronegativity?", options: ["Fluorine", "Oxygen", "Chlorine", "Nitrogen"], ans: 0, exp: "Fluorine is the most electronegative element on the Pauling scale." },
        { q: "The shape of methane (CH4) molecule is:", options: ["Linear", "Trigonal Planar", "Tetrahedral", "Octahedral"], ans: 2, exp: "Methane has sp3 hybridization leading to a tetrahedral geometry with 109.5° bond angles." }
    ],
    biology: [
        { q: "The powerhouse of the cell is:", options: ["Nucleus", "Ribosome", "Mitochondria", "Lysosome"], ans: 2, exp: "Mitochondria produce ATP, the energy currency of the cell." },
        { q: "Which blood group is known as the universal donor?", options: ["A", "B", "AB", "O"], ans: 3, exp: "O negative blood lacks A, B, and Rh antigens, so it doesn't trigger immune responses." },
        { q: "DNA replication is:", options: ["Conservative", "Semi-conservative", "Dispersive", "Non-conservative"], ans: 1, exp: "Meselson and Stahl proved DNA replication is semi-conservative." }
    ]
};

const Quiz = () => {
    const { state, updateQuizState, updateUserData } = useAppContext();
    const { quiz } = state;

    // Local UI State
    const [view, setView] = useState('setup'); // setup, active, result
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Analytics State
    const [timer, setTimer] = useState(0);
    const [stats, setStats] = useState({
        correct: 0,
        streak: 0,
        maxStreak: 0,
        timePerQuestion: [], // array of seconds
        totalTime: 0
    });

    const intervalRef = useRef(null);

    // Initial Setup to ensure questions exist if not set
    useEffect(() => {
        return () => stopTimer();
    }, []);

    const startTimer = () => {
        stopTimer();
        setTimer(0);
        intervalRef.current = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    const startQuiz = () => {
        const subject = quiz.subject || 'physics';
        const questions = [...(questionBank[subject] || questionBank.physics)]
            .sort(() => 0.5 - Math.random())
            .slice(0, 5); // Take up to 5 questions

        updateQuizState({
            subject,
            questions,
            active: true,
            currentQuestionIndex: 0,
            score: 0
        });

        setStats({
            correct: 0,
            streak: 0,
            maxStreak: 0,
            timePerQuestion: [],
            totalTime: 0
        });

        setIsAnswered(false);
        setSelectedOption(null);
        setView('active');
        startTimer();
    };

    const handleAnswer = (idx) => {
        if (isAnswered) return;

        stopTimer();
        setIsAnswered(true);
        setSelectedOption(idx);

        const currentQ = quiz.questions[quiz.currentQuestionIndex];
        const isCorrect = idx === currentQ.ans;

        // Update Stats
        const newStreak = isCorrect ? stats.streak + 1 : 0;
        setStats(prev => ({
            ...prev,
            correct: isCorrect ? prev.correct + 1 : prev.correct,
            streak: newStreak,
            maxStreak: Math.max(prev.maxStreak, newStreak),
            timePerQuestion: [...prev.timePerQuestion, timer],
            totalTime: prev.totalTime + timer
        }));

        if (isCorrect) {
            updateQuizState({ score: quiz.score + 1 });
            // Optional: Play sound effect here
        }
    };

    const nextQuestion = () => {
        if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
            updateQuizState({ currentQuestionIndex: quiz.currentQuestionIndex + 1 });
            setIsAnswered(false);
            setSelectedOption(null);
            startTimer();
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const total = quiz.questions.length;
        const percentage = Math.round((stats.correct / total) * 100);

        updateUserData({
            accuracyHistory: [...state.user.accuracyHistory.slice(1), percentage],
            hoursStudied: state.user.hoursStudied + (stats.totalTime / 3600), // Add actual seconds converted to hours
            streak: state.user.streak // logic to update streak could be more complex
        });

        updateQuizState({ active: false });
        setView('result');
    };

    // --- Views ---

    if (view === 'setup') {
        return (
            <div className="view-section active animate-fade-in quiz-wrapper">
                <header>
                    <h1 className="flex-center" style={{ gap: '10px' }}>
                        <Zap size={32} strokeWidth={3} /> Quick Fire Quiz
                    </h1>
                </header>

                <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <h3>Select Your Challenge</h3>
                        <p className="text-muted">Questions adapted from past NEET papers</p>
                    </div>

                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                        {['physics', 'chemistry', 'biology'].map(sub => (
                            <button
                                key={sub}
                                className={quiz.subject === sub ? 'active' : 'secondary'}
                                onClick={() => updateQuizState({ subject: sub })}
                                style={{
                                    borderWidth: quiz.subject === sub ? '4px' : '2px',
                                    transform: quiz.subject === sub ? 'scale(1.05)' : 'none',
                                    flexDirection: 'column',
                                    padding: '1.5rem',
                                    gap: '0.5rem'
                                }}
                            >
                                <div style={{ marginBottom: '0.25rem' }}>
                                    {sub === 'physics' ? <Atom size={28} /> : sub === 'chemistry' ? <FlaskConical size={28} /> : <Dna size={28} />}
                                </div>
                                {sub.charAt(0).toUpperCase() + sub.slice(1)}
                            </button>
                        ))}
                    </div>

                    <button onClick={startQuiz} style={{ fontSize: '1.25rem', padding: '1rem 3rem' }}>
                        Start Quiz <Play size={20} fill="currentColor" />
                    </button>
                </div>
            </div>
        );
    }

    if (view === 'result') {
        const total = quiz.questions.length;
        const accuracy = Math.round((stats.correct / total) * 100);
        const avgTime = Math.round(stats.totalTime / total);

        return (
            <div className="view-section active animate-fade-in quiz-wrapper">
                <div className="card" style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ textAlign: 'center', marginBottom: 'auto' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'fadeIn 0.5s' }}>
                            {accuracy >= 80 ? '🏆' : accuracy >= 50 ? '👏' : '📚'}
                        </div>
                        <h2>Assessment Complete!</h2>
                        <p className="text-muted">Here is how you performed on this set.</p>
                    </div>

                    <div className="results-grid">
                        <div className="stat-card">
                            <Target size={32} />
                            <div className="stat-value">{accuracy}%</div>
                            <div className="stat-label">Accuracy</div>
                        </div>
                        <div className="stat-card">
                            <Clock size={32} />
                            <div className="stat-value">{avgTime}s</div>
                            <div className="stat-label">Avg. Time</div>
                        </div>
                        <div className="stat-card">
                            <Trophy size={32} />
                            <div className="stat-value">{stats.maxStreak}</div>
                            <div className="stat-label">Best Streak</div>
                        </div>
                    </div>

                    <div className="chart-container">
                        {stats.timePerQuestion.map((t, i) => (
                            <div key={i} className="bar-wrapper">
                                <div
                                    className="bar"
                                    style={{
                                        height: `${Math.min((t / 30) * 100, 100)}%`,
                                        backgroundColor: t > 20 ? 'var(--danger)' : t > 10 ? 'var(--warning)' : 'var(--success)'
                                    }}
                                />
                                <span className="bar-label">Q{i + 1}</span>
                            </div>
                        ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: 'auto' }}>
                        Time spent per question (Lower is better)
                    </p>

                    <div style={{ marginTop: '2.5rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="secondary" onClick={() => setView('setup')}>
                            <RotateCcw size={18} /> Menu
                        </button>
                        <button onClick={startQuiz}>
                            Retry Set <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Active View
    const currentQ = quiz.questions[quiz.currentQuestionIndex];
    if (!currentQ) return <div>Loading...</div>;

    const progress = ((quiz.currentQuestionIndex) / quiz.questions.length) * 100;

    return (
        <div className="view-section active animate-fade-in quiz-wrapper">
            <div className="progress-container">
                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="card question-card">
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <span className={`tag tag-${quiz.subject}`}>
                            {quiz.subject.toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                            <Clock size={18} /> {timer}s
                        </div>
                    </div>

                    <h3 className="question-text">
                        <span style={{ color: 'var(--text-muted)', marginRight: '0.5rem' }}>
                            {quiz.currentQuestionIndex + 1}.
                        </span>
                        {currentQ.q}
                    </h3>

                    <div className="options-grid">
                        {currentQ.options.map((opt, idx) => {
                            let className = 'option-card';
                            if (isAnswered) {
                                className += ' disabled';
                                if (idx === currentQ.ans) className += ' correct';
                                else if (idx === selectedOption) className += ' wrong';
                            } else if (idx === selectedOption) {
                                className += ' selected';
                            }

                            return (
                                <div
                                    key={idx}
                                    className={className}
                                    onClick={() => handleAnswer(idx)}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '24px', height: '24px',
                                            border: '2px solid currentColor', borderRadius: '50%',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.8rem'
                                        }}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {opt}
                                    </div>
                                    {isAnswered && idx === currentQ.ans && (
                                        <CheckCircle size={20} className="absolute-icon" style={{ position: 'absolute', right: '1rem' }} />
                                    )}
                                    {isAnswered && idx === selectedOption && idx !== currentQ.ans && (
                                        <XCircle size={20} className="absolute-icon" style={{ position: 'absolute', right: '1rem' }} />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isAnswered && (
                    <div className="explanation-panel">
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                            <Zap size={18} fill="currentColor" /> Explanation
                        </h4>
                        <p>{currentQ.exp}</p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                            <button onClick={nextQuestion}>
                                {quiz.currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'} <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Quiz;
