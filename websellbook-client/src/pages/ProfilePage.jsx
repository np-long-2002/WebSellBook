import { useEffect, useState } from "react";

import {
  getProfile,
  updateProfile,
  changePassword
} from "../services/profileService";

function ProfilePage() {
  const [profile, setProfile] =
    useState(null);

  const [fullName, setFullName] =
    useState("");

  const [phoneNumber, setPhoneNumber] =
    useState("");

  const [currentPassword,
    setCurrentPassword] =
    useState("");

  const [newPassword,
    setNewPassword] =
    useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile =
    async () => {
      try {

        const data =
          await getProfile();

        setProfile(data);

        setFullName(
          data.fullName || ""
        );

        setPhoneNumber(
          data.phoneNumber || ""
        );

      } catch (error) {

        console.log(error);

      }
    };

  const handleUpdateProfile =
    async () => {
      try {

        await updateProfile({
          fullName,
          phoneNumber
        });

        alert(
          "Cập nhật thành công"
        );

        fetchProfile();

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data ||
          "Có lỗi xảy ra"
        );

      }
    };

  const handleChangePassword =
    async () => {
      try {

        await changePassword(
          currentPassword,
          newPassword
        );

        alert(
          "Đổi mật khẩu thành công"
        );

        setCurrentPassword("");
        setNewPassword("");

      } catch (error) {

        console.log(error);

        alert(
          error.response?.data ||
          "Có lỗi xảy ra"
        );

      }
    };

  if (!profile) {
    return (
      <div
        className="
        h-[500px]
        flex
        items-center
        justify-center
        text-2xl
        font-bold
        "
      >
        Loading...
      </div>
    );
  }

  return (
    <div
      className="
      max-w-5xl
      mx-auto
      py-10
      px-4
      "
    >

      <h1
        className="
        text-4xl
        font-bold
        mb-8
        "
      >
        My Profile
      </h1>

      <div
        className="
        grid
        lg:grid-cols-2
        gap-8
        "
      >

        {/* THÔNG TIN TÀI KHOẢN */}

        <div
          className="
          bg-white
          rounded-3xl
          shadow-lg
          p-8
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-6
            "
          >
            Account Information
          </h2>

          <div
            className="
            space-y-4
            "
          >

            <div>

              <p
                className="
                text-gray-500
                "
              >
                Full Name
              </p>

              <p
                className="
                font-semibold
                "
              >
                {profile.fullName}
              </p>

            </div>

            <div>

              <p
                className="
                text-gray-500
                "
              >
                Email
              </p>

              <p
                className="
                font-semibold
                "
              >
                {profile.email}
              </p>

            </div>

            <div>

              <p
                className="
                text-gray-500
                "
              >
                Phone Number
              </p>

              <p
                className="
                font-semibold
                "
              >
                {profile.phoneNumber ||
                  "Chưa cập nhật"}
              </p>

            </div>

            <div>

              <p
                className="
                text-gray-500
                "
              >
                Created At
              </p>

              <p
                className="
                font-semibold
                "
              >
                {
                  new Date(
                    profile.createdAt
                  ).toLocaleDateString(
                    "vi-VN"
                  )
                }
              </p>

            </div>

          </div>

        </div>

        {/* UPDATE PROFILE */}

        <div
          className="
          bg-white
          rounded-3xl
          shadow-lg
          p-8
          "
        >

          <h2
            className="
            text-2xl
            font-bold
            mb-6
            "
          >
            Update Profile
          </h2>

          <div
            className="
            space-y-4
            "
          >

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
              rounded-xl
              p-4
              "
            />

            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) =>
                setPhoneNumber(
                  e.target.value
                )
              }
              className="
              w-full
              border
              rounded-xl
              p-4
              "
            />

            <button
              onClick={
                handleUpdateProfile
              }
              className="
              w-full
              bg-blue-600
              text-white
              py-4
              rounded-xl
              hover:bg-blue-700
              "
            >
              Update Profile
            </button>

          </div>

        </div>

      </div>

      {/* ĐỔI MẬT KHẨU */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow-lg
        p-8
        mt-8
        "
      >

        <h2
          className="
          text-2xl
          font-bold
          mb-6
          "
        >
          Change Password
        </h2>

        <div
          className="
          grid
          lg:grid-cols-2
          gap-4
          "
        >

          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(
                e.target.value
              )
            }
            className="
            border
            rounded-xl
            p-4
            "
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            className="
            border
            rounded-xl
            p-4
            "
          />

        </div>

        <button
          onClick={
            handleChangePassword
          }
          className="
          mt-6
          bg-green-600
          text-white
          px-6
          py-4
          rounded-xl
          hover:bg-green-700
          "
        >
          Change Password
        </button>

      </div>

    </div>
  );
}

export default ProfilePage;