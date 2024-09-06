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
        setUsername('');
        setPassword('');
      }
    } catch (error) {
      console.error('Error during form submission:', error);
      setError(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 bg-opacity-80 p-8 rounded-xl shadow-2xl max-w-md mx-auto backdrop-filter backdrop-blur-lg">
      <h2 className="text-2xl font-bold text-blue-300 mb-6">{isLogin ? 'Login' : 'Register'}</h2>
      {error && <p className="bg-red-500 text-white p-3 rounded-lg mb-4">{error}</p>}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <div className="mb-6">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>
      <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:-translate-y-1">
        {isLogin ? 'Login' : 'Register'}
      </button>
      <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full mt-4 text-blue-400 hover:text-blue-300 transition duration-300">
        {isLogin ? 'Need to register?' : 'Already have an account?'}
      </button>
    </form>
  );
};

export default AuthForm;