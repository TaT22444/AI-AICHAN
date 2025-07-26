import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import ChatScreen from './components/ChatScreen';
import SummaryScreen from './components/SummaryScreen';
import { LearningSession } from './types';

function App() {
  const [currentSession, setCurrentSession] = useState<LearningSession | null>(null);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={
              <StartScreen 
                onStartSession={(session) => setCurrentSession(session)} 
              />
            } 
          />
          <Route 
            path="/chat" 
            element={
              currentSession ? (
                <ChatScreen 
                  session={currentSession}
                  onUpdateSession={setCurrentSession}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/summary" 
            element={
              currentSession ? (
                <SummaryScreen 
                  session={currentSession}
                  onReset={() => setCurrentSession(null)}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 