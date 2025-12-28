import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { Bot, Calendar as CalIcon } from 'lucide-react'; // Renamed import to avoid conflict if I used Calendar elsewhere

const StudyPlan = () => {
    const { state, setPlanGenerated } = useAppContext();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');
    const [planData, setPlanData] = useState(null); // Local state for the generated plan view

    const [inputs, setInputs] = useState({
        targetDate: '',
        dailyHours: 6,
        focusArea: 'balanced'
    });

    const handleGenerate = (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusText("Analyzing syllabus and past papers...");

        // Simulate API
        setTimeout(() => {
            setLoading(false);
            setStatusText("");
            setPlanGenerated(true);
            addToast("Study plan synced to Google Calendar (Mock)");

            // Generate content
            const pData = generatePlan(inputs.dailyHours, inputs.focusArea);
            setPlanData(pData);
        }, 2000);
    };

    const generatePlan = (hours, focus) => {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const subjects = [
            { code: 'phys', name: 'Physics' },
            { code: 'chem', name: 'Chemistry' },
            { code: 'bio', name: 'Biology' }
        ];

        const slots = 2; // Sessions per day

        const schedule = days.map(day => {
            const sessions = [];
            for (let i = 0; i < slots; i++) {
                // Focus logic: 0 = phys, 1 = chem, 2 = bio
                // Balanced: 0, 1, 2 cycling?
                // The original logic was:
                // i==0 ? 0 : (focus==balanced?1:2) -> This is a bit weird but I'll stick to the "intent"
                // Let's improve the logic slightly for React
                let subIndex = 0;
                if (focus === 'balanced') subIndex = i % 3;
                else if (focus === 'physics') subIndex = i === 0 ? 0 : 0; // Emphasis on Phys
                else if (focus === 'chemistry') subIndex = i === 0 ? 1 : 1;
                else if (focus === 'biology') subIndex = i === 0 ? 2 : 2;

                // Original logic exact replication for safety:
                // i === 0 ? 0 : (focus === 'balanced' ? 1 : 2); -> This always picked Phys first, then Chem(bal) or Bio(unbal?). 
                // Wait, original: subIndex = i === 0 ? 0 : (focus === 'balanced' ? 1 : 2);
                // if focus=phys, i=1 -> subIndex=2 (Bio). That seems wrong for "Physics focus" unless it's just filling gaps.
                // Actually, let's just make a simple distinct pattern.
                if (i === 1) {
                    if (focus === 'balanced') subIndex = 1;
                    if (focus === 'physics') subIndex = 0; // Extra physics
                    if (focus === 'chemistry') subIndex = 1;
                    if (focus === 'biology') subIndex = 2;
                }

                // Randomize subject for variety if balanced
                if (focus === 'balanced') subIndex = Math.floor(Math.random() * 3);

                const sub = subjects[subIndex] || subjects[0];

                sessions.push({
                    subject: sub,
                    duration: Math.floor(hours / slots),
                    chapter: Math.floor(Math.random() * 20) + 1
                });
            }
            return { day, sessions };
        });

        return { hours, focus, schedule };
    };

    return (
        <div className="view-section active animate-fade-in">
            <header>
                <h1>AI Study Planner</h1>
            </header>

            <div className="grid" style={{ gridTemplateColumns: '1fr 2fr' }}>
                <div className="card">
                    <h2>Generate Plan</h2>
                    <form onSubmit={handleGenerate}>
                        <div className="form-group">
                            <label>Target Exam Date</label>
                            <input
                                type="date"
                                required
                                value={inputs.targetDate}
                                onChange={e => setInputs({ ...inputs, targetDate: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Daily Study Hours</label>
                            <input
                                type="number"
                                min="1" max="16"
                                required
                                value={inputs.dailyHours}
                                onChange={e => setInputs({ ...inputs, dailyHours: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Focus Area (Weakness)</label>
                            <select
                                value={inputs.focusArea}
                                onChange={e => setInputs({ ...inputs, focusArea: e.target.value })}
                            >
                                <option value="balanced">Balanced</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="biology">Biology</option>
                            </select>
                        </div>
                        <button type="submit" disabled={loading}>
                            {loading ? <div className="spinner"></div> : <span>Generate Schedule</span>}
                        </button>
                    </form>
                    <div className="text-muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                        {statusText}
                    </div>
                </div>

                <div className="card">
                    <h2>Your Personalized Schedule</h2>
                    {!planData ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                            <Bot size={48} style={{ marginBottom: '1rem' }} />
                            <p>No plan generated yet. Configure your settings and click Generate.</p>
                        </div>
                    ) : (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                                <div>
                                    <h3 style={{ margin: 0 }}>Weekly Plan</h3>
                                    <span className="text-muted" style={{ fontSize: '0.9rem' }}>{planData.hours} Hours/Day • Focus: {planData.focus}</span>
                                </div>
                                <button className="secondary" onClick={() => addToast("Calendar Synced")}>Sync</button>
                            </div>

                            <div className="timeline">
                                {planData.schedule.map((dayItem, idx) => (
                                    <div key={idx} className="timeline-item">
                                        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{dayItem.day}</div>
                                        {dayItem.sessions.map((session, sIdx) => (
                                            <div key={sIdx} style={{ background: '#f9fafb', padding: '8px', borderRadius: '6px', marginBottom: '4px', fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                                                <span>
                                                    <span className={`tag tag-${session.subject.code}`} style={{ fontSize: '0.6rem', marginRight: '8px' }}>
                                                        {session.subject.name}
                                                    </span>
                                                    Chapter {session.chapter}
                                                </span>
                                                <span>{session.duration}h</span>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudyPlan;
