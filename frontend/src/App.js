// App.js - Main app with routing and authentication

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import Login from "./components/Login";
import Profile from "./components/Profile";
import "./App.css";

function App() {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isValidating, setIsValidating] = useState(true);

  // Validate token on app startup
  useEffect(() => {
    const validateToken = async () => {
      const storedToken = localStorage.getItem('jwt_token');
      
      if (!storedToken) {
        setIsValidating(false);
        return;
      }

      try {
        // Decode JWT and check expiration
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp < currentTime) {
          toast.error('Session expired. Please login again.');
          logout();
          setIsValidating(false);
          return;
        }

        // Validate with API
        const response = await fetch('https://learn.01founders.co/api/graphql-engine/v1/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${storedToken}`
          },
          body: JSON.stringify({
            query: '{ user { id login } }'
          })
        });

        const result = await response.json();

        if (result.errors || !response.ok) {
          toast.error('Invalid session. Please login again.');
          logout();
        } else {
          setToken(storedToken);
          setUser({ id: payload.sub, login: payload.login });
        }
      } catch (error) {
        console.error('Token validation error:', error);
        toast.error('Session validation failed. Please login again.');
        logout();
      } finally {
        setIsValidating(false);
      }
    };

    validateToken();
  }, []);

  const login = (newToken) => {
    localStorage.setItem('jwt_token', newToken);
    setToken(newToken);
    
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setUser({ id: payload.sub, login: payload.login });
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    setToken(null);
    setUser(null);
  };

  // Loading screen while validating token
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
          <p className="text-slate-600">Validating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/login" 
            element={token ? <Navigate to="/profile" replace /> : <Login onLogin={login} />} 
          />
          <Route 
            path="/profile" 
            element={token ? <Profile user={user} onLogout={logout} /> : <Navigate to="/login" replace />} 
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
