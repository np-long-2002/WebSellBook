import api from './api';

const ENDPOINT = '/Voucher';

/**
 * Get all vouchers
 * @returns {Promise<Array>} List of vouchers
 */
export const getVouchers = async () => {
  const response = await api.get(ENDPOINT);
  return response.data;
};

/**
 * Apply voucher code to order
 * @param {string} code - Voucher code
 * @param {number} orderAmount - Order amount
 * @returns {Promise<Object>} Voucher details and discount
 */
export const applyVoucher = async (code, orderAmount) => {
  const response = await api.post(`${ENDPOINT}/apply`, {
    code,
    orderAmount,
  });
  return response.data;
};

/**
 * Create a new voucher
 * @param {Object} voucherData - Voucher data
 * @returns {Promise<Object>} Created voucher
 */
export const createVoucher = async (data) => {
  const response = await api.post(ENDPOINT, data);
  return response.data;
};

/**
 * Update an existing voucher
 * @param {number} id - Voucher ID
 * @param {Object} voucherData - Updated voucher data
 * @returns {Promise<Object>} Updated voucher
 */
export const updateVoucher = async (id, data) => {
  const response = await api.put(`${ENDPOINT}/${id}`, data);
  return response.data;
};

/**
 * Delete a voucher
 * @param {number} id - Voucher ID
 * @returns {Promise<Object>} Deleted voucher
 */
export const deleteVoucher = async (id) => {
  const response = await api.delete(`${ENDPOINT}/${id}`);
  return response.data;
};

/**
 * Toggle voucher active status
 * @param {number} id - Voucher ID
 * @returns {Promise<Object>} Updated voucher
 */
export const toggleVoucher = async (id) => {
  const response = await api.patch(`${ENDPOINT}/${id}/toggle`, {});
  return response.data;
};