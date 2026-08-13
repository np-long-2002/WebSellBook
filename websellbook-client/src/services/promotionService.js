import api from './api';

const ENDPOINT = '/Promotion';

/**
 * Get all promotions
 * @returns {Promise<Array>} List of promotions
 */
export const getPromotions = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Get a single promotion
 * @param {number} id - Promotion ID
 * @returns {Promise<Object>} Promotion details
 */
export const getPromotion = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create a new promotion
 * @param {Object} promotionData - Promotion data
 * @returns {Promise<Object>} Created promotion
 */
export const createPromotion = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

/**
 * Update an existing promotion
 * @param {number} id - Promotion ID
 * @param {Object} promotionData - Updated promotion data
 * @returns {Promise<Object>} Updated promotion
 */
export const updatePromotion = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Delete a promotion
 * @param {number} id - Promotion ID
 * @returns {Promise<void>}
 */
export const deletePromotion = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};

/**
 * Toggle promotion active status
 * @param {number} id - Promotion ID
 * @returns {Promise<Object>} Updated promotion
 */
export const togglePromotion = async (id) => {
  const response = await api.patch(`${ENDPOINT}/${id}/toggle`, {});
  return response.data;
};