import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

import { login } from '../services/auth.service';

const LoginPage = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(formData.usernameOrEmail, formData.password);
    if (success) {
      alert('Login successful!');
    }
  };

  return (
    <Layout>
      <div className="main-inner">
        <div className="card">
          <div className="card-accent" />
          <div className="card-logo">MP</div>

          <h2>Welcome back</h2>
          <p className="lead">Sign in to your Meal Planner account</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="usernameOrEmail">Email</label>
              <input id="usernameOrEmail" name="usernameOrEmail" className="input" value={formData.usernameOrEmail} onChange={handleChange} placeholder="user@example.com" required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input id="password" name="password" type="password" className="input" value={formData.password} onChange={handleChange} placeholder="Enter your password" required />
            </div>

            <button type="submit" className="btn">Sign in</button>
          </form>

          <p className="helper">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;