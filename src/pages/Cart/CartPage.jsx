import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../api/orders';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '../../components/StripePaymentForm/StripePaymentForm';
import toast from 'react-hot-toast';
import './CartPage.css';

const stripePromise = loadStripe('pk_test_51PqOsgRxVlY5mX9By68mX9By68mX9By68mX9By68mX9By68mX9By68mX9By68mX9By68mX9By68mX9By');

export default function CartPage({ onLoginRequired }) {
  const { isLoggedIn } = useAuth();
  const { cartItems, cartTotal, loading, updateItem, removeItem, clearCartState, fetchCart } = useCart();
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe'); // 'stripe' | 'cod'
  const [showStripe, setShowStripe] = useState(false);
  const navigate = useNavigate();

  if (!isLoggedIn) {
    return (
      <main className="cart-page">
        <div className="container">
          <div className="cart-empty-login">
            <span className="empty-icon">🔐</span>
            <h2>Please Login</h2>
            <p>You need to be logged in to view your cart.</p>
            <button className="btn-primary" onClick={onLoginRequired}>Login / Sign Up</button>
          </div>
        </div>
      </main>
    );
  }

  const handleDecrement = async (item) => {
    const newQty = item.quantity - 1;
    try {
      await updateItem(item.id, newQty);
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleIncrement = async (item) => {
    try {
      await updateItem(item.id, item.quantity + 1);
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeItem(item.id);
      toast.success(`${item.menuItemName} removed`);
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }
    if (paymentMethod === 'stripe') {
      setShowStripe(true);
      return;
    }
    // COD Flow
    setPlacing(true);
    try {
      const res = await placeOrder();
      const body = res.data;
      if (body.success) {
        await fetchCart(); // Refresh (cart will be empty after order)
        toast.success('🎉 Order placed successfully (COD)!');
        navigate('/orders');
      } else {
        toast.error(body.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId) => {
    setPlacing(true);
    try {
      const res = await placeOrder(); // Creates order in MongoDB and empties cart
      const body = res.data;
      if (body.success) {
        await fetchCart();
        toast.success('🎉 Order placed and paid successfully!');
        navigate('/orders');
      } else {
        toast.error(body.message);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place order';
      toast.error(msg);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="cart-page">
      <div className="container">
        <h1 className="cart-title">Your Cart</h1>

        {loading && (
          <div className="cart-loading">
            <div className="spinner" />
          </div>
        )}

        {!loading && cartItems.length === 0 && (
          <div className="cart-empty">
            <span className="empty-icon">🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add some delicious dishes from our menu!</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        )}

        {!loading && cartItems.length > 0 && (
          <div className="cart-layout animate-slide-up">
            {/* Items list */}
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-info">
                    <h3 className="cart-item-name">{item.menuItemName}</h3>
                    <p className="cart-item-price">${item.price?.toFixed(2)} each</p>
                  </div>
                  <div className="cart-item-right">
                    <div className="stepper">
                      <button
                        className="stepper-btn"
                        onClick={() => handleDecrement(item)}
                        aria-label="Decrease"
                        id={`cart-dec-${item.id}`}
                      >
                        −
                      </button>
                      <span className="stepper-qty">{item.quantity}</span>
                      <button
                        className="stepper-btn"
                        onClick={() => handleIncrement(item)}
                        aria-label="Increase"
                        id={`cart-inc-${item.id}`}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-item-subtotal">
                      ${(item.price * item.quantity)?.toFixed(2)}
                    </p>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item)}
                      aria-label={`Remove ${item.menuItemName}`}
                    >
                      <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <div className="cart-summary-card">
                <h2 className="summary-title">Order Summary</h2>
                <div className="summary-rows">
                  {cartItems.map((item) => (
                    <div key={item.id} className="summary-row">
                      <span>{item.menuItemName} × {item.quantity}</span>
                      <span>${(item.price * item.quantity)?.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span className="total-amount">${cartTotal?.toFixed(2)}</span>
                </div>
                <div className="summary-row summary-delivery">
                  <span>Delivery</span>
                  <span className="free-tag">FREE</span>
                </div>

                <div className="payment-method-container">
                  <span className="payment-method-title">Payment Method</span>
                  <div className="payment-method-options">
                    <label className={`payment-option-label ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => { setPaymentMethod('stripe'); setShowStripe(false); }}
                      />
                      💳 Card Payment (Stripe)
                    </label>
                    <label className={`payment-option-label ${paymentMethod === 'cod' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => { setPaymentMethod('cod'); setShowStripe(false); }}
                      />
                      💵 Cash on Delivery
                    </label>
                  </div>
                </div>

                {!showStripe ? (
                  <button
                    className="btn-primary place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={placing}
                    id="place-order-btn"
                  >
                    {placing ? (
                      <>
                        <span className="spinner-sm" />
                        Placing Order…
                      </>
                    ) : (
                      paymentMethod === 'stripe' ? (
                        <>💳 Proceed to Pay · ${cartTotal?.toFixed(2)}</>
                      ) : (
                        <>🎉 Place COD Order · ${cartTotal?.toFixed(2)}</>
                      )
                    )}
                  </button>
                ) : (
                  <Elements stripe={stripePromise}>
                    <StripePaymentForm
                      amount={cartTotal}
                      onSuccess={handlePaymentSuccess}
                      onCancel={() => setShowStripe(false)}
                    />
                  </Elements>
                )}

                <Link to="/menu" className="continue-shopping">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
