import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { BookOpen, Target, BarChart2, CheckCircle, Play } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
    const { loginAsGuest } = useAuth();
    const navigate = useNavigate();

    const handleDemo = () => {
        loginAsGuest();
        navigate('/app');
    };

    return (
        <div className="landing-container">
            <nav className="landing-nav">
                <div className="nav-brand">
                    <BookOpen color="black" size={32} strokeWidth={2.5} />
                    <span>NeetPrep.ai</span>
                </div>
                <div className="nav-links">
                    <button onClick={handleDemo} className="btn-secondary">
                        Demo
                    </button>
                    <Link to="/login" className="btn-secondary">Login</Link>
                    <Link to="/signup" className="btn-primary">Get Started</Link>
                </div>
            </nav>

            <header className="hero-section">
                <h1 className="hero-title">
                    Crack NEET with <br />
                    <span>AI Intelligence</span>
                </h1>
                <p className="hero-subtitle">
                    No guessing. Pure data. Custom roadmaps.
                </p>
                <div className="cta-group">
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <button className="btn-large">Start Now</button>
                    </Link>
                    <button onClick={handleDemo} className="btn-large secondary" style={{ gap: '10px' }}>
                        <Play size={24} fill="black" /> Try Demo
                    </button>
                </div>
            </header>

            <section className="features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <Target size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="feature-title">AI Study Plans</h3>
                        <p className="feature-desc">Dynamic schedules that adapt to your pace and weak areas instantly.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="feature-title">Smart Quizzes</h3>
                        <p className="feature-desc">Practice from past papers and AI-generated questions targeting your gaps.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <BarChart2 size={32} strokeWidth={2.5} />
                        </div>
                        <h3 className="feature-title">Raw Analytics</h3>
                        <p className="feature-desc">Visual insights into your subject mastery, streak, and study hours.</p>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <p>© 2025 NeetPrep.ai. NO NONSENSE PREP.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
