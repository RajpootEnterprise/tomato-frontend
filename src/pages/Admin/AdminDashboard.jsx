import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAdminStats, getAllOrdersAdmin, updateOrderStatusAdmin } from '../../api/orders';
import toast from 'react-hot-toast';
import './AdminDashboard.css';

const STATUS_OPTIONS = ['PLACED', 'PREPARING', 'ON_THE_WAY', 'DELIVERED', 'CANCELLED'];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'ADMIN';

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, ordersRes] = await Promise.all([
        getAdminStats(),
        getAllOrdersAdmin()
      ]);
      if (statsRes.data?.success) setStats(statsRes.data.data);
      if (ordersRes.data?.success) setOrders(ordersRes.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateOrderStatusAdmin(orderId, newStatus);
      if (res.data?.success) {
        toast.success(`Order status updated to ${newStatus}`);
        // Update local list
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        // Refresh stats
        const statsRes = await getAdminStats();
        if (statsRes.data?.success) setStats(statsRes.data.data);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (!isAdmin) {
    return (
      <main className="admin-page-denied">
        <div className="container">
          <div className="denied-card">
            <span className="denied-icon">🚫</span>
            <h2>Access Denied</h2>
            <p>You must be signed in as an administrator to access the shop management panel.</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <div className="container animate-slide-up">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Shop Manager Dashboard</h1>
            <p className="admin-subtitle">Monitor live orders, revenue metrics, and user status.</p>
          </div>
          <button className="btn-outline refresh-btn" onClick={loadData} disabled={loading}>
            🔄 Refresh Live Data
          </button>
        </div>

        {loading && (
          <div className="admin-loading">
            <div className="spinner" />
          </div>
        )}

        {!loading && stats && (
          <>
            {/* Stats Cards Grid */}
            <div className="stats-grid">
              <div className="stat-card revenue">
                <div className="stat-card-left">
                  <span className="stat-card-emoji">💰</span>
                  <span className="stat-card-label">Total Revenue</span>
                  <h2 className="stat-card-value">${stats.totalRevenue?.toFixed(2)}</h2>
                </div>
                <div className="stat-card-glow" />
              </div>

              <div className="stat-card orders">
                <div className="stat-card-left">
                  <span className="stat-card-emoji">📋</span>
                  <span className="stat-card-label">Total Orders</span>
                  <h2 className="stat-card-value">{stats.totalOrders}</h2>
                </div>
                <div className="stat-card-glow" />
              </div>

              <div className="stat-card users">
                <div className="stat-card-left">
                  <span className="stat-card-emoji">👥</span>
                  <span className="stat-card-label">Registered Users</span>
                  <h2 className="stat-card-value">{stats.totalUsers}</h2>
                </div>
                <div className="stat-card-glow" />
              </div>
            </div>

            {/* Status Breakdown Section */}
            <div className="admin-card breakdown-card">
              <h2 className="card-title">Order Status Breakdown</h2>
              <div className="breakdown-bars">
                {Object.entries(stats.ordersByStatus ?? {}).map(([status, count]) => {
                  const percent = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
                  return (
                    <div key={status} className="breakdown-row">
                      <div className="breakdown-labels">
                        <span className={`status-badge status-${status.toLowerCase()}`}>{status}</span>
                        <span className="breakdown-count">{count} {count === 1 ? 'order' : 'orders'} ({percent.toFixed(0)}%)</span>
                      </div>
                      <div className="breakdown-bar-track">
                        <div 
                          className={`breakdown-bar-fill fill-${status.toLowerCase()}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Orders Table */}
            <div className="admin-card table-card">
              <h2 className="card-title">Live Client Orders</h2>
              <div className="orders-table-wrapper">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date / Time</th>
                      <th>Customer Email</th>
                      <th>Ordered Items</th>
                      <th>Total Amount</th>
                      <th>Status Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="no-orders-msg">No orders placed yet.</td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td className="col-id">#{order.id?.slice(-8)?.toUpperCase()}</td>
                          <td className="col-date">
                            {order.createdAt ? new Date(order.createdAt).toLocaleString() : '—'}
                          </td>
                          <td className="col-user">{order.email || order.userId || 'Guest'}</td>
                          <td className="col-items">
                            <div className="order-items-list">
                              {(order.items ?? []).map((item, idx) => (
                                <div key={idx} className="order-item-inline">
                                  • {item.menuItemName} <span className="qty-tag">×{item.quantity}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="col-total">${order.totalAmount?.toFixed(2)}</td>
                          <td className="col-action">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value)}
                              className={`status-select select-${order.status?.toLowerCase()}`}
                            >
                              {STATUS_OPTIONS.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
