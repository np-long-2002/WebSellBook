import api from "./api";

const ENDPOINT = "/api/Auth";

/**
 * Login user
 */
export const login = async (
  email,
  password
) => {
  const response =
    await api.post(
      `${ENDPOINT}/login`,
      {
        email,
        password,
      }
    );

  return response.data;
};

/**
 * Register user
 */
export const register = async (
  email,
  password,
  fullName
) => {
  const response =
    await api.post(
      `${ENDPOINT}/register`,
      {
        email,
        password,
        fullName,
      }
    );

  return response.data;
};

/**
 * Forgot password
 */
export const forgotPassword =
  async (email) => {
    const response =
      await api.post(
        `${ENDPOINT}/forgot-password`,
        {
          email,
        }
      );

    return response.data;
  };

/**
 * Reset password
 */
export const resetPassword =
  async (
    token,
    newPassword
  ) => {
    const response =
      await api.post(
        `${ENDPOINT}/reset-password`,
        {
          token,
          newPassword,
        }
      );

    return response.data;
  };

/**
 * Verify Email OTP
 */
export const verifyEmail =
  async (
    email,
    code
  ) => {
    const response =
      await api.post(
        `${ENDPOINT}/verify-email`,
        {
          email,
          code,
        }
      );

    return response.data;
  };