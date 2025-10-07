import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import Login from "./components/Login";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem('jwt_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      // Decode JWT to get user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ id: payload.sub, login: payload.login });
      } catch (error) {
        console.error('Invalid token:', error);
        logout();
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={
              token ? <Navigate to="/profile" replace /> : 
              <Login onLogin={login} />
            } 
          />
          <Route 
            path="/profile" 
            element={
              token ? <Profile user={user} onLogout={logout} /> : 
              <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to={token ? "/profile" : "/login"} replace />} 
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;