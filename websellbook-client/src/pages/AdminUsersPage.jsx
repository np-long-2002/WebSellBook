
import { useEffect, useState } from "react";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} from "../services/userService";

import Pagination from "../components/Pagination";

function AdminUsersPage() {

  const [users, setUsers] =
    useState([]);

  const [filteredUsers, setFilteredUsers] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const usersPerPage = 10;

  const [form, setForm] =
    useState({
      fullName: "",
      email: "",
      password: "",
      role: "User"
    });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {

    const result =
      users.filter(
        (user) =>
          user.fullName
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          user.email
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

    setFilteredUsers(result);

    setCurrentPage(1);

  }, [search, users]);

  const loadUsers =
    async () => {

      try {

        const data =
          await getUsers();

        setUsers(data);

        setFilteredUsers(data);

      } catch (error) {

        console.log(error);

      }
    };

  const handleChange =
    (e) => {

      setForm({
        ...form,
        [e.target.name]:
          e.target.value
      });
    };

  const resetForm =
    () => {

      setEditingId(null);

      setForm({
        fullName: "",
        email: "",
        password: "",
        role: "User"
      });
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        if (editingId) {

          await updateUser(
            editingId,
            {
              fullName:
                form.fullName,
              role:
                form.role
            }
          );

        } else {

          await createUser({
            fullName:
              form.fullName,
            email:
              form.email,
            password:
              form.password,
            role:
              form.role
          });

        }

        resetForm();

        loadUsers();

      } catch (error) {

        console.log(error);

        alert(
          "Có lỗi xảy ra"
        );
      }
    };

  const handleEdit =
    (user) => {

      setEditingId(user.id);

      setForm({
        fullName:
          user.fullName,
        email:
          user.email,
        password: "",
        role:
          user.role
      });
    };

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Bạn có chắc muốn xóa User này?"
        )
      ) {
        return;
      }

      try {

        await deleteUser(id);

        loadUsers();

      } catch (error) {

        console.log(error);

      }
    };

  const totalAdmins =
    users.filter(
      x =>
        x.role === "Admin"
    ).length;

  const totalStaffs =
    users.filter(
      x =>
        x.role === "Staff"
    ).length;

  const totalUsers =
    users.filter(
      x =>
        x.role === "User"
    ).length;

  const indexOfLast =
    currentPage *
    usersPerPage;

  const indexOfFirst =
    indexOfLast -
    usersPerPage;

  const currentUsers =
    filteredUsers.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages =
    Math.ceil(
      filteredUsers.length /
      usersPerPage
    );

  return (
    <div className="space-y-6">

      {/* Header */}

      <div>

        <h1 className="text-3xl font-bold">
          User Management
        </h1>

        <p className="text-gray-500 mt-1">
          Total Users:
          {" "}
          {users.length}
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-white rounded-2xl shadow p-5">

          <h3 className="text-gray-500">
            Admins
          </h3>

          <p className="text-3xl font-bold text-red-500 mt-2">
            {totalAdmins}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-5">

          <h3 className="text-gray-500">
            Staffs
          </h3>

          <p className="text-3xl font-bold text-yellow-500 mt-2">
            {totalStaffs}
          </p>

        </div>

        <div className="bg-white rounded-2xl shadow p-5">

          <h3 className="text-gray-500">
            Customers
          </h3>

          <p className="text-3xl font-bold text-green-500 mt-2">
            {totalUsers}
          </p>

        </div>

      </div>

      {/* Form */}

      <div className="bg-white rounded-3xl shadow p-6">

        <h2 className="text-xl font-bold mb-5">

          {editingId
            ? "Update User"
            : "Create User"}

        </h2>

        <form
          onSubmit={
            handleSubmit
          }
          className="grid grid-cols-2 gap-4"
        >

          <input
            type="text"
            name="fullName"
            value={
              form.fullName
            }
            onChange={
              handleChange
            }
            placeholder="Full Name"
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="email"
            name="email"
            value={
              form.email
            }
            onChange={
              handleChange
            }
            placeholder="Email"
            className="border p-3 rounded-xl"
            required
            disabled={
              editingId
            }
          />

          {!editingId && (
            <input
              type="password"
              name="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              placeholder="Password"
              className="border p-3 rounded-xl"
              required
            />
          )}

          <select
            name="role"
            value={
              form.role
            }
            onChange={
              handleChange
            }
            className="border p-3 rounded-xl"
          >
            <option value="User">
              User
            </option>

            <option value="Staff">
              Staff
            </option>

            <option value="Admin">
              Admin
            </option>

          </select>

          <div className="col-span-2 flex gap-3">

            <button
              type="submit"
              className="
              bg-blue-600
              text-white
              px-6 py-3
              rounded-xl
              "
            >
              {editingId
                ? "Update"
                : "Create"}
            </button>

            {editingId && (

              <button
                type="button"
                onClick={
                  resetForm
                }
                className="
                bg-gray-300
                px-6 py-3
                rounded-xl
                "
              >
                Cancel
              </button>

            )}

          </div>

        </form>

      </div>

      {/* Search */}

      <div className="bg-white rounded-2xl shadow p-5">

        <input
          type="text"
          placeholder="Search User..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="
          w-full
          border
          rounded-xl
          p-3
          "
        />

      </div>

      {/* Table */}

      <div className="bg-white rounded-3xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-slate-100">

            <tr>

              <th className="p-4">
                ID
              </th>

              <th>
                Name
              </th>

              <th>
                Email
              </th>

              <th>
                Role
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {currentUsers.map(
              (user) => (

                <tr
                  key={user.id}
                  className="
                  border-t
                  hover:bg-slate-50
                  text-center
                  "
                >

                  <td className="p-4">
                    {user.id}
                  </td>

                  <td>
                    {user.fullName}
                  </td>

                  <td>
                    {user.email}
                  </td>

                  <td>

                    <span
                      className={`
                      px-3 py-1 rounded-full text-sm
                      ${
                        user.role === "Admin"
                          ? "bg-red-100 text-red-600"
                          : user.role === "Staff"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }
                      `}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          handleEdit(
                            user
                          )
                        }
                        className="
                        bg-yellow-500
                        text-white
                        px-4 py-2
                        rounded-lg
                        "
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            user.id
                          )
                        }
                        className="
                        bg-red-500
                        text-white
                        px-4 py-2
                        rounded-lg
                        "
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

        <Pagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          onPageChange={
            setCurrentPage
          }
        />

      </div>

    </div>
  );
}

export default AdminUsersPage;

