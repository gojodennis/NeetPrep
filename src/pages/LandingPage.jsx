import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, CheckCircle, BarChart2, Calendar, Target, BookOpen } from 'lucide-react';

const LandingPage = () => {
    const { loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const handleDemoLogin = (e) => {
        e.preventDefault();
        loginAsGuest();
        navigate('/app');
    };

    return (
        <div className="min-h-screen bg-earth-50 font-sans selection:bg-earth-400">


            {/* Hero Section */}
            <section className="pt-12 pb-12 lg:pt-24 lg:pb-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center px-4 py-2 rounded-full border-2 border-earth-700 bg-white mb-8 shadow-neobrutalism-sm animate-fade-in text-sm font-bold tracking-wide">
                            <span className="w-2 h-2 rounded-full bg-earth-500 mr-2 animate-pulse"></span>
                            AI-POWERED STUDY ARCHITECT
                        </div>

                        <h1 className="text-5xl md:text-7xl font-display font-bold text-earth-900 leading-[1.1] mb-8 animate-fade-in-up">
                            Master NEET with <br />
                            <span className="text-white bg-earth-700 px-4 rotate-1 inline-block shadow-neobrutalism mx-2">Organic</span>
                            Precision
                        </h1>

                        <p className="text-xl text-earth-700/80 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            Stop organizing chaos. Start strategic learning. Our AI builds your schedule, adapts to your weaknesses, and ensures you peak on exam day.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <Link to="/signup" className="btn-primary group text-lg w-full sm:w-auto">
                                Start Your Journey
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button onClick={handleDemoLogin} className="btn-outline text-lg w-full sm:w-auto bg-transparent cursor-pointer">
                                View Demo
                            </button>
                        </div>
                    </div>
                </div>

                {/* Background Elements */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 -mb-32 hidden lg:block opacity-10 pointer-events-none">
                    <svg width="400" height="400" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#283618" d="M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.6,-46.6C91.4,-34.1,98.1,-19.2,95.8,-4.9C93.5,9.3,82.2,22.9,71.7,35.2C61.3,47.5,51.6,58.5,40.1,65.8C28.6,73.1,15.3,76.6,1,74.9C-13.3,73.1,-25.1,66.1,-36.4,58.3C-47.7,50.5,-58.5,41.9,-66.3,31.2C-74.1,20.5,-78.9,7.7,-77.2,-4.3C-75.5,-16.3,-67.2,-27.5,-58.1,-37.6C-49,-47.7,-39,-56.7,-28,-65.4C-17,-74.1,-4.9,-82.5,4.9,-91C14.7,-99.5,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
                    </svg>
                </div>
                <div className="absolute bottom-0 right-0 hidden lg:block opacity-10 pointer-events-none">
                    <svg width="500" height="500" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#bc6c25" d="M47.5,-67.2C59.6,-56.3,66.5,-39.8,69.9,-23.4C73.3,-7,73.1,9.4,66.7,23.3C60.3,37.3,47.7,48.8,34.5,56.7C21.3,64.6,7.5,69,-5.8,77C-19.1,85,-31.9,96.6,-43,90.4C-54.1,84.1,-63.5,60.1,-69.5,40.1C-75.4,20.1,-77.9,4.2,-73.9,-9.4C-69.8,-23,-59.2,-34.3,-48.1,-45.5C-36.9,-56.7,-25.3,-67.7,-11.3,-74.8C2.7,-81.9,35.4,-78.1,47.5,-67.2Z" transform="translate(100 100)" />
                    </svg>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white border-y-2 border-earth-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-earth-900 mb-4">
                            Built for <span className="underline decoration-earth-500 decoration-4 underline-offset-4">Obsessive</span> Growth
                        </h2>
                        <p className="text-lg text-earth-700/80 max-w-2xl mx-auto">
                            Conventional study plans fail because they are static. NeetPrep evolves with you.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="card-premium group">
                            <div className="w-12 h-12 bg-earth-200 rounded-lg border-2 border-earth-700 flex items-center justify-center mb-6 group-hover:bg-earth-400 transition-colors">
                                <Calendar className="w-6 h-6 text-earth-900" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Dynamic Scheduling</h3>
                            <p className="text-earth-700/80 leading-relaxed">
                                Missed a day? Our algorithm instantly recalculates your path to cover backlogs without burnout.
                            </p>
                        </div>

                        <div className="card-premium group">
                            <div className="w-12 h-12 bg-earth-200 rounded-lg border-2 border-earth-700 flex items-center justify-center mb-6 group-hover:bg-earth-400 transition-colors">
                                <Target className="w-6 h-6 text-earth-900" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Laser-Focused Weakness</h3>
                            <p className="text-earth-700/80 leading-relaxed">
                                We identify your weak topics and seamlessly weave revision into your daily plan. Kill the weak spots.
                            </p>
                        </div>

                        <div className="card-premium group">
                            <div className="w-12 h-12 bg-earth-200 rounded-lg border-2 border-earth-700 flex items-center justify-center mb-6 group-hover:bg-earth-400 transition-colors">
                                <BarChart2 className="w-6 h-6 text-earth-900" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 font-display">Deep Analytics</h3>
                            <p className="text-earth-700/80 leading-relaxed">
                                Visualize your retention rates and solving speed. Move from "studying" to "improving".
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof / Stats */}
            <section className="py-24 bg-earth-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div className="text-center p-6 border-r-2 border-earth-700/10 last:border-0 hover:bg-white/50 transition-colors rounded-lg">
                            <div className="text-4xl font-display font-bold text-earth-900 mb-2">50k+</div>
                            <div className="text-sm font-mono uppercase tracking-widest text-earth-600">Active Questions</div>
                        </div>
                        <div className="text-center p-6 border-r-2 border-earth-700/10 last:border-0 hover:bg-white/50 transition-colors rounded-lg">
                            <div className="text-4xl font-display font-bold text-earth-900 mb-2">98%</div>
                            <div className="text-sm font-mono uppercase tracking-widest text-earth-600">User Satisfaction</div>
                        </div>
                        <div className="text-center p-6 border-r-2 border-earth-700/10 last:border-0 hover:bg-white/50 transition-colors rounded-lg">
                            <div className="text-4xl font-display font-bold text-earth-900 mb-2">24/7</div>
                            <div className="text-sm font-mono uppercase tracking-widest text-earth-600">AI Availability</div>
                        </div>
                        <div className="text-center p-6 hover:bg-white/50 transition-colors rounded-lg">
                            <div className="text-4xl font-display font-bold text-earth-900 mb-2">120+</div>
                            <div className="text-sm font-mono uppercase tracking-widest text-earth-600">Chapters Covered</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-earth-900 text-earth-50 relative overflow-hidden">
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-display font-bold mb-8">
                        Your Medical Seat is Waiting.
                    </h2>
                    <p className="text-xl text-earth-200 mb-12 max-w-2xl mx-auto">
                        Join the students who have swapped stress for strategy. Start your free trial today.
                    </p>
                    <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-earth-400 text-earth-900 text-lg font-bold hover:bg-earth-300 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.9)] transition-all">
                        Start Free Trial
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-white border-t-2 border-earth-700">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center opacity-60">
                    <div className="font-display font-bold text-xl mb-4 md:mb-0">
                        NEET<span className="text-earth-500">Prep</span>
                    </div>
                    <div className="text-sm text-earth-700">
                        &copy; 2025 NeetPrep AI. All rights reserved.
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
