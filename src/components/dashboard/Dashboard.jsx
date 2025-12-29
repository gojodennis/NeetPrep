import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Flame, Target, Clock, ListTodo, X, CheckSquare, Square, ArrowRight } from 'lucide-react';
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
        <div className="space-y-8 animate-fade-in pb-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-display font-black text-earth-800 uppercase tracking-tight">
                        Hello, {user.name}!
                    </h1>
                    <p className="text-earth-600 font-medium mt-1 tracking-wide">
                        READY TO CRACK NEET TODAY?
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-earth-800 rounded-lg shadow-neobrutalism">
                    <Flame className="text-earth-500 fill-earth-500" size={20} />
                    <span className="font-bold font-mono text-earth-800">{user.streak} DAY STREAK</span>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Accuracy Card */}
                <div className="card-premium flex flex-col items-center justify-center text-center gap-4 min-h-[180px]">
                    <div className="p-3 bg-earth-50 border-2 border-earth-800 rounded-lg shadow-neobrutalism-sm">
                        <Target className="text-earth-700" size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-earth-800">{avgAccuracy}%</div>
                        <div className="text-xs font-bold text-earth-600 tracking-widest uppercase mt-1">Accuracy</div>
                    </div>
                </div>

                {/* Studied Hours Card */}
                <div className="card-premium flex flex-col items-center justify-center text-center gap-4 min-h-[180px]">
                    <div className="p-3 bg-earth-50 border-2 border-earth-800 rounded-lg shadow-neobrutalism-sm">
                        <Clock className="text-earth-700" size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-earth-800">{displayedHours}H</div>
                        <div className="text-xs font-bold text-earth-600 tracking-widest uppercase mt-1">Studied</div>
                    </div>
                </div>

                {/* Tasks Card (Interactive) */}
                <div
                    className="card-premium flex flex-col items-center justify-center text-center gap-4 min-h-[180px] cursor-pointer group bg-earth-50 hover:bg-earth-100"
                    onClick={() => setShowTasksModal(true)}
                >
                    <div className="p-3 bg-white border-2 border-earth-800 rounded-lg shadow-neobrutalism-sm group-hover:translate-x-1 group-hover:translate-y-1 transition-transform">
                        <ListTodo className="text-earth-700" size={28} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="text-4xl font-black text-earth-800 group-hover:text-earth-900 transition-colors">
                            {completedTasksCount}/{tasks.length}
                        </div>
                        <div className="text-xs font-bold text-earth-600 tracking-widest uppercase mt-1 flex items-center justify-center gap-1">
                            Pending Tasks
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity text-earth-500">
                                ↗
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Analytics */}
                <div className="card-premium flex flex-col">
                    <div className="flex justify-between items-baseline mb-6">
                        <h2 className="text-2xl font-display font-bold text-earth-800 uppercase">Analytics</h2>
                        <span className="text-sm font-medium text-earth-600">Last 7 Days</span>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-2 h-48 border-b-4 border-earth-800 pt-8 pb-1 px-2">
                        {user.accuracyHistory.map((val, index) => (
                            <div key={index} className="flex flex-col items-center justify-end w-full h-full group relative">
                                <div
                                    className="w-full max-w-[40px] bg-earth-800 rounded-t-sm transition-all duration-300 group-hover:bg-earth-600 group-hover:opacity-90 cursor-pointer"
                                    style={{ height: `${val}%` }}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-earth-800 text-earth-50 text-xs font-bold py-1 px-2 rounded transition-opacity shadow-sm whitespace-nowrap pointer-events-none">
                                        {val}%
                                    </div>
                                </div>
                                <span className="text-xs font-mono font-bold text-earth-600 mt-2">
                                    D-{6 - index}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Upcoming Sessions */}
                <div className="card-premium flex flex-col h-full">
                    <div className="flex justify-between items-baseline mb-6">
                        <h2 className="text-2xl font-display font-bold text-earth-800 uppercase">Sessions</h2>
                        <span className="text-sm font-medium text-earth-600 uppercase tracking-wider">Upcoming</span>
                    </div>

                    <div className="flex-1 space-y-4 mb-6 overflow-y-auto max-h-[300px] pr-2">
                        {state.plan?.data ? (
                            (state.plan.data.schedule[0]?.sessions || []).slice(0, 3).map((session, i) => {
                                const subjectLower = session.subject.name.toLowerCase();
                                const isPhysics = subjectLower.includes('physics');
                                const isBio = subjectLower.includes('biology');
                                const isChem = subjectLower.includes('chemistry');

                                let tagBg = 'bg-blue-100 text-blue-800';
                                if (isPhysics) tagBg = 'bg-cyan-100 text-cyan-900 border-cyan-200';
                                if (isBio) tagBg = 'bg-green-100 text-green-900 border-green-200';
                                if (isChem) tagBg = 'bg-orange-100 text-orange-900 border-orange-200';

                                return (
                                    <div key={i} className="flex flex-col p-4 border-2 border-earth-200 rounded-lg hover:border-earth-400 transition-colors bg-earth-50/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border ${tagBg}`}>
                                                {session.subject.name}
                                            </span>
                                            <span className="text-xs font-mono font-bold text-earth-500 flex items-center gap-1">
                                                <Clock size={12} />
                                                {session.duration}H
                                            </span>
                                        </div>
                                        <h3 className="font-bold text-earth-800 leading-tight uppercase font-display">
                                            {session.chapter}
                                        </h3>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-earth-300 rounded-lg text-center opacity-75">
                                <ListTodo className="text-earth-400 mb-3" size={32} />
                                <h3 className="text-lg font-bold text-earth-700">No Active Plan</h3>
                                <p className="text-sm text-earth-500">Execute a new strategy to populate missions.</p>
                            </div>
                        )}
                    </div>

                    <button
                        className="btn-primary w-full mt-auto flex items-center justify-center gap-2 group"
                        onClick={() => navigate('/app/plan')}
                    >
                        {state.plan?.data ? 'VIEW FULL PLAN' : 'GENERATE PLAN'}
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Tasks Modal */}
            {showTasksModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-earth-900/50 backdrop-blur-sm"
                        onClick={() => setShowTasksModal(false)}
                    ></div>
                    <div className="relative w-full max-w-lg bg-white border-2 border-earth-800 rounded-xl shadow-neobrutalism-lg p-6 md:p-8 animate-fade-in lg:mt-0 mt-20">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-display font-black text-earth-800 uppercase tracking-tight">Today's Missions</h2>
                            <button
                                className="p-2 hover:bg-earth-100 rounded-lg transition-colors border-2 border-transparent hover:border-earth-800"
                                onClick={() => setShowTasksModal(false)}
                            >
                                <X size={24} className="text-earth-800" />
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                            {tasks.map(task => (
                                <div
                                    key={task.id}
                                    className={`
                                        flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all
                                        ${task.completed
                                            ? 'bg-earth-100 border-earth-800 opacity-60'
                                            : 'bg-white border-earth-800 hover:shadow-neobrutalism-sm hover:-translate-y-0.5'
                                        }
                                    `}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    <div className={`mt-0.5 ${task.completed ? 'text-earth-600' : 'text-earth-800'}`}>
                                        {task.completed ? <CheckSquare size={20} /> : <Square size={20} />}
                                    </div>
                                    <span className={`font-medium ${task.completed ? 'line-through text-earth-600' : 'text-earth-800'}`}>
                                        {task.text}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center border-t-2 border-dashed border-earth-200 pt-4">
                            <p className="text-sm font-mono font-bold text-earth-500 uppercase tracking-widest">
                                {completedTasksCount === tasks.length
                                    ? "ALL SYSTEMS GO! GREAT JOB."
                                    : `${tasks.length - completedTasksCount} TASKS REMAINING.`}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
