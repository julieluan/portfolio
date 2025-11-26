// src/App.jsx - 状态控制器
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './StartPage';
import MainPage from './MainPage';
import AboutPage from './pages/AboutPage';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <Routes>
      <Route path="/start" element={<StartPage />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/projects/:slug" element={<ProjectPage />} />
      <Route path="/" element={<Navigate to="/start" replace />} />
      <Route path="*" element={<Navigate to="/start" replace />} />
    </Routes>
  );
}

export default App;