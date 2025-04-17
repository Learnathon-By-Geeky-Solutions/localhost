import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import { useAuthStore } from "./store/useAuthStore";
import ProtectedLayout from "./components/ProtectedLayout";
import RecoverPage from "./pages/RecoverPage";
import SignupPage from "./pages/SignupPage";
import BufferPage from "./pages/BufferPage";
import Courses from "./pages/Courses";
import Planner from "./pages/Planner";
import Settings from "./pages/Settings";
import Studyzone from "./pages/StudyzonePage";
import Entry from "./pages/Entry";
import Chapters from "./pages/Chapters";
import RouteTracker from "./components/RouteTracker";

const App = () => {
  const { isCheckingAuth, user, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  useEffect(() => {
    localStorage.setItem(`hasSeenWelcome`, false);

  }, [])

  if (isCheckingAuth) return <BufferPage />;



  return (
    <Router>
      <RouteTracker />
      <Routes>
        <Route
          path="/"
          element={<Navigate to={user ? localStorage.getItem("lastPath") || "/dashboard" : "/login"} />}
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
          element={user ? <Navigate to="/dashboard" /> : <RecoverPage />}
        />

        <Route
          path="/entry"
          element={
            user ? (
              <ProtectedLayout>
                <Entry />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            user ? (
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/courses"
          element={
            user ? (
              <ProtectedLayout>
                <Courses />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/planner"
          element={
            user ? (
              <ProtectedLayout>
                <Planner />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/studyzone"
          element={
            user ? (
              <ProtectedLayout>
                <Studyzone />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        <Route
          path="/courses/:id"
          element={
            user ? (
              <ProtectedLayout>
                <Chapters />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* <Route
          path="/chapter/:id"
          element={
            user ? (
              <ProtectedLayout>
                <ChapterDetails />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        /> */}

        <Route
          path="/settings"
          element={
            user ? (
              <ProtectedLayout>
                <Settings />
              </ProtectedLayout>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
