import api from './api';

const ENDPOINT = '/Dashboard';

/**
 * Get dashboard data
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboard = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Get pending orders
 * @returns {Promise<Array>} List of pending orders
 */
export const getPendingOrders = async () => {
  const response = await api.get(`${ENDPOINT}/pending-orders`);
  return response.data;
};

/**
 * Refresh dashboard data
 * @returns {Promise<Object>} Updated dashboard statistics
 */
export const refreshDashboard = async () => {
  return await getDashboard();
};