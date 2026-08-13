import api from './api';

const ENDPOINT = '/User';

/**
 * Get all users (admin)
 * @returns {Promise<Array>} List of users
 */
export const getUsers = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Create a new user (admin)
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user
 */
export const createUser = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

/**
 * Update an existing user (admin)
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user
 */
export const updateUser = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Delete a user (admin)
 * @param {number} id - User ID
 * @returns {Promise<void>}
 */
export const deleteUser = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};