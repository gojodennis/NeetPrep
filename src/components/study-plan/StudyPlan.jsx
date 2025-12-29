import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Bot, Calendar, Clock, Target, BookOpen, Sparkles, ChevronRight, Terminal, Zap, ArrowRight, Layout } from 'lucide-react';
import { generateStudyPlan } from '../../services/aiService';

const StudyPlan = () => {
    const { state, updatePlan } = useAppContext();
    const { user } = useAuth();
    const { addToast } = useToast();
    const [loading, setLoading] = useState(false);
    const [statusText, setStatusText] = useState('');

    const configPanelRef = useRef(null);
    const [dashboardHeight, setDashboardHeight] = useState('auto');

    useEffect(() => {
        const updateHeight = () => {
            if (configPanelRef.current && window.innerWidth >= 1024) {
                setDashboardHeight(`${configPanelRef.current.offsetHeight}px`);
            } else {
                setDashboardHeight('auto');
            }
        };

        // Initial update
        updateHeight();

        // Resize listener
        window.addEventListener('resize', updateHeight);

        // Mutation observer for content changes (optional but good for dynamic content)
        const observer = new ResizeObserver(updateHeight);
        if (configPanelRef.current) observer.observe(configPanelRef.current);

        return () => {
            window.removeEventListener('resize', updateHeight);
            observer.disconnect();
        };
    }, [state.plan?.data]); // Re-run when plan data changes might affect layout


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
                addToast("PLAN GENERATED SUCCESSFULLY");
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
        <div className="animate-fade-in max-w-7xl mx-auto space-y-8 pb-12">

            {/* Header */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-display font-black text-earth-800 uppercase tracking-tight">
                        AI Study Architect
                    </h1>
                    <p className="text-earth-600 font-medium mt-1 tracking-wide">
                        DESIGN YOUR PATH TO VICTORY
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-earth-800 rounded-lg shadow-neobrutalism">
                    <Zap className="text-earth-600 fill-earth-600" size={20} />
                    <span className="font-bold font-mono text-earth-800">POWERED BY GEMINI 1.5 PRO</span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Configuration Panel */}
                <div ref={configPanelRef} className="lg:col-span-4 card-premium sticky top-8">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-earth-200">
                        <div className="p-2 bg-earth-100 rounded-lg border border-earth-300">
                            <Target size={20} className="text-earth-800" />
                        </div>
                        <h2 className="text-xl font-display font-bold text-earth-800 uppercase tracking-tight">
                            Strategy Config
                        </h2>
                    </div>

                    <form onSubmit={handleGenerate} className="space-y-6">
                        {/* Target Date */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-earth-600 uppercase tracking-widest">
                                Target Date
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full px-4 py-3 bg-earth-50 border-2 border-earth-200 rounded-lg focus:border-earth-800 focus:bg-white focus:shadow-neobrutalism transition-all outline-none font-mono text-earth-800"
                                value={inputs.targetDate}
                                onChange={e => setInputs({ ...inputs, targetDate: e.target.value })}
                            />
                        </div>

                        {/* Intensity Level */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold text-earth-600 uppercase tracking-widest text-center block">
                                Daily Intensity
                            </label>
                            <div className="flex justify-center gap-4">
                                {[6, 8, 10].map(hours => (
                                    <button
                                        key={hours}
                                        type="button"
                                        onClick={() => setInputs({ ...inputs, dailyHours: hours })}
                                        className={`
                                            w-14 h-14 rounded-xl flex flex-col items-center justify-center border-2 transition-all font-bold
                                            ${inputs.dailyHours === hours
                                                ? 'bg-earth-800 border-earth-800 text-white shadow-neobrutalism translate-y-[-2px]'
                                                : 'bg-white border-earth-200 text-earth-600 hover:border-earth-400 hover:bg-earth-50'
                                            }
                                        `}
                                    >
                                        <span className="text-lg leading-none">{hours}</span>
                                        <span className="text-[10px] uppercase font-mono mt-0.5 opacity-80">Hrs</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Focus Area */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-earth-600 uppercase tracking-widest">
                                Priority Focus
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {['balanced', 'physics', 'chemistry', 'biology'].map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        className={`
                                            py-2.5 px-3 rounded-lg border-2 text-sm font-bold uppercase tracking-wide transition-all
                                            ${inputs.focusArea === type
                                                ? 'bg-earth-100 border-earth-800 text-earth-900 shadow-sm'
                                                : 'bg-white border-earth-200 text-earth-500 hover:border-earth-400'
                                            }
                                        `}
                                        onClick={() => setInputs({ ...inputs, focusArea: type })}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Action */}
                        <button
                            type="submit"
                            className="btn-primary w-full flex items-center justify-center gap-2 mt-8 group"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="animate-pulse">PROCESSING...</span>
                            ) : (
                                <>
                                    <Terminal size={18} />
                                    <span>GENERATE PROTOCOL</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform opacity-70" />
                                </>
                            )}
                        </button>
                    </form>

                    {statusText && (
                        <div className="mt-4 p-3 bg-earth-50 border border-earth-200 rounded-lg text-xs font-mono text-center text-earth-600 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1">
                            <div className="w-2 h-2 bg-earth-600 rounded-full animate-pulse" />
                            {statusText}
                        </div>
                    )}
                </div>

                {/* Results Panel */}
                <div className="lg:col-span-8 flex flex-col h-full">
                    {!planData ? (
                        <div className="card-premium flex flex-col items-center justify-center py-20 text-center min-h-[500px]">
                            <div className="w-24 h-24 bg-earth-50 border-2 border-earth-200 rounded-full flex items-center justify-center mb-6 animate-bounce-slow">
                                <Layout size={40} className="text-earth-400" />
                            </div>
                            <h3 className="text-xl font-bold text-earth-800 uppercase mb-2">Awaiting Parameters</h3>
                            <p className="text-earth-500 max-w-sm mx-auto font-mono text-sm leading-relaxed">
                                // SYSTEM STANDBY<br />
                                // CONFIGURE INPUTS TO INITIATE<br />
                                // STUDY PROTOCOL GENERATION
                            </p>
                        </div>
                    ) : (
                        <div
                            className="card-premium flex flex-col animate-in slide-in-from-bottom-4 fade-in duration-500"
                            style={{ height: dashboardHeight }}
                        >
                            {/* Results Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 pb-6 border-b-2 border-earth-100">
                                <div>
                                    <h2 className="text-2xl font-display font-black text-earth-800 uppercase tracking-tight flex items-center gap-2">
                                        Mission Roadmap
                                    </h2>
                                    <div className="flex items-center gap-4 mt-2 text-sm font-mono font-bold text-earth-600">
                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-earth-50 rounded border border-earth-200">
                                            <Clock size={14} /> {planData.hours}H / DAY
                                        </span>
                                        <span className="flex items-center gap-1.5 px-2 py-1 bg-earth-50 rounded border border-earth-200">
                                            <Target size={14} /> {planData.focus.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    className="btn-outline flex items-center gap-2 text-sm py-2 px-4 ml-auto sm:ml-0"
                                    onClick={() => addToast("Calendar Synced")}
                                >
                                    <Calendar size={16} />
                                    SYNC CALENDAR
                                </button>
                            </div>

                            {/* Timeline Content */}
                            <div className="space-y-8 pr-2 custom-scrollbar overflow-y-auto flex-1">
                                {planData.schedule.map((dayItem, idx) => (
                                    <div key={idx} className="relative pl-8 border-l-2 border-earth-200 last:border-0 pb-8 last:pb-0">
                                        {/* Timeline Dot */}
                                        <div className="absolute -left-[9px] top-0 w-[16px] h-[16px] bg-earth-800 border-2 border-white ring-2 ring-earth-100 rounded-full" />

                                        <h3 className="text-lg font-display font-bold text-earth-800 mb-4 flex items-center uppercase">
                                            {dayItem.day}
                                        </h3>

                                        <div className="grid gap-3">
                                            {dayItem.sessions.map((session, sIdx) => {
                                                const subjectLower = session.subject.name.toLowerCase();
                                                const isPhysics = subjectLower.includes('physics');
                                                const isBio = subjectLower.includes('biology');
                                                const isChem = subjectLower.includes('chemistry');

                                                let accentColor = 'border-earth-200 hover:border-earth-400 bg-white';
                                                let iconColor = 'bg-earth-100 text-earth-700';

                                                if (isPhysics) {
                                                    accentColor = 'border-cyan-200 hover:border-cyan-400 bg-cyan-50/30';
                                                    iconColor = 'bg-cyan-100 text-cyan-800';
                                                } else if (isBio) {
                                                    accentColor = 'border-green-200 hover:border-green-400 bg-green-50/30';
                                                    iconColor = 'bg-green-100 text-green-800';
                                                } else if (isChem) {
                                                    accentColor = 'border-orange-200 hover:border-orange-400 bg-orange-50/30';
                                                    iconColor = 'bg-orange-100 text-orange-800';
                                                }

                                                return (
                                                    <div
                                                        key={sIdx}
                                                        className={`
                                                            group relative p-4 rounded-xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-md
                                                            ${accentColor}
                                                        `}
                                                    >
                                                        <div className="flex justify-between items-center gap-4">
                                                            <div className="flex items-center gap-4">
                                                                <div className={`p-2.5 rounded-lg border border-transparent group-hover:bg-white transition-colors ${iconColor}`}>
                                                                    <BookOpen size={20} />
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-earth-900 leading-tight uppercase tracking-tight">
                                                                        Unit: {session.chapter}
                                                                    </h4>
                                                                    <span className="text-xs font-bold text-earth-500 uppercase tracking-widest mt-1 block">
                                                                        {session.subject.name}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 font-mono font-bold text-earth-700 bg-white/50 px-3 py-1.5 rounded-lg border border-earth-100">
                                                                <Clock size={14} />
                                                                {session.duration}h
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
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
