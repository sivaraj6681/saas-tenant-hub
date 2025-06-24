// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Default path redirects to /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route
          path="/login"
          element={
            <div className="bg-dark text-white min-vh-100">
              <Login />
            </div>
          }
        />
        <Route
          path="/register"
          element={
            <div className="bg-dark text-white min-vh-100">
              <Register />
            </div>
          }
        />
        <Route
          path="/dashboard"
          element={
            <div className="bg-dark text-white min-vh-100">
              <Dashboard />
            </div>
          }
        />
        <Route
          path="/clients"
          element={
            <div className="bg-dark text-white min-vh-100">
              <ClientManagement />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
