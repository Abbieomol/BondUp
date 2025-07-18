import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage"; 
import Dashboard from "./pages/Dashboard";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/ProfilePage";
import Notifications from "./pages/Notifications";
import type { User } from "./types/types";
import "./styles/App.css";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("accessToken");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/signup";
  };

  return (
    <Router>
      <div className="appcontainer">
        <Routes>
          <Route
            path="/"
            element={
              user ? <Navigate to="/dashboard" replace /> : <LoginPage setUser={setUser} />
            }
          />

          '
          '
          <Route
            path="/signup"
            element={<SignupPage />}
          />

          <Route
            path="/login"
            element={
              user ? (
                <Dashboard user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              user ? (
                <Dashboard user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/create-post"
            element={
              user ? (
                <CreatePost user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              user ? (
                <Profile user={user} handleLogout={handleLogout} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              user ? (
                <Notifications user={user} onLogout={handleLogout} />
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
