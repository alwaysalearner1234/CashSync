import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const parseInvoiceText = (text) => api.post('/invoices/parse-text', { text });
export const createInvoice = (data) => api.post('/invoices/create', data);
export const fetchInvoices = () => api.get('/invoices');
export const fetchStats = () => api.get('/invoices/stats');
export const mockPay = (id) => api.post(`/payments/mock-pay/${id}`);

export default api;
