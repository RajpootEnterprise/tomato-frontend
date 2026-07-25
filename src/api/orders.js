import client from './client';

export const placeOrder = () => client.post('/orders');
export const getOrders = () => client.get('/orders');
export const getOrder = (orderId) => client.get(`/orders/${orderId}`);
export const getAllOrdersAdmin = () => client.get('/orders/admin');
export const updateOrderStatusAdmin = (orderId, status) => client.patch(`/orders/${orderId}/status`, { status });
export const getAdminStats = () => client.get('/admin/stats');
