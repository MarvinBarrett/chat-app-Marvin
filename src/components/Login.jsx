import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles/Login.css';
const Login = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 

    try {
      const response = await fetch('https://chatify-api.up.railway.app/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        try {
          const errorData = await response.json();
          console.log('Error data from API:', errorData);

          if (errorData.error) {
            setError(errorData.error);
          } else {
            setError('Unknown error occurred.'); 
          }
        } catch (jsonError) {
          const errorText = await response.text();
          console.log('Error text from API:', errorText);
          setError(errorText || 'An error occurred.'); 
        }
        return;
      }

      const text = await response.text();
      const data = JSON.parse(text);

      const decodedToken = jwtDecode(data.token);

      const userId = decodedToken.id;
      const userName = decodedToken.user;
      const avatar = `https://i.pravatar.cc/200?u=${userId}`;

      sessionStorage.setItem('token', data.token);
      sessionStorage.setItem('userId', userId);
      sessionStorage.setItem('username', userName);
      sessionStorage.setItem('avatar', avatar);
      const user = {
        username: userName,
        id: userId,
        avatar: avatar,
      };
      setUser(user);
      navigate('/chat');
    } catch (error) {
      setError('An unexpected error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin}>
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
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
