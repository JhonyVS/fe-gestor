import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import HomePage from './pages/HomePage';
import BoardsPage from './pages/BoardsPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamsPage from './pages/TeamsPage';
import StaffPage from './pages/StaffPage';
import NotFoundPage from './pages/NotFoundPage';
import Top from './components/Header/Top';
import Menu from './components/Header/Menu';
import './styles/App.css';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showHeaderAndMenu = location.pathname !== '/';

  return (
    <>
      {showHeaderAndMenu && <Top />}
      {showHeaderAndMenu && <Menu />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/boards" element={<BoardsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
