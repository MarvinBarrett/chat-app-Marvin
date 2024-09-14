import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const getCsrfToken = async () => {
    try {
      const response = await fetch('https://chatify-api.up.railway.app/csrf', {
        method: 'PATCH',
        credentials: 'include',
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token');
      }
  
      const data = await response.json();
      if (!data.csrfToken) {
        throw new Error('CSRF token not found');
      }
  
      return data.csrfToken;
    } catch (error) {
      console.error('Failed to fetch CSRF token', error);
      return null;
    }
  };
  

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
  
    try {
      const csrfToken = await getCsrfToken();
  
      const response = await fetch('https://chatify-api.up.railway.app/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify({ username, email, password }),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(`Network response was not ok: ${errorText}`);
      }
  
      const data = await response.json();
  
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      setError('Username or email is already being used');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      <form onSubmit={registerUser}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">Registration successful! Redirecting to login...</p>}
    </div>
  );
};

export default Register;
