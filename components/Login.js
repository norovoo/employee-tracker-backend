import React, { useState, useRef, useEffect } from 'react';
import './Login.css'; 
import axios from 'axios';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo.png';  // Import the logo image

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://192.168.254.86:3000/api/auth/login', { email, password });
      const token = response.data.token;
      const username = response.data.username; // Get the username from the response

      if (isMountedRef.current) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', username); // Store username
        onLoginSuccess(token, username); // Pass both token and username to the parent
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="login-container">
      {/* Display the logo */}
      <img src={Logo} alt="Logo" width={200} className="login-container" /> 

      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        className="login-input"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="login-input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="login-button" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="login-links">
        <Link to="/forgot-password">Forgot Password?</Link>
        <Link to="/create-account">Create New Account</Link>
      </div>
    </div>
  );
};

export default Login;