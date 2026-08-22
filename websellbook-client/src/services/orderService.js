import api from "./api";

const ENDPOINT = "/Order";

/**
 * Checkout
 */
export const checkout = async ({
  receiverName,
  receiverPhone,
  shippingAddress,
  items,
  voucherCode,
}) => {

  const payload = {
    receiverName,
    receiverPhone,
    shippingAddress,

    items: items.map((item) => {
      console.log("DEBUG ITEM:", item);
      return {
        bookId: item.id || item.bookId || item._id, // Bỏ parseInt nếu ID là chuỗi/GUID
        quantity: parseInt(item.quantity, 10),
      };
    }),

    voucherCode: voucherCode || null,
  };

  console.log("CHECKOUT PAYLOAD", payload);
  const response = await api.post(
    `${ENDPOINT}/checkout`,
    payload
  );

  return response.data;
};

/**
 * User Orders
 */
export const getMyOrders = async () => {
  const response = await api.get(
    `${ENDPOINT}/my-orders`
  );

  return response.data;
};

/**
 * Admin Orders
 */
export const getOrders = async () => {
  const response = await api.get(
    ENDPOINT
  );

  return response.data;
};

/**
 * Update Order Status
 */
export const updateOrderStatus = async (
  id,
  status
) => {

  const response =
    await api.put(
      `${ENDPOINT}/${id}/status?status=${status}`,
      {}
    );

  return response.data;
};

/**
 * Cancel Order
 */
export const cancelOrder = async (
  id
) => {

  const response =
    await api.put(
      `${ENDPOINT}/${id}/cancel`,
      {}
    );

  return response.data;
};

