// ... existing code ...
import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Bot, Calendar, Clock, Target, BookOpen, Sparkles, ChevronRight, Terminal } from 'lucide-react';
import { generateStudyPlan } from '../../services/aiService';

const StudyPlan = () => {
    const { state, updatePlan } = useAppContext();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');

    const planData = state.plan?.data;

    const [inputs, setInputs] = useState({
        targetDate: '',
        dailyHours: 6,
        focusArea: 'balanced'
    });

    const handleGenerate = async (e) => {
        e.preventDefault();

        // [DEMO MODE DATA CHECK]
        if (user?.id === 'guest_user') {
            setLoading(true);
            setStatusText("SIMULATING AI GENERATION...");

            // Fake delay for realism
            setTimeout(() => {
                updatePlan({
                    generated: true,
                    data: {
                        hours: inputs.dailyHours,
                        focus: inputs.focusArea,
                        schedule: [
                            {
                                day: 'Day 1: Foundations',
                                sessions: [
                                    { subject: { name: 'Physics' }, chapter: 'Rotational Motion', duration: 2 },
                                    { subject: { name: 'Biology' }, chapter: 'Cell Cycle', duration: 2 },
                                    { subject: { name: 'Chemistry' }, chapter: 'Thermodynamics', duration: 2 }
                                ]
                            },
                            {
                                day: 'Day 2: Application',
                                sessions: [
                                    { subject: { name: 'Physics' }, chapter: 'Gravitation', duration: 2 },
                                    { subject: { name: 'Biology' }, chapter: 'Genetics II', duration: 2 },
                                    { subject: { name: 'Chemistry' }, chapter: 'Equilibrium', duration: 2 }
                                ]
                            },
                            {
                                day: 'Day 3: Review & Quiz',
                                sessions: [
                                    { subject: { name: 'Physics' }, chapter: 'Fluid Mechanics', duration: 2 },
                                    { subject: { name: 'Biology' }, chapter: 'Biotech', duration: 2 },
                                    { subject: { name: 'Chemistry' }, chapter: 'Redox Reactions', duration: 2 }
                                ]
                            }
                        ]
                    }
                });
                setStatusText("");
                setLoading(false);
                addToast("[DEMO] PLAN GENERATED");
            }, 1500);
            return;
        }

        if (!state.config?.apiKey) {
            addToast("Please configure your Gemini API Key in Settings first", "error");
            return;
        }

        setLoading(true);
        setStatusText("INITIALIZING SYLLABUS SCAN...");

        try {
            const data = await generateStudyPlan(state.config.apiKey, inputs);
            updatePlan({ generated: true, data });
            setStatusText("");
            addToast("PLAN_GENERATED_SUCCESSFULLY");
        } catch (error) {
            console.error(error);
            setStatusText("ERROR_GENERATING_PLAN");
            addToast(error.message || "FAILED_TO_GENERATE", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="view-section active animate-fade-in premium-layout">
            <style>{`
                .premium-layout {
                    --bg-dark: #0a0a0a;
                    --bg-card: #ffffff;
                    --accent-black: #000000;
                    --text-primary: #0a0a0a;
                    --text-secondary: #525252;
                    --border-color: #000000;
                    
                    /* Fluid scaling base: using container query unit */
                    container-type: inline-size;
                    /* Reduced scale slightly to ensure very large screens don't look clumsy */
                    font-size: 1cqi; 

                    background: #f5f5f5; 
                    min-height: 100%;
                    color: var(--text-primary);
                    padding: 2em;
                    border: 0.15em solid #000;
                    position: relative;
                    overflow: auto;
                    font-family: 'JetBrains Mono', monospace;
                }
                
                .header-section {
                    position: relative;
                    z-index: 1;
                    margin-bottom: 2em;
                    display: flex;
                    align-items: center;
                    gap: 1em;
                }

                .header-section h1 {
                    font-size: 1.8em;
                    font-weight: 700;
                    color: #000;
                    text-transform: uppercase;
                    margin: 0;
                    letter-spacing: -0.05em;
                }

                .header-icon-box {
                    background: #000;
                    padding: 0.8em;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .glass-card {
                    background: #ffffff;
                    border: 0.15em solid #000000;
                    padding: 2em;
                    box-shadow: 0.3em 0.3em 0px 0px #000000;
                    position: relative;
                    z-index: 1;
                    /* Important: Standard Flex Col */
                    display: flex;
                    flex-direction: column;
                }

                .premium-grid {
                    display: grid;
                    /* Ratios: ~35% config, ~60% results, rest gap */
                    grid-template-columns: 35fr 60fr; 
                    gap: 3em; 
                    position: relative;
                    z-index: 1;
                }

                .config-panel {
                    width: 100%;
                }

                .results-panel {
                    width: 100%;
                    /* Important: Standard flex col for mobile fallback */
                    display: flex;
                    flex-direction: column;
                }

                /* Desktop-specific layout for height matching */
                @media (min-width: 769px) and (aspect-ratio >= 1/1) {
                    .results-panel {
                        /* Remove padding so absolute child can control it */
                        padding: 0 !important;
                    }
                    
                    .scroll-layout {
                        position: absolute;
                        top: 0; left: 0; right: 0; bottom: 0;
                        padding: 2em;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden; /* Prevent spill */
                    }
                }

                @media (max-width: 768px) or (aspect-ratio < 1/1) {
                    .scroll-layout {
                        display: flex;
                        flex-direction: column;
                        width: 100%;
                        flex: 1;
                    }
                    
                    /* Restore standard behavior for mobile */
                    .premium-grid {
                        grid-template-columns: 1fr;
                        gap: 2em;
                    }
                     
                    .premium-layout {
                        /* Boost font size slightly on mobile for legibility */
                        font-size: 2.5cqi; 
                        padding: 1.5em;
                    }

                    .glass-card {
                        height: auto;
                    }
                     
                    .timeline-container {
                        max-height: 50vh;
                    }
                }

                .form-label {
                    display: block;
                    font-size: 0.9em;
                    font-weight: 600;
                    color: #000;
                    margin-bottom: 0.6em;
                    text-transform: uppercase;
                }

                .premium-input {
                    width: 100%;
                    background: #fff;
                    border: 0.15em solid #000;
                    color: #000;
                    padding: 0.8em 1.2em;
                    font-size: 1em;
                    font-family: 'JetBrains Mono', monospace;
                    outline: none;
                    height: 3.5em;
                }

                .premium-input:focus {
                    background: #000;
                    color: #fff;
                }

                .generate-btn {
                    width: 100%;
                    background: #000;
                    color: #fff;
                    border: 0.15em solid #000;
                    padding: 1.2em;
                    font-weight: 700;
                    font-size: 1em;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.6em;
                    text-transform: uppercase;
                    transition: all 0.1s;
                    box-shadow: 0.2em 0.2em 0px 0px #555;
                }

                .generate-btn:hover {
                    box-shadow: 0.4em 0.4em 0px 0px #555;
                    transform: translate(-0.1em, -0.1em);
                }
                
                .generate-btn:active {
                    box-shadow: 0px 0px 0px 0px #555;
                    transform: translate(0.1em, 0.1em);
                }

                .generate-btn:disabled {
                    background: #555;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    flex: 1; 
                    min-height: 20em;
                    color: #000;
                    text-align: center;
                }

                .empty-icon-circle {
                    width: 6em;
                    height: 6em;
                    background: #f5f5f5;
                    border: 0.15em solid #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2em;
                    border-radius: 50%;
                }

                .results-content {
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    min-height: 0;
                }

                .timeline-container {
                    padding-left: 1.5em;
                    border-left: 0.15em solid #000;
                    margin-top: 2em;
                    flex: 1;
                    min-height: 0; 
                    overflow-y: auto;
                    padding-right: 0.8em;
                }

                .timeline-container::-webkit-scrollbar {
                    width: 0.6em;
                }

                .timeline-container::-webkit-scrollbar-track {
                    background: #fff;
                    border-left: 0.15em solid #000;
                }

                .timeline-container::-webkit-scrollbar-thumb {
                    background: #000;
                }

                .timeline-container::-webkit-scrollbar-thumb:hover {
                    background: #333;
                }

                .day-group {
                    margin-bottom: 2.5em;
                    position: relative;
                }

                .day-group::before {
                    content: '';
                    position: absolute;
                    left: -2.12em;
                    top: 0;
                    width: 1em;
                    height: 1em;
                    background: #000;
                    border: 0.15em solid #000;
                }

                .day-header {
                    font-size: 1.1em;
                    font-weight: 700;
                    color: #000;
                    margin-bottom: 1.2em;
                    display: flex;
                    align-items: center;
                    text-transform: uppercase;
                }

                .session-card {
                    background: #fff;
                    border: 0.15em solid #000;
                    padding: 1.2em;
                    margin-bottom: 1em;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: transform 0.1s;
                    box-shadow: 0.2em 0.2em 0px 0px #ccc;
                }

                .session-card:hover {
                    box-shadow: 0.3em 0.3em 0px 0px #aaa;
                    transform: translate(-0.05em, -0.05em);
                }

                .tag-modern {
                    padding: 0.3em 0.6em;
                    font-size: 0.75em;
                    font-weight: 700;
                    text-transform: uppercase;
                    border: 0.1em solid #000;
                    background: #fff;
                    color: #000;
                }

                .hour-circle {
                    width: 4em;
                    height: 4em;
                    border: 0.15em solid #000;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    font-size: 1em;
                    cursor: pointer;
                    background: #fff;
                    color: #000;
                    transition: all 0.2s;
                }
                
                .hour-circle:hover {
                    background: #000;
                    color: #fff;
                }
                
                .hour-circle.active {
                    background: #000;
                    color: #fff;
                    box-shadow: 0 0 0 0.15em #fff, 0 0 0 0.3em #000;
                }

                .focus-btn {
                    background: #fff;
                    border: 0.15em solid #000;
                    color: #000;
                    padding: 0.8em;
                    font-family: inherit;
                    text-transform: uppercase;
                    font-size: 0.85em;
                    cursor: pointer;
                    font-weight: 600;
                }
                .focus-btn.active {
                    background: #000;
                    color: #fff;
                }

                .flex-center { display: flex; align-items: center; gap: 0.5em; }
            `}</style>
// ... existing code ...
            <div className="premium-grid">
                <div className="glass-card config-panel">
                    <h2 style={{ fontSize: '1.2em', marginBottom: '1.5em', display: 'flex', alignItems: 'center', gap: '0.5em', textTransform: 'uppercase', borderBottom: '0.15em solid #000', paddingBottom: '0.5em' }}>
                        <Target size="1.2em" /> &gt; Configuration
                    </h2>

                    <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                        <div style={{ marginBottom: '1.5em' }}>
                            <label className="form-label">TARGET_DATE</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type="date"
                                    required
                                    className="premium-input"
                                    value={inputs.targetDate}
                                    style={{ colorScheme: 'light' }}
                                    onChange={e => setInputs({ ...inputs, targetDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.5em' }}>
                            <label className="form-label" style={{ textAlign: 'center', marginBottom: '0.8em' }}>
                                INTENSITY_LEVEL
                            </label>

                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2em' }}>
                                {[6, 8, 10].map(hours => (
                                    <button
                                        key={hours}
                                        type="button"
                                        onClick={() => setInputs({ ...inputs, dailyHours: hours })}
                                        className={`hour-circle ${inputs.dailyHours === hours ? 'active' : 'inactive'}`}
                                    >
                                        {hours}h
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ marginBottom: '2em' }}>
                            <label className="form-label">FOCUS_AREA</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5em' }}>
                                {['balanced', 'physics', 'chemistry', 'biology'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`focus-btn ${inputs.focusArea === type ? 'active' : ''}`}
                                        onClick={() => setInputs({ ...inputs, focusArea: type })}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" className="generate-btn" disabled={loading} style={{ marginTop: 'auto' }}>
                            {loading ? <span>PROCESSING...</span> : (
                                <>
                                    <Terminal size="1em" /> EXECUTE_PLAN
                                </>
                            )}
                        </button>
                    </form>

                    {statusText && (
                        <div style={{ marginTop: '1.2em', fontSize: '0.9em', color: '#000', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5em', fontFamily: 'monospace' }}>
                            {loading && <span>[LOADING]</span>}
                            {statusText}
                        </div>
                    )}
                </div>

                <div className="glass-card results-panel">
                    <div className="scroll-layout">
                        {!planData ? (
                            <div className="empty-state">
                                <div className="empty-icon-circle">
                                    <Bot size="2.5em" color="#000" />
                                </div>
                                <h3 style={{ fontSize: '1.2em', color: '#000', marginBottom: '0.5em', textTransform: 'uppercase' }}>No Data Found</h3>
                                <p style={{ maxWidth: '20em', lineHeight: 1.6, fontSize: '0.9em' }}>
                                    // INPUT PARAMETERS REQUIRED
                                // INITIATE SYSTEM
                                </p>
                            </div>
                        ) : (
                            <div className="results-content animate-fade-in">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '2em', borderBottom: '0.15em solid #000', paddingBottom: '1.5em' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.4em', marginBottom: '0.5em', textTransform: 'uppercase' }}>Mission Roadmap</h2>
                                        <div style={{ display: 'flex', gap: '1em', fontSize: '0.9em', color: '#525252' }}>
                                            <span className="flex-center"><Clock size="1em" /> HOURS: {planData.hours}/DAY</span>
                                            <span className="flex-center"><Target size="1em" /> FOCUS: {planData.focus.toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <button className="secondary"
                                        onClick={() => addToast("Calendar Synced")}
                                        style={{
                                            background: '#fff',
                                            color: '#000',
                                            border: '0.15em solid #000',
                                            padding: '0.6em 1.2em',
                                            fontSize: '0.9em',
                                            cursor: 'pointer',
                                            fontWeight: 700,
                                            textTransform: 'uppercase'
                                        }}>
                                        Sync_Cal
                                    </button>
                                </div>

                                <div className="timeline-container">
                                    {planData.schedule.map((dayItem, idx) => (
                                        <div key={idx} className="day-group">
                                            <div className="day-header">
                                                <Calendar size="1.1em" style={{ marginRight: '0.5em', color: '#000' }} />
                                                {dayItem.day}
                                            </div>
                                            {dayItem.sessions.map((session, sIdx) => {
                                                return (
                                                    <div key={sIdx} className="session-card">
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
                                                            <div style={{
                                                                padding: '0.3em',
                                                                border: '0.15em solid #000',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                                            }}>
                                                                <BookOpen size="1em" color="#000" />
                                                            </div>
                                                            <div>
                                                                <div style={{ fontSize: '1em', fontWeight: 700, marginBottom: '0.3em' }}>
                                                                    UNIT {session.chapter}
                                                                </div>
                                                                <span className="tag-modern">
                                                                    {session.subject.name}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em', color: '#000', fontSize: '0.9em', fontWeight: 600 }}>
                                                            {session.duration}H
                                                            <ChevronRight size="1em" />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudyPlan;
