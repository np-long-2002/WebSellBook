
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async () => {
    try {
      if (!password || !confirmPassword) {
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
      }

      if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp");
        return;
      }

      setLoading(true);

      await resetPassword(
        token,
        password
      );

      alert("Đổi mật khẩu thành công");

      navigate("/");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data ||
        "Có lỗi xảy ra"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-100
      px-4
      "
    >
      <div
        className="
        bg-white
        shadow-xl
        rounded-3xl
        p-8
        w-full
        max-w-md
        "
      >
        <h1
          className="
          text-3xl
          font-bold
          text-center
          mb-2
          "
        >
          Reset Password
        </h1>

        <p
          className="
          text-gray-500
          text-center
          mb-8
          "
        >
          Nhập mật khẩu mới của bạn
        </p>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="
            w-full
            border
            border-gray-300
            rounded-xl
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          />

          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
            className="
            w-full
            border
            border-gray-300
            rounded-xl
            p-3
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-3
            rounded-xl
            font-semibold
            transition
            disabled:bg-gray-400
            "
          >
            {loading
              ? "Đang xử lý..."
              : "Đổi mật khẩu"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;