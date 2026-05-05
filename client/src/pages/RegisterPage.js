import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <Link to="/" className="auth-logo-link">
            <span className="logo-go">GO.</span>
            <span className="logo-compare">COMPARE</span>
          </Link>
        </div>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start comparing quotes and saving money today.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First name</label>
              <input type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="John" required autoComplete="given-name" />
            </div>
            <div className="form-group">
              <label>Last name</label>
              <input type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Smith" required autoComplete="family-name" />
            </div>
          </div>
          <div className="form-group">
            <label>Email address</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" required autoComplete="email" />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" required autoComplete="new-password" />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="Repeat your password" required autoComplete="new-password" />
          </div>
          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
