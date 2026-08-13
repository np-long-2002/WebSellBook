import api from "./api";

const ENDPOINT = "/api/profile";

// Lấy thông tin cá nhân

export const getProfile =
async () => {

  const response =
    await api.get(
      ENDPOINT
    );

  return response.data;
};

// Cập nhật thông tin

export const updateProfile =
async (data) => {

  const response =
    await api.put(
      ENDPOINT,
      data
    );

  return response.data;
};

// Đổi mật khẩu

export const changePassword =
async (
  currentPassword,
  newPassword
) => {

  const response =
    await api.put(
      `${ENDPOINT}/change-password`,
      {
        currentPassword,
        newPassword
      }
    );

  return response.data;
};