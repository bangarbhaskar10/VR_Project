import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import WelcomePage from './pages/WelcomePage.jsx';
import LearningHub from './pages/LearningHub.jsx';
import ModulePage from './pages/ModulePage.jsx';
import TestPage from './pages/TestPage.jsx';
import ParentDashboard from './pages/ParentDashboard.jsx';
import GamesHub from './pages/GamesHub.jsx';
import MemoryGame from './pages/games/MemoryGame.jsx';
import ListenGame from './pages/games/ListenGame.jsx';
import CountGame from './pages/games/CountGame.jsx';
import TraceGame from './pages/games/TraceGame.jsx';
import WorksheetHub from './pages/WorksheetHub.jsx';
import WorksheetPage from './pages/WorksheetPage.jsx';

/**
 * Root application component.
 * Wraps everything in AppProvider (global state) and sets up routes.
 */
function App() {
  return (
    <AppProvider>
      <div className="min-h-screen font-fun">
        <Routes>
          {/* Welcome / Home */}
          <Route path="/" element={<WelcomePage />} />

          {/* Learning Hub - module selector */}
          <Route path="/learn" element={<LearningHub />} />

          {/* Individual module pages - driven by :moduleId param */}
          <Route path="/learn/:moduleId" element={<ModulePage />} />

          {/* Test / game page */}
          <Route path="/test" element={<TestPage />} />
          <Route path="/test/:moduleId" element={<TestPage />} />

          {/* Parent dashboard */}
          <Route path="/parent" element={<ParentDashboard />} />

          {/* Games hub and individual games */}
          <Route path="/games" element={<GamesHub />} />
          <Route path="/games/memory" element={<MemoryGame />} />
          <Route path="/games/memory/:moduleId" element={<MemoryGame />} />
          <Route path="/games/listen" element={<ListenGame />} />
          <Route path="/games/listen/:moduleId" element={<ListenGame />} />
          <Route path="/games/count" element={<CountGame />} />
          <Route path="/games/trace" element={<TraceGame />} />

          {/* Worksheets */}
          <Route path="/worksheets" element={<WorksheetHub />} />
          <Route path="/worksheets/:sheetId" element={<WorksheetPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AppProvider>
  );
}

export default App;
