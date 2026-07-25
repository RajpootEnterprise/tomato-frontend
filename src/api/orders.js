import client from './client';

export const placeOrder = () => client.post('/orders');
export const getOrders = () => client.get('/orders');
export const getOrder = (orderId) => client.get(`/orders/${orderId}`);
