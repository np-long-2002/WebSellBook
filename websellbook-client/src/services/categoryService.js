import api from './api';

const ENDPOINT = '/Category';

/**
 * Get all categories
 * @returns {Promise<Array>} List of categories
 */
export const getCategories = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Create a new category
 * @param {Object} categoryData - Category data
 * @returns {Promise<Object>} Created category
 */
export const createCategory = async (categoryData) => {
  const response = await api.post(ENDPOINT, categoryData);
  return response.data;
};

/**
 * Update an existing category
 * @param {number} id - Category ID
 * @param {Object} categoryData - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, categoryData) => {
  const response = await api.put(`${ENDPOINT}/${id}`, categoryData);
  return response.data;
};

/**
 * Delete a category
 * @param {number} id - Category ID
 * @returns {Promise<void>}
 */
export const deleteCategory = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};