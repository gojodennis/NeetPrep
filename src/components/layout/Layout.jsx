import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
            <style>{`
        .main-content {
            flex: 1;
            padding: 2rem;
            margin-left: 260px; /* Sidebar width */
            min-height: 100vh;
            background-color: var(--bg-light);
            overflow-y: auto;
        }

        @media (max-width: 768px) {
            .main-content {
                margin-left: 0;
                padding-bottom: 80px; /* Space for mobile nav */
            }
        }
      `}</style>
        </div>
    );
};

export default Layout;
