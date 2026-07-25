import client from './client';

export const getMenu = (category) =>
  client.get('/menu', { params: category ? { category } : undefined });

export const getMenuItem = (id) => client.get(`/menu/${id}`);
