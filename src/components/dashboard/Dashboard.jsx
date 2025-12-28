import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flame, Target, Clock, ListTodo, X, CheckSquare, Square } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const { state } = useAppContext();
    const { user } = state;
    const navigate = useNavigate();

    // Task Modal State
    const [showTasksModal, setShowTasksModal] = useState(false);
    const [tasks, setTasks] = useState([
        { id: 1, text: "Solve 50 Physics PYQs (Rotational Motion)", completed: false },
        { id: 2, text: "Read NCERT Biology: Human Physiology", completed: false },
        { id: 3, text: "Practice Chemistry Numerical Problems", completed: false },
        { id: 4, text: "Review Mistakes from Last Mock Test", completed: false },
        { id: 5, text: "Take a 15 min break (Pomodoro)", completed: false }
    ]);

    const toggleTask = (id) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    // Calculate stats
    const completedTasksCount = tasks.filter(t => t.completed).length;
    const totalAccuracy = user.accuracyHistory.reduce((a, b) => a + b, 0);
    const avgAccuracy = Math.round(totalAccuracy / user.accuracyHistory.length) || 0;

    const isGuest = user.id === 'guest_user';
    const displayedHours = isGuest ? 12 : Math.floor(user.hoursStudied);

    return (
        <div className="view-section active animate-fade-in">
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>HELLO, {user.name}!</h1>
                    <p className="text-muted">READY TO CRACK NEET TODAY?</p>
                </div>
                <div className="tag" style={{ fontSize: '1rem', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px', background: '#fff' }}>
                    <Flame color="black" size={20} />
                    <span>{user.streak} DAY STREAK</span>
                </div>
            </header>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                <div className="card stat-card">
                    <div className="stat-icon">
                        <Target size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="stat-value">{avgAccuracy}%</div>
                        <div className="stat-label">ACCURACY</div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon">
                        <Clock size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="stat-value">{displayedHours}H</div>
                        <div className="stat-label">STUDIED</div>
                    </div>
                </div>
                <div
                    className="card stat-card task-card-interactive"
                    onClick={() => setShowTasksModal(true)}
                    style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                >
                    <div className="stat-icon">
                        <ListTodo size={24} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="stat-value">{completedTasksCount}/{tasks.length}</div>
                        <div className="stat-label">TASKS <span style={{ fontSize: '0.7em', color: 'var(--primary)', textDecoration: 'underline' }}>(CLICK ME)</span></div>
                    </div>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Performance Chart */}
                <div className="card">
                    <h2>ANALYTICS</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>Last 7 sessions accuracy</p>
                    <div className="chart-container">
                        {user.accuracyHistory.map((val, index) => {
                            const height = val; // Assuming 0-100 scale
                            let bgColor = 'black';
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
                <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <h2>SESSIONS</h2>
                    <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: '0.2rem', marginBottom: '1rem', textTransform: 'uppercase' }}>UPCOMING</p>
                    <div className="timeline" style={{ marginTop: '0.5rem', flex: 1, minHeight: '200px' }}>
                        {state.plan?.data ? (
                            (state.plan.data.schedule[0]?.sessions || []).slice(0, 3).map((session, i) => (
                                <div key={i} className="timeline-item">
                                    <div className={`tag tag-${session.subject.name.toLowerCase().substring(0, 3) === 'phy' ? 'phys' : session.subject.name.toLowerCase().substring(0, 3)}`}>
                                        {session.subject.name}
                                    </div>
                                    <div style={{ fontWeight: 800, marginTop: '8px', textTransform: 'uppercase' }}>{session.chapter}</div>
                                    <div className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>Duration: {session.duration}H</div>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', opacity: 0.5, border: '2px dashed #000', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>NO ACTIVE PLAN</div>
                                <div style={{ fontSize: '0.8rem' }}>Execute a new strategy to populate missions.</div>
                            </div>
                        )}
                    </div>
                    <button
                        className="secondary"
                        style={{ width: '100%', marginTop: 'auto' }}
                        onClick={() => navigate('/app/plan')}
                    >
                        {state.plan?.data ? 'VIEW FULL PLAN' : 'GENERATE PLAN'}
                    </button>
                </div>
            </div>

            {/* Tasks Modal */}
            {showTasksModal && (
                <div className="modal-overlay">
                    <div className="card modal-content animate-fade-in">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2>TODAY'S MISSIONS</h2>
                            <button className="icon-btn" onClick={() => setShowTasksModal(false)}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="task-list">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`task-item ${task.completed ? 'completed' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                                    <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <p className="text-muted" style={{ fontSize: '0.9rem' }}>
                                {completedTasksCount === tasks.length
                                    ? "ALL SYSTEMS GO! GREAT JOB."
                                    : `${tasks.length - completedTasksCount} TASKS REMAINING.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        .stat-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            padding: clamp(1rem, 3vh, 2rem) 1rem;
            height: clamp(150px, 20vh, 250px);
            justify-content: space-evenly;
        }
        
        .task-card-interactive {
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .task-card-interactive:hover {
            transform: translate(-4px, -4px);
            box-shadow: 6px 6px 0px 0px black;
            background: #fdfdfd;
        }
        
        .stat-icon {
            width: 60px;
            height: 60px;
            border: 3px solid black;
            box-shadow: 4px 4px 0px 0px black;
            border-radius: 12px;
            background: #fff;
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
        }
        
        .stat-value {
            font-size: 2.5rem;
            font-weight: 900;
            line-height: 1.2;
            margin-bottom: 0.25rem;
        }
        
        .stat-label {
            font-size: 0.8rem;
            font-weight: 800;
            color: var(--text-muted);
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        /* Chart Styles */
        .chart-container {
            height: 250px;
            width: 100%;
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            padding-top: 40px;
            padding-bottom: 10px;
            border-bottom: 3px solid black;
            gap: 10px;
        }
        
        .bar-group {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            height: 100%;
            justify-content: flex-end;
        }

        .bar {
            width: 70%;
            border: none;
            background: black;
            transition: height 0.3s ease;
            position: relative;
            min-height: 4px;
            border-radius: 4px 4px 0 0;
        }
        
        .bar:hover {
            opacity: 0.8;
        }

        .bar-tooltip {
            position: absolute;
            top: -35px;
            left: 50%;
            transform: translateX(-50%);
            background: black;
            color: white;
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
            pointer-events: none;
            white-space: nowrap;
        }
            pointer-events: none;
            z-index: 10;
        }
        
        .bar:hover .bar-tooltip {
            opacity: 1;
        }
        
        .bar-label {
            margin-top: 8px;
            font-size: 12px;
            color: var(--text-muted);
            font-weight: 600;
        }

        .timeline-item {
            padding-left: 20px;
            border-left: 2px solid #eee;
            position: relative;
            padding-bottom: 8px;
            font-size: 0.9em;
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -6px;
            top: 0;
            width: 10px;
            height: 10px;
            background: black;
            border-radius: 50%;
        }
        
        .timeline {
             overflow-y: auto;
             max-height: 25vh;
             padding-right: 5px;
        }
        
        .tag-phys { background: #E0F7FA; color: #006064; } /* Cyan */
        .tag-bio { background: #E8F5E9; color: #1B5E20; } /* Green */
        .tag-chem { background: #FFF3E0; color: #E65100; } /* Orange */

        /* Modal Styles */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            backdrop-filter: blur(2px);
        }

        .modal-content {
            width: 90%;
            max-width: 500px;
            background: white;
            max-height: 80vh;
            overflow-y: auto;
            border: 4px solid black;
            box-shadow: 8px 8px 0px 0px black;
            padding: 2rem;
        }

        .icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            box-shadow: none;
            color: black;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .icon-btn:hover {
            transform: scale(1.1);
            background: none;
            box-shadow: none;
        }

        .task-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .task-item {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem;
            border: 2px solid black;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.2s;
            box-shadow: 2px 2px 0px 0px black;
        }

        .task-item:hover {
            transform: translate(-1px, -1px);
            box-shadow: 3px 3px 0px 0px black;
            background: #f9f9f9;
        }

        .task-item.completed {
            background: #f0fdf4;
            border-color: #000;
            opacity: 0.8;
            text-decoration: line-through;
            color: #666;
        }
        `}
            </style>
        </div>
    );
};

export default Dashboard;
