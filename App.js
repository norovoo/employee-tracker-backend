import React, { useState, useEffect } from 'react';
import './App.css'; 
import Dashboard from './components/Dashboard';
import Orders from './components/Orders';
import Schedule from './components/Schedule';
import Measurements from './components/MeasurementList';
import Login from './components/Login';
import ScheduleList from './components/ScheduleList';
import Invoice from './components/Invoices'; // Import the Invoice component
import QuickBooksIntegration from './components/QuickBooksIntegration';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); 
  const [token, setToken] = useState(null);  
  const [username, setUsername] = useState('');  

  console.log("Checking local storage before useEffect:"); // Debugging log outside useEffect
  console.log("authToken in localStorage:", localStorage.getItem('authToken'));
  console.log("username in localStorage:", localStorage.getItem('username'));

  useEffect(() => {
    console.log("useEffect running..."); // New log to ensure useEffect runs

    const savedToken = localStorage.getItem('authToken');
    const savedUsername = localStorage.getItem('username');
    
    console.log("Saved token:", savedToken);  // Debugging log
    console.log("Saved username:", savedUsername);  // Debugging log

    if (savedToken && savedUsername) {
      setIsAuthenticated(true);
      setToken(savedToken);
      setUsername(savedUsername);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLoginSuccess = (token, username) => {
    console.log('Login successful:', { token, username }); // Debugging log

    setIsAuthenticated(true);
    setToken(token);
    setUsername(username);
    localStorage.setItem('authToken', token);
    localStorage.setItem('username', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setUsername('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated && token ? (
              <Dashboard token={token} username={username} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard/orders"
          element={
            isAuthenticated && token ? (
              <Orders token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard/schedule"
          element={
            isAuthenticated && token ? (
              <ScheduleList /> // or <Schedule />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard/measurements"
          element={
            isAuthenticated && token ? (
              <Measurements token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/dashboard/invoices" // New route for Invoice
          element={
            isAuthenticated && token ? (
              <Invoice token={token} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/dashboard/quickbooks-integration" element={<QuickBooksIntegration />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;