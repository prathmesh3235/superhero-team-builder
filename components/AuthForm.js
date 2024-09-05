import React, { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('/api/auth', {
        action: isLogin ? 'login' : 'register',
        username,
        password
      });
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        onLogin();
      } else {
        setIsLogin(true);
        setUsername(''); // Clear username on successful registration
        setPassword(''); // Clear password on successful registration
      }
    } catch (error) {
      console.error('Error during form submission:', error); // Log for debugging
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      <button type="button" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </form>
  );
};

export default AuthForm;
