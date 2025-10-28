import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/auth.service';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }

    const success = await register(form.name, form.email, form.password);

    if (success) {
      alert('You successly created your account! Go back to the login page to sign in');
      navigate('/login');
    }
  };

  return (
    <Layout>
      <div className="main-inner">
        <div className="card">
          <div className="card-accent" />
          <div className="card-logo">MP</div>

          <h2>Create account</h2>
          <p className="lead">Join Meal Planner — plan healthier meals in minutes</p>

          {error && <div className="error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input name="name" value={form.name} onChange={handleChange} className="input" placeholder="Jane Doe" required />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} className="input" placeholder="you@example.com" required />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} className="input" placeholder="Create a password" required />
            </div>

            <div className="form-group">
              <label>Confirm password</label>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} className="input" placeholder="Confirm password" required />
            </div>

            <button type="submit" className="btn">Create account</button>
          </form>

          <p className="helper">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;