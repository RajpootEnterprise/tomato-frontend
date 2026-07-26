import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import DecryptedText from '../DecryptedText/DecryptedText';
import './Navbar.css';

export default function Navbar({ onLoginClick, theme, toggleTheme }) {
  const { isLoggedIn, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const [hoveredRect, setHoveredRect] = useState(null);
  const [activeRect, setActiveRect] = useState(null);
  const navRef = useRef(null);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Menu', href: '/menu' },
    { label: 'Mobile App', href: '/mobile-app' },
    { label: 'Contact Us', href: '/contact' },
  ];
  if (isLoggedIn && user?.role === 'ADMIN') {
    navLinks.push({ label: 'Admin Panel', href: '/admin' });
  }

  // Update active pill position when path changes or on mount
  useEffect(() => {
    // Wait slightly to ensure styles are calculated correctly
    const timer = setTimeout(() => {
      const activeEl = navRef.current?.querySelector('.navbar-link.active');
      if (activeEl) {
        setActiveRect({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
        });
      } else {
        setActiveRect(null);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [location.pathname, navLinks.length]);

  const handleMouseEnterLink = (e) => {
    const el = e.currentTarget;
    setHoveredRect({
      left: el.offsetLeft,
      width: el.offsetWidth,
    });
  };

  const handleMouseLeaveNav = () => {
    setHoveredRect(null);
  };

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
          <DecryptedText 
            text="Tomato." 
            animateOn="hover" 
            speed={60} 
            maxIterations={12} 
            className="logo-text" 
            characters="TOMATO🍅01"
            useOriginalCharsOnly={false}
          />
        </Link>

        {/* Desktop nav links with sliding indicators */}
        <nav className="navbar-links" ref={navRef} onMouseLeave={handleMouseLeaveNav}>
          {/* Sliding Pill Indicator */}
          {(hoveredRect || activeRect) && (
            <div
              className="nav-sliding-pill"
              style={{
                transform: `translateX(${hoveredRect ? hoveredRect.left : activeRect ? activeRect.left : 0}px)`,
                width: `${hoveredRect ? hoveredRect.width : activeRect ? activeRect.width : 0}px`,
                opacity: hoveredRect || activeRect ? 1 : 0,
              }}
            />
          )}
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`navbar-link ${location.pathname === link.href ? 'active' : ''}`}
              onMouseEnter={handleMouseEnterLink}
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

          {/* Theme Toggle */}
          <button
            className="icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            id="theme-toggle-button"
          >
            {theme === 'light' ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            )}
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
                  {user?.role === 'ADMIN' && (
                    <Link to="/admin" className="profile-item admin-item" onClick={() => setProfileOpen(false)}>
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <line x1="9" y1="3" x2="9" y2="21" />
                        <line x1="9" y1="9" x2="21" y2="9" />
                        <line x1="9" y1="15" x2="21" y2="15" />
                      </svg>
                      Admin Dashboard
                    </Link>
                  )}
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
