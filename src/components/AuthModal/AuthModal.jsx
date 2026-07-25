import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { login as apiLogin, signup as apiSignup } from '../../api/auth';
import toast from 'react-hot-toast';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { fetchCart } = useCart();

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (mode === 'login') {
        res = await apiLogin({ email: form.email, password: form.password });
      } else {
        res = await apiSignup({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone,
        });
      }

      const body = res.data;
      if (body.success) {
        login(body.data);
        await fetchCart();
        toast.success(mode === 'login' ? `Welcome back, ${body.data.name}!` : `Account created! Welcome, ${body.data.name}!`);
        onClose();
      } else {
        toast.error(body.message || 'Something went wrong');
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED' ? 'Server is waking up, try again in a moment.' : 'Network error');
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="auth-modal" role="dialog" aria-modal="true">
        {/* Close button */}
        <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-logo">🍅</div>
          <h2 className="auth-title">{mode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
          <p className="auth-subtitle">
            {mode === 'login'
              ? 'Sign in to order your favourite food'
              : 'Join Tomato and start ordering today'}
          </p>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
            onClick={() => setMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-name">Full Name</label>
              <input
                id="auth-name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-email">Email</label>
            <input
              id="auth-email"
              name="email"
              type="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          {mode === 'signup' && (
            <div className="form-group">
              <label htmlFor="auth-phone">Phone</label>
              <input
                id="auth-phone"
                name="phone"
                type="tel"
                placeholder="9876543210"
                value={form.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="auth-password">Password</label>
            <input
              id="auth-password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            className="btn-primary auth-submit"
            disabled={loading}
            id="auth-submit-btn"
          >
            {loading ? (
              <>
                <span className="spinner-sm" />
                {mode === 'login' ? 'Signing in…' : 'Creating account…'}
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <p className="auth-switch">
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}
