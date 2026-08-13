import api from './api';

const ENDPOINT = '/Book';

/**
 * Fetch all books
 * @returns {Promise<Array>} List of books
 */
export const getBooks = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Fetch a single book by ID
 * @param {number} id - Book ID
 * @returns {Promise<Object>} Book details
 */
export const getBookById = async (id) => {
  const response = await api.get(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Create a new book
 * @param {Object} bookData - Book data
 * @returns {Promise<Object>} Created book
 */
export const createBook = async (bookData) => {
  const response = await api.post(ENDPOINT, bookData);
  return response.data;
};

/**
 * Update an existing book
 * @param {number} id - Book ID
 * @param {Object} bookData - Updated book data
 * @returns {Promise<Object>} Updated book
 */
export const updateBook = async (id, bookData) => {
  const response = await api.put(`${ENDPOINT}/${id}`, bookData);
  return response.data;
};

/**
 * Delete a book
 * @param {number} id - Book ID
 * @returns {Promise<void>}
 */
export const deleteBook = async (id) => {
  await api.delete(`${ENDPOINT}/${id}`);
};

/**
 * Upload book cover image
 * @param {File} file - Image file
 * @returns {Promise<string>} Image URL
 */
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`${ENDPOINT}/upload-image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.imageUrl;
};

/**
 * Upload book preview/PDF
 * @param {File} file - Preview file
 * @returns {Promise<string>} Preview URL
 */
export const uploadPreview = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(`${ENDPOINT}/upload-preview`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.previewUrl;
};