import React from 'react';
import { NavLink } from 'react-router-dom';
import { Dna, LineChart, Calendar, GraduationCap, Settings } from 'lucide-react';

const Sidebar = () => {
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
                        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LineChart size={20} /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Calendar size={20} /> Study Plan
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <GraduationCap size={20} /> Adaptive Quiz
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Settings size={20} /> Settings
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="mobile-nav">
                <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <LineChart size={24} />
                </NavLink>
                <NavLink to="/plan" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <Calendar size={24} />
                </NavLink>
                <NavLink to="/quiz" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                    <GraduationCap size={24} />
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
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
