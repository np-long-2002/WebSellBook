import { jwtDecode } from "jwt-decode";

export const getUserInfo = () => {

  const token =
    localStorage.getItem("token");

  if (!token) return null;

  try {

    const decoded =
      jwtDecode(token);

    return {
      id:
        decoded["nameid"] ||
        decoded["sub"] ||
        decoded[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
        ],

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
        ]
    };

  } catch {

    return null;

  }
};

export const getRole = () => {

  const user = getUserInfo();

  return user?.role || null;
};