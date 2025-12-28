import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Dna, LineChart, Calendar, GraduationCap, Settings, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut();
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    const isGuest = user?.id === 'guest_user';

    return (
        <>
            {/* Desktop Sidebar */}
            <nav className="sidebar">
                <div className="logo">
                    <Dna className="text-primary" size={24} />
                    <span>NEET Automation</span>
                </div>
                <ul className="nav-links desktop">
                    <li>
                        <NavLink to="/app" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LineChart size={20} /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/app/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Calendar size={20} /> Study Plan
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/app/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <GraduationCap size={20} /> Adaptive Quiz
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/app/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Settings size={20} /> Settings
                        </NavLink>
                    </li>
                    <li style={{ marginTop: 'auto' }}>
                        {isGuest ? (
                            <button onClick={() => navigate('/')} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem' }}>
                                <Home size={20} /> Go Back Home
                            </button>
                        ) : (
                            <button onClick={handleLogout} className="nav-item" style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', fontSize: '1rem' }}>
                                <LogOut size={20} /> Logout
                            </button>
                        )}
                    </li>
                </ul>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="mobile-nav">
                <NavLink to="/app" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LineChart size={24} />
                </NavLink>
                <NavLink to="/app/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={24} />
                </NavLink>
                <NavLink to="/app/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <GraduationCap size={24} />
                </NavLink>
                <NavLink to="/app/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Settings size={24} />
                </NavLink>
            </div>

            <style>{`
        .sidebar {
            width: 260px;
            background: var(--surface);
            border-right: 1px solid var(--border);
            display: flex;
            flex-direction: column;
            padding: 1.5rem;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
            z-index: 100;
        }

        .logo {
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--primary);
            margin-bottom: 2rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .nav-links {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            height: 100%; /* Fill height to push logout to bottom */
        }

        .nav-item {
            padding: 0.75rem 1rem;
            border-radius: var(--radius);
            cursor: pointer;
            color: var(--text-muted);
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
            transition: all 0.2s;
        }

        .nav-item:hover {
            background-color: #f0f7ff;
            color: var(--primary);
        }

        .nav-item.active {
            background-color: var(--primary);
            color: white;
        }

        .mobile-nav {
            display: none;
            position: fixed;
            bottom: 0; left: 0; right: 0;
            background: white;
            padding: 10px;
            justify-content: space-around;
            border-top: 1px solid var(--border);
            z-index: 100;
        }

        @media (max-width: 768px) {
            .sidebar { display: none; }
            .mobile-nav { display: flex; }
        }
      `}</style>
        </>
    );
};

export default Sidebar;
