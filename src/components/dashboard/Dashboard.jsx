import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flame, Target, Clock, ListTodo } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { state } = useAppContext();
    const { user } = state;
    const navigate = useNavigate();

    // Calculate stats
    const totalAccuracy = user.accuracyHistory.reduce((a, b) => a + b, 0);
    const avgAccuracy = Math.round(totalAccuracy / user.accuracyHistory.length) || 0;

    return (
        <div className="view-section active animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Hello, {user.name}!</h1>
                    <p className="text-muted">Ready to crack NEET today?</p>
                </div>
                <div className="tag" style={{ fontSize: '1rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid var(--border)' }}>
                    <Flame className="text-warning" size={20} />
                    <span>{user.streak} Day Streak</span>
                </div>
            </header>

            <div className="grid">
                <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon">
                        <Target size={24} />
                    </div>
                    <div>
                        <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{avgAccuracy}%</div>
                        <div className="stat-label text-muted">Overall Accuracy</div>
                    </div>
                </div>
                <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon">
                        <Clock size={24} />
                    </div>
                    <div>
                        <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{user.hoursStudied}h</div>
                        <div className="stat-label text-muted">Hours Studied (This Week)</div>
                    </div>
                </div>
                <div className="card stat-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div className="stat-icon">
                        <ListTodo size={24} />
                    </div>
                    <div>
                        <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: 700 }}>12</div>
                        <div className="stat-label text-muted">Pending Tasks</div>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Performance Chart */}
                <div className="card">
                    <h2>Performance Analytics</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Accuracy over last 7 sessions</p>
                    <div className="chart-container">
                        {user.accuracyHistory.map((val, index) => {
                            const height = val; // Assuming 0-100 scale
                            let bgColor = 'var(--primary)';
                            if (val < 50) bgColor = 'var(--danger)';
                            else if (val < 75) bgColor = 'var(--warning)';

                            return (
                                <div key={index} className="bar-group">
                                    <div
                                        className="bar"
                                        style={{ height: `${height}%`, backgroundColor: bgColor }}
                                        data-val={`${val}%`}
                                    >
                                        <div className="bar-tooltip">{val}%</div>
                                    </div>
                                    <div className="bar-label">D-{6 - index}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="card">
                    <h2>Upcoming Sessions</h2>
                    <div className="timeline" style={{ marginTop: '1rem', border: 'none', padding: 0 }}>
                        <div className="timeline-item" style={{ marginBottom: '1rem', borderLeft: 'none', paddingLeft: 0 }}>
                            <div className="tag tag-phys">Physics</div>
                            <div style={{ fontWeight: 600, marginTop: '4px' }}>Rotational Dynamics</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>Today, 4:00 PM</div>
                        </div>
                        <div className="timeline-item" style={{ marginBottom: 0, borderLeft: 'none', paddingLeft: 0 }}>
                            <div className="tag tag-bio">Biology</div>
                            <div style={{ fontWeight: 600, marginTop: '4px' }}>Human Physiology</div>
                            <div className="text-muted" style={{ fontSize: '0.8rem' }}>Tomorrow, 10:00 AM</div>
                        </div>
                    </div>
                    <button
                        className="secondary"
                        style={{ width: '100%', marginTop: '1rem', justifyContent: 'center' }}
                        onClick={() => navigate('/plan')}
                    >
                        View Full Plan
                    </button>
                </div>
            </div>

            <style>{`
        .stat-icon {
            width: 48px;
            height: 48px;
            border-radius: 10px;
            background: #eff6ff;
            color: var(--primary);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        /* Chart Styles */
        .chart-container {
            height: 250px;
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            padding-top: 20px;
            border-bottom: 1px solid var(--border);
        }
        
        .bar-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 10%;
            height: 100%;
            justify-content: flex-end;
        }

        .bar {
            width: 100%;
            border-radius: 4px 4px 0 0;
            transition: height 0.5s ease;
            position: relative;
        }

        .bar-tooltip {
            position: absolute;
            top: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--text-main);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
        }

        .bar:hover .bar-tooltip {
            opacity: 1;
        }

        .bar-label { margin-top: 8px; fontSize: 0.75rem; color: var(--text-muted); }
      `}</style>
        </div>
    );
};

export default Dashboard;
