import api from './api';

const ENDPOINT = '/Review';

/**
 * Get reviews for a book
 * @param {number} bookId - Book ID
 * @returns {Promise<Array>} List of reviews
 */
export const getReviews = async (bookId) => {
  const response = await api.get(`${ENDPOINT}/book/${bookId}`);
  return response.data;
};

/**
 * Check if current user can review this book
 * @param {number} bookId - Book ID
 * @returns {Promise<Object>} Permission status
 */
export const canReview = async (bookId) => {
  const response = await api.get(`${ENDPOINT}/can-review/${bookId}`);
  return response.data;
};

/**
 * Create a new review
 * @param {number} bookId - Book ID
 * @param {number} rating - Rating (1-5)
 * @param {string} comment - Review comment
 * @returns {Promise<Object>} Created review
 */
export const createReview = async (bookId, rating, comment) => {
  const response = await api.post(ENDPOINT, {
    bookId,
    rating,
    comment,
  });
  return response.data;
};

/**
 * Delete user's own review
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object>} Deleted review
 */
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`${ENDPOINT}/${reviewId}`);
  return response.data;
};

/**
 * Get all reviews (admin)
 * @returns {Promise<Array>} List of all reviews
 */
export const getAllReviews = async () => {
  const response = await api.get(`${ENDPOINT}/admin`);
  return response.data;
};

/**
 * Admin delete a review
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object>} Deleted review
 */
export const adminDeleteReview = async (reviewId) => {
  const response = await api.delete(`${ENDPOINT}/admin/${reviewId}`);
  return response.data;
};

/**
 * Update an existing review
 * @param {number} reviewId - Review ID
 * @param {number} rating - New rating (1-5)
 * @param {string} comment - New comment
 * @returns {Promise<Object>} Updated review
 */
export const updateReview = async (reviewId, rating, comment) => {
  const response = await api.put(`${ENDPOINT}/${reviewId}`, {
    rating,
    comment,
  });
  return response.data;
};

/**
 * Admin hide/delete a review
 * @param {number} reviewId - Review ID
 * @returns {Promise<Object>} Hidden review
 */
export const hideReview = async (reviewId) => {
  const response = await api.delete(`${ENDPOINT}/admin/${reviewId}`);
  return response.data;
};
