import client from './client';

export const sendContact = (data) => client.post('/contact', data);
