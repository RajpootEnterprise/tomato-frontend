import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../../api/orders';
import { useAuth } from '../../context/AuthContext';
import './OrdersPage.css';

const STATUS_COLORS = {
  PLACED:    { bg: 'rgba(255,167,38,0.1)', color: '#e65100' },
  PREPARING: { bg: 'rgba(33,150,243,0.1)', color: '#0d47a1' },
  ON_THE_WAY:{ bg: 'rgba(156,39,176,0.1)', color: '#6a1b9a' },
  DELIVERED: { bg: 'rgba(76,175,80,0.1)',  color: '#2e7d32' },
  CANCELLED: { bg: 'rgba(244,67,54,0.1)',  color: '#b71c1c' },
};

export default function OrdersPage({ onLoginRequired }) {
  const { isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    const load = async () => {
      try {
        const res = await getOrders();
        const body = res.data;
        if (body.success) {
          // Most recent first
          setOrders((body.data ?? []).slice().reverse());
        } else {
          setError(body.message);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <main className="orders-page">
        <div className="container">
          <div className="orders-empty">
            <span className="empty-icon">🔐</span>
            <h2>Please Login</h2>
            <p>You need to be logged in to view your orders.</p>
            <button className="btn-primary" onClick={onLoginRequired}>Login / Sign Up</button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="orders-page">
      <div className="container">
        <h1 className="orders-title">My Orders</h1>

        {loading && (
          <div className="orders-loading">
            <div className="spinner" />
          </div>
        )}

        {!loading && error && (
          <div className="orders-empty">
            <span className="empty-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="orders-empty">
            <span className="empty-icon">📋</span>
            <h2>No orders yet</h2>
            <p>You haven't placed any orders. Go ahead and explore the menu!</p>
            <Link to="/menu" className="btn-primary">Browse Menu</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="orders-list">
            {orders.map((order) => {
              const style = STATUS_COLORS[order.status] ?? STATUS_COLORS.PLACED;
              return (
                <article key={order.id} className="order-card">
                  <div className="order-card-header">
                    <div>
                      <p className="order-id">Order #{order.id?.slice(-8)?.toUpperCase()}</p>
                      <p className="order-date">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleString()
                          : '—'}
                      </p>
                    </div>
                    <span
                      className="order-status"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="order-items">
                    {(order.items ?? []).map((item, idx) => (
                      <div key={idx} className="order-item-row">
                        <span className="order-item-name">{item.menuItemName}</span>
                        <span className="order-item-qty">× {item.quantity}</span>
                        <span className="order-item-price">
                          ${(item.price * item.quantity)?.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-total-label">Total Paid</span>
                    <span className="order-total-value">
                      ${order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
