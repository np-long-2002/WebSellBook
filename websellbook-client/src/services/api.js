import axios from "axios";

const api = axios.create({
  baseURL: "https://websellbook-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem("token");

    // Loại bỏ dấu ngoặc kép thừa nếu có
    if (token) {
        token = token.replace(/^"|"$/g, '');
    }

    // Chỉ gắn token nếu không phải là request đăng nhập hoặc đăng ký
    const isAuthRequest = config.url.includes("/Auth/login") || config.url.includes("/Auth/register");

    if (token && !isAuthRequest) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu bị 401, chỉ logout nếu request đó là request cần bảo mật cao
    if (error.response?.status === 401) {
       console.warn("Lỗi 401: Token có thể đã hết hạn hoặc không hợp lệ tại", error.config.url);

       // Chỉ logout ở các trang cực kỳ nhạy cảm để tránh bị đá văng liên tục
       const criticalPaths = ["/checkout", "/profile", "/orders"];
       if (criticalPaths.some(p => window.location.pathname.includes(p))) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export const publicApi = axios.create({
  baseURL: "https://websellbook-production.up.railway.app",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;