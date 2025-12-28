import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import StudyPlan from './components/study-plan/StudyPlan';
import Quiz from './components/quiz/Quiz';
import Settings from './components/settings/Settings';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/plan" element={<StudyPlan />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </Layout>
        </Router>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
