
import { useState } from "react";

import {
  login,
  register,
  forgotPassword
} from "../services/authService";

function LoginModal({
  closeModal,
}) {

  const [mode, setMode] =
    useState("login");
  // login | register | forgot

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const handleLogin =
    async () => {

      try {

        const result =
          await login(
            email,
            password
          );

        console.log("Login result:", result);

        // Lưu token dựa trên cấu trúc phổ biến nhất của ASP.NET Core
        // Thử lấy token từ thuộc tính token, accessToken, hoặc chính result nếu nó là string
        const token = result.token || result.accessToken || (typeof result === 'string' ? result : null);

        if (token) {
          localStorage.setItem("token", token);
          closeModal(); // Đóng modal trước
          window.location.reload(); // Reload lại trang
        } else {
          console.log("Response structure:", result);
          alert("Đăng nhập thành công nhưng không tìm thấy token trong phản hồi. Kiểm tra Console!");
        }

      } catch (error) {

        alert(
          error.response?.data ||
          "Đăng nhập thất bại"
        );

      }
    };

  const handleRegister =
  async () => {

    try {

      await register(
        email,
        password,
        fullName
      );

      localStorage.setItem(
        "verifyEmail",
        email
      );

      alert(
        "Đăng ký thành công. Vui lòng kiểm tra email để lấy mã OTP."
      );

      window.location.href =
        "/verify-email";

    } catch (error) {

      alert(
        error.response?.data ||
        "Đăng ký thất bại"
      );

    }
  };

  const handleForgotPassword =
    async () => {

      try {

        await forgotPassword(
          email
        );

        alert(
          "Đã gửi email đặt lại mật khẩu"
        );

        setMode("login");

      } catch (error) {

        alert(
          error.response?.data ||
          "Không thể gửi email"
        );

      }
    };

  return (

    <div
      className="
      fixed
      inset-0
      bg-black/50
      flex
      justify-center
      items-center
      z-50
      "
    >

      <div
        className="
        bg-white
        rounded-3xl
        p-8
        w-[420px]
        shadow-lg
        "
      >

        {/* LOGIN */}
        {mode === "login" && (
          <>
            <h2
              className="
              text-3xl
              font-bold
              mb-6
              text-center
              "
            >
              Login
            </h2>

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-3
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-4
              "
            />

            <button
              onClick={
                handleLogin
              }
              className="
              w-full
              bg-blue-600
              text-white
              py-3
              rounded-xl
              "
            >
              Login
            </button>

            <button
              onClick={() =>
                setMode("forgot")
              }
              className="
              w-full
              mt-3
              text-blue-600
              "
            >
              Quên mật khẩu?
            </button>

            <button
              onClick={() =>
                setMode(
                  "register"
                )
              }
              className="
              w-full
              mt-2
              text-blue-600
              "
            >
              Chưa có tài khoản?
              Đăng ký
            </button>
          </>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <>
            <h2
              className="
              text-3xl
              font-bold
              mb-6
              text-center
              "
            >
              Register
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-3
              "
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-3
              "
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-4
              "
            />

            <button
              onClick={
                handleRegister
              }
              className="
              w-full
              bg-green-600
              text-white
              py-3
              rounded-xl
              "
            >
              Register
            </button>

            <button
              onClick={() =>
                setMode("login")
              }
              className="
              w-full
              mt-3
              text-blue-600
              "
            >
              Đã có tài khoản?
              Đăng nhập
            </button>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "forgot" && (
          <>
            <h2
              className="
              text-3xl
              font-bold
              mb-6
              text-center
              "
            >
              Quên mật khẩu
            </h2>

            <input
              type="email"
              placeholder="Nhập Email"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="
              w-full
              border
              p-3
              rounded-xl
              mb-4
              "
            />

            <button
              onClick={
                handleForgotPassword
              }
              className="
              w-full
              bg-orange-600
              text-white
              py-3
              rounded-xl
              "
            >
              Gửi Email
            </button>

            <button
              onClick={() =>
                setMode("login")
              }
              className="
              w-full
              mt-3
              text-blue-600
              "
            >
              Quay lại đăng nhập
            </button>
          </>
        )}

        {/* CLOSE */}
        <button
          onClick={closeModal}
          className="
          w-full
          mt-4
          border
          py-3
          rounded-xl
          "
        >
          Close
        </button>

      </div>

    </div>
  );
}

export default LoginModal;