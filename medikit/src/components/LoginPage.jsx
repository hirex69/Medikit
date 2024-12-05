import React, { useState } from 'react';
import { loginUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../index.css';  // Import the global CSS

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const data = await loginUser(email, password);
      console.log(data);  // Check the response (token and role)
  
      // Store JWT token in localStorage
      localStorage.setItem('token', data.token);
  
      // Check if the user is an admin or not from the response (role is included now)
      if (data.role === 'admin') {
        console.log('Admin login successful');
        navigate('/admindashboard');  // Redirect to admin dashboard
      } else {
        console.log('User login successful');
        navigate('/admin');  // Redirect to user-specific page
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      console.error('Login failed:', err);  // Log any error that occurs
      navigate('/register');  // Optionally redirect to registration page if login fails
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      <p>
        Don't have an account? <a href="/register">Register here</a>
      </p>
    </div>
  );
};

export default LoginPage;
