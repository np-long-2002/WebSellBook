import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import {
  verifyEmail
} from "../services/authService";

function VerifyEmailPage() {

  const navigate =
    useNavigate();

  const [email] =
    useState(
      localStorage.getItem(
        "verifyEmail"
      ) || ""
    );

  const [code,
    setCode] =
    useState("");

  const [loading,
    setLoading] =
    useState(false);

  const [timeLeft,
    setTimeLeft] =
    useState(600); // 10 phút

  useEffect(() => {

    if (timeLeft <= 0)
      return;

    const timer =
      setInterval(() => {

        setTimeLeft(
          (prev) =>
            prev - 1
        );

      }, 1000);

    return () =>
      clearInterval(timer);

  }, [timeLeft]);

  const formatTime = (
    seconds
  ) => {

    const mins =
      Math.floor(
        seconds / 60
      );

    const secs =
      seconds % 60;

    return `${mins
      .toString()
      .padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleVerify =
    async () => {

      if (!code) {

        alert(
          "Vui lòng nhập mã OTP"
        );

        return;
      }

      try {

        setLoading(true);

        await verifyEmail(
          email,
          code
        );

        localStorage.removeItem(
          "verifyEmail"
        );

        alert(
          "Xác thực thành công"
        );

        navigate("/");

      } catch (error) {

        alert(
          error.response?.data ||
          "Xác thực thất bại"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div
      className="
      min-h-screen
      bg-slate-100
      flex
      items-center
      justify-center
      px-4
      "
    >

      <div
        className="
        bg-white
        w-full
        max-w-md
        rounded-3xl
        shadow-xl
        p-8
        "
      >

        <div
          className="
          text-center
          mb-8
          "
        >

          <h1
            className="
            text-3xl
            font-bold
            text-blue-600
            "
          >
            Verify Email
          </h1>

          <p
            className="
            text-gray-500
            mt-3
            "
          >
            Nhập mã OTP đã gửi tới
          </p>

          <p
            className="
            font-semibold
            text-gray-700
            break-all
            "
          >
            {email}
          </p>

        </div>

        <div
          className="
          mb-5
          "
        >

          <label
            className="
            block
            mb-2
            font-medium
            "
          >
            OTP Code
          </label>

          <input
            type="text"
            value={code}
            onChange={(e) =>
              setCode(
                e.target.value
              )
            }
            placeholder="Nhập mã OTP"
            className="
            w-full
            border
            rounded-xl
            p-4
            text-center
            text-xl
            tracking-widest
            "
          />

        </div>

        <div
          className="
          text-center
          mb-6
          "
        >

          <span
            className="
            text-sm
            text-gray-500
            "
          >
            OTP hết hạn sau:
          </span>

          <div
            className="
            text-2xl
            font-bold
            text-red-500
            "
          >
            {formatTime(
              timeLeft
            )}
          </div>

        </div>

        <button
          onClick={
            handleVerify
          }
          disabled={loading}
          className="
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          py-4
          rounded-xl
          font-semibold
          transition
          "
        >
          {loading
            ? "Đang xác thực..."
            : "Xác thực"}
        </button>

        <button
          onClick={() =>
            navigate("/")
          }
          className="
          w-full
          mt-3
          border
          py-4
          rounded-xl
          hover:bg-slate-100
          "
        >
          Quay lại đăng nhập
        </button>

      </div>

    </div>
  );
}

export default VerifyEmailPage;