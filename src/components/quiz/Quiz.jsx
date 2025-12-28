import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Play, ArrowRight } from 'lucide-react';

const questionBank = {
    physics: [
        { q: "Which of the following is a vector quantity?", options: ["Speed", "Work", "Torque", "Energy"], ans: 2, exp: "Torque has both magnitude and direction." },
        { q: "The unit of Planck's constant is:", options: ["Js", "J/s", "Js⁻¹", "J/Hz"], ans: 0, exp: "Planck's constant (h) has dimensions of energy multiplied by time." },
        { q: "If the momentum of a body is increased by 50%, its kinetic energy will increase by:", options: ["50%", "100%", "125%", "150%"], ans: 2, exp: "KE is proportional to p². If p becomes 1.5p, KE becomes 2.25KE, an increase of 125%." },
        { q: "Mirror formula is valid for:", options: ["Plane mirror only", "Convex mirror only", "Concave mirror only", "All spherical mirrors"], ans: 3, exp: "The formula 1/f = 1/v + 1/u applies to all spherical mirrors under paraxial approximation." }
    ],
    chemistry: [
        { q: "The number of electrons in the outermost shell of alkali metals is:", options: ["1", "2", "3", "4"], ans: 0, exp: "Alkali metals belong to Group 1 (IA), having 1 electron in valence shell." },
        { q: "Which has the highest electronegativity?", options: ["Fluorine", "Oxygen", "Chlorine", "Nitrogen"], ans: 0, exp: "Fluorine is the most electronegative element on the Pauling scale." }
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

    // Transient state for UI feedback
    const [selectedOption, setSelectedOption] = useState(null); // index
    const [isAnswered, setIsAnswered] = useState(false);

    const startQuiz = () => {
        const questions = [...questionBank[quiz.subject]].sort(() => 0.5 - Math.random()).slice(0, 3);
        updateQuizState({
            questions,
            active: true,
            currentQuestionIndex: 0,
            score: 0
        });
        setIsAnswered(false);
        setSelectedOption(null);
    };

    const handleAnswer = (idx) => {
        if (isAnswered) return;

        setIsAnswered(true);
        setSelectedOption(idx);

        const currentQ = quiz.questions[quiz.currentQuestionIndex];
        if (idx === currentQ.ans) {
            updateQuizState({ score: quiz.score + 1 });
        }
    };

    const nextQuestion = () => {
        if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
            updateQuizState({ currentQuestionIndex: quiz.currentQuestionIndex + 1 });
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            finishQuiz();
        }
    };

    const finishQuiz = () => {
        const total = quiz.questions.length;
        const finalScore = isAnswered && selectedOption === quiz.questions[quiz.currentQuestionIndex].ans
            ? quiz.score + 1 : quiz.score;
        // Only add if last one wasn't accounted for? 
        // My logic in handleAnswer updates score immediately.
        // So finalScore is just quiz.score.
        // Wait, handleAnswer updates state, but state update might be async if I used setState callback but I used context.

        // Actually, handleAnswer calls updateQuizState.
        // We just need to mark active false.

        const percentage = Math.round((quiz.score / total) * 100);

        updateUserData({
            accuracyHistory: [...state.user.accuracyHistory.slice(1), percentage],
            hoursStudied: state.user.hoursStudied + 0.5,
            streak: state.user.streak // simplify
        });

        updateQuizState({ active: false });

        // We need a local 'finished' state or view to show results, 
        // because active=false puts us back to setup.
        // Let's add a 'showResult' to context or local?
        // Let's settle on: active=false means setup.
        // But we want to show results.
        // I'll add a 'completed' flag to local component state to show result view overlay.
        setLocalView('result');
    };

    const [localView, setLocalView] = useState('setup'); // setup, active, result

    const onStart = () => {
        startQuiz();
        setLocalView('active');
    };

    const onRetry = () => {
        setLocalView('setup');
    };

    // Render helpers
    if (localView === 'setup') {
        return (
            <div className="view-section active animate-fade-in">
                <header>
                    <h1>Adaptive Quiz Engine</h1>
                    <div>
                        <select
                            value={quiz.subject}
                            onChange={(e) => updateQuizState({ subject: e.target.value })}
                        >
                            <option value="physics">Physics</option>
                            <option value="chemistry">Chemistry</option>
                            <option value="biology">Biology</option>
                        </select>
                    </div>
                </header>

                <div className="card quiz-container">
                    <div id="quiz-setup">
                        <h2 style={{ textAlign: 'center' }}>Test Your Knowledge</h2>
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                            AI will generate questions based on NEET past papers and adapt to your difficulty level.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button onClick={onStart}>
                                <Play size={16} /> Start Quiz Session
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (localView === 'result') {
        const total = quiz.questions.length;
        const percentage = Math.round((quiz.score / total) * 100);

        return (
            <div className="view-section active animate-fade-in">
                <header><h1>Quiz Results</h1></header>
                <div className="card quiz-container" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                    <h2>Quiz Completed!</h2>
                    <p style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                        You scored <strong style={{ color: 'var(--primary)' }}>{percentage}%</strong>
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button className="secondary" onClick={onRetry}>Back to Menu</button>
                        <button onClick={() => { startQuiz(); setLocalView('active'); }}>Retry Same Topic</button>
                    </div>
                </div>
            </div>
        );
    }

    // Active View
    const currentQ = quiz.questions[quiz.currentQuestionIndex];
    if (!currentQ) return <div>Loading...</div>;

    return (
        <div className="view-section active animate-fade-in">
            <header><h1>Assessment: {quiz.subject}</h1></header>
            <div className="card quiz-container">
                <div className="question-meta">
                    <span className={`tag tag-${quiz.subject.substring(0, 3)}`}>
                        {quiz.subject.charAt(0).toUpperCase() + quiz.subject.slice(1)}
                    </span>
                    <span>Question {quiz.currentQuestionIndex + 1}/{quiz.questions.length}</span>
                </div>
                <h3 style={{ marginBottom: '1.5rem', lineHeight: 1.6 }}>{currentQ.q}</h3>

                <div id="q-options">
                    {currentQ.options.map((opt, idx) => {
                        let btnClass = 'option-btn';
                        if (isAnswered) {
                            if (idx === currentQ.ans) btnClass += ' correct';
                            else if (idx === selectedOption) btnClass += ' wrong';
                        }

                        return (
                            <div
                                key={idx}
                                className={btnClass}
                                onClick={() => handleAnswer(idx)}
                            >
                                {opt}
                            </div>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="explanation-box" style={{ display: 'block' }}>
                        <strong>Explanation:</strong> {currentQ.exp}
                    </div>
                )}

                {isAnswered && (
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={nextQuestion}>
                            Next Question <ArrowRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                 .option-btn {
                    width: 100%;
                    text-align: left;
                    padding: 1rem;
                    margin-bottom: 0.75rem;
                    background: white;
                    border: 2px solid var(--border);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 1rem;
                }
                .option-btn:hover { border-color: var(--primary); background: #f0f7ff; }
                .option-btn.correct { border-color: var(--success); background: #ecfdf5; color: #065f46; }
                .option-btn.wrong { border-color: var(--danger); background: #fef2f2; color: #991b1b; }

                .explanation-box {
                    margin-top: 1rem;
                    padding: 1rem;
                    background: #eff6ff;
                    border-left: 4px solid var(--primary);
                    border-radius: 4px;
                    animation: fadeIn 0.3s;
                }
             `}</style>
        </div>
    );
};

export default Quiz;
