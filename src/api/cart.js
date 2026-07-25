import client from './client';

export const getCart = () => client.get('/cart');
export const getCartTotal = () => client.get('/cart/total');
export const addToCart = (menuItemId, quantity = 1) =>
  client.post('/cart', { menuItemId, quantity });
export const updateCartItem = (cartItemId, quantity) =>
  client.patch(`/cart/${cartItemId}`, { quantity });
export const removeCartItem = (cartItemId) =>
  client.delete(`/cart/${cartItemId}`);
export const clearCart = () => client.delete('/cart');
