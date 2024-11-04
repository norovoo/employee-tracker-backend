import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import config from '../config';
import './Register.css'; // Assuming CSS file exists for styling

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const navigate = useNavigate();

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    // if (!captchaToken) {
    //   setError('Please complete the CAPTCHA.');
    //   return;
    // }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await axios.post(`${config.BASE_URL}/api/auth/register`, {
        name, email, password, captcha: captchaToken
      });
      setMessage('User registered successfully!');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (error) {
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Create New Technician</h2>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Name"
        className="register-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      {/* Email Input */}
      <input
        type="email"
        placeholder="Email"
        className="register-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {/* Password Input */}
      <input
        type="password"
        placeholder="Password"
        className="register-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {/* reCAPTCHA
      <ReCAPTCHA
        sitekey="6LdDV2sqAAAAABSewA6NCRqRwIm_1qJhIE0JX5V6" // Use your site key here
        onChange={handleCaptchaChange}
        className="recaptcha"
      /> */}

      {/* Register Button */}
      <button onClick={handleRegister} disabled={loading} className="register-button">
        {loading ? 'Registering...' : 'Register'}
      </button>

      {/* Success or Error Message */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Register;