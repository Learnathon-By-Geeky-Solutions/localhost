import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import { useAuthStore } from './store/useAuthStore';
import ProtectedLayout from './components/ProtectedLayout';
import RecoverPage from './pages/RecoverPage';
import SignupPage from './pages/SignupPage';

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
          element={<Navigate to={user ? "/dashboard" : "/login"} />}
        />

        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" /> : <LoginPage />}
        />

        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" /> : <SignupPage />}
        />
        <Route
          path="/recover"
          element={user ? <Navigate to="/dashboard" /> : <RecoverPage/>}
        />

        <Route
          path="/dashboard"
          element={
            user ?
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
              :
              <Navigate to="/" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
