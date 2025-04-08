import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/useAuthStore';

import styles from './app.module.css';

const App = () => {
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth(); 
  }, [checkAuth]);

  return (
    
      <Router>
        <Routes>
          <Route 
            path="/"
            element={<Navigate to="/dashboard" /> }
          />
          <Route
            path="/login"
            element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
          />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <Navigate to="/login" />}
          />
          {/* Add other routes here */}
        </Routes>
      </Router>
    
  );
};

export default App;
