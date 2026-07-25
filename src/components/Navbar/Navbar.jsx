import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import './Navbar.css';

export default function Navbar({ onLoginClick }) {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Mobile App', href: '/mobile-app' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🍅</span>
          <span className="logo-text">Tomato.</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`navbar-link ${location.pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="navbar-actions">
          {/* Search */}
          <button
            className="icon-btn"
            aria-label="Search"
            onClick={() => navigate('/menu')}
            title="Search menu"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Cart */}
          <button
            className="icon-btn cart-btn"
            aria-label="Cart"
            onClick={() => navigate('/cart')}
            title="View cart"
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount > 99 ? '99+' : cartCount}</span>}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="profile-menu">
              <button
                className="profile-btn"
                onClick={() => setProfileOpen((o) => !o)}
                aria-label="Profile menu"
              >
                <div className="avatar">{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              </button>
              {profileOpen && (
                <div className="profile-dropdown">
                  <div className="profile-info">
                    <div className="avatar avatar-lg">{user?.name?.[0]?.toUpperCase() ?? 'U'}</div>
                    <div>
                      <p className="profile-name">{user?.name}</p>
                      <p className="profile-email">{user?.email}</p>
                    </div>
                  </div>
                  <div className="profile-divider" />
                  <Link to="/orders" className="profile-item" onClick={() => setProfileOpen(false)}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                    My Orders
                  </Link>
                  <button className="profile-item logout" onClick={handleLogout}>
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button className="btn-outline login-btn" onClick={onLoginClick} id="navbar-login-btn">
              Login
            </button>
          )}

          {/* Mobile hamburger */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`mobile-link ${location.pathname === link.href ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {!isLoggedIn && (
            <button
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', marginTop: 12 }}
              onClick={() => { setMenuOpen(false); onLoginClick(); }}
            >
              Login
            </button>
          )}
        </div>
      )}

      {/* Close profile dropdown on outside click */}
      {profileOpen && (
        <div className="profile-overlay" onClick={() => setProfileOpen(false)} />
      )}
    </header>
  );
}
