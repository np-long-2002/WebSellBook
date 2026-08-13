import api from './api';

const ENDPOINT = '/Author';

/**
 * Get all authors
 * @returns {Promise<Array>} List of authors
 */
export const getAuthors = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Create a new author
 * @param {Object} authorData - Author data
 * @returns {Promise<Object>} Created author
 */
export const createAuthor = async (authorData) => {
  const response = await api.post(ENDPOINT, authorData);
  return response.data;
};

/**
 * Update an existing author
 * @param {number} id - Author ID
 * @param {Object} authorData - Updated author data
 * @returns {Promise<Object>} Updated author
 */
export const updateAuthor = async (id, authorData) => {
  const response = await api.put(`${ENDPOINT}/${id}`, authorData);
  return response.data;
};

/**
 * Delete an author
 * @param {number} id - Author ID
 * @returns {Promise<void>}
 */
export const deleteAuthor = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};    