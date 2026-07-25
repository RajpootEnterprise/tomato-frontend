import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import AuthModal from './components/AuthModal/AuthModal';
import HomePage from './pages/Home/HomePage';
import MenuPage from './pages/Menu/MenuPage';
import CartPage from './pages/Cart/CartPage';
import OrdersPage from './pages/Orders/OrdersPage';
import ContactPage from './pages/Contact/ContactPage';
import MobileAppPage from './pages/MobileApp/MobileAppPage';
import './index.css';
import './App.css';

function App() {
  const [authOpen, setAuthOpen] = useState(false);

  const openAuth = () => setAuthOpen(true);
  const closeAuth = () => setAuthOpen(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app-wrapper">
            <Navbar onLoginClick={openAuth} />

            <Routes>
              <Route path="/" element={<HomePage onLoginRequired={openAuth} />} />
              <Route path="/menu" element={<MenuPage onLoginRequired={openAuth} />} />
              <Route path="/cart" element={<CartPage onLoginRequired={openAuth} />} />
              <Route path="/orders" element={<OrdersPage onLoginRequired={openAuth} />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/mobile-app" element={<MobileAppPage />} />
              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            <Footer />
          </div>

          {authOpen && <AuthModal onClose={closeAuth} />}

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                fontFamily: 'Outfit, sans-serif',
                borderRadius: '12px',
                background: '#fff',
                color: '#2d2d2d',
                boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                fontSize: '0.9rem',
              },
              success: {
                iconTheme: { primary: '#ff6b35', secondary: '#fff' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

function NotFound() {
  return (
    <main
      style={{
        minHeight: 'calc(100vh - 70px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        textAlign: 'center',
        padding: '40px 24px',
      }}
    >
      <span style={{ fontSize: '5rem' }}>🍅</span>
      <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        Looks like this page went off the menu.
      </p>
      <a href="/" className="btn-primary" style={{ textDecoration: 'none' }}>
        Back to Home
      </a>
    </main>
  );
}

export default App;
