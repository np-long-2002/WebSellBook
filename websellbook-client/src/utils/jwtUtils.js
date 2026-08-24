
import { jwtDecode } from "jwt-decode";

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserInfo = () => {
  const token = getToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode(token);

    return {
      id:
        decoded["UserId"] ||
        decoded["nameid"] ||
        decoded["sub"],

      fullName:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ],

      email:
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        ],

      role:
        decoded[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ],

      exp: decoded.exp,
    };
  } catch {
    return null;
  }
};

export const getRole = () => {
  return getUserInfo()?.role || null;
};

export const isLoggedIn = () => {
  return !!getToken();
};

export const isTokenExpired = () => {
  const token = getToken();

  if (!token) return true;

  try {
    const decoded = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

