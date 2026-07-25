import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import './FloatingCart.css';

export default function FloatingCart() {
  const { cartCount, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // Don't show if user is not logged in, has empty cart, or is already on the cart page
  if (!isLoggedIn || cartCount === 0 || location.pathname === '/cart' || location.pathname === '/admin') {
    return null;
  }

  return (
    <div className="floating-cart-container">
      <Link to="/cart" className="floating-cart-bar" id="floating-cart-bar-btn">
        <div className="floating-cart-left">
          <span className="cart-icon">🛒</span>
          <span className="cart-badge-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
          <span className="cart-divider">|</span>
          <span className="cart-amount-total">${cartTotal?.toFixed(2)}</span>
        </div>
        <div className="floating-cart-right">
          <span>View Cart</span>
          <span className="cart-arrow">→</span>
        </div>
      </Link>
    </div>
  );
}
