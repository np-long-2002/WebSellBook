
import { useEffect, useState } from "react";

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from "../services/categoryService";

import Pagination from "../components/Pagination";

function AdminCategoryPage() {

  const [categories, setCategories] =
    useState([]);

  const [filteredCategories, setFilteredCategories] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [editing, setEditing] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const categoriesPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {

    const result =
      categories.filter(category =>
        category.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredCategories(result);

    setCurrentPage(1);

  }, [search, categories]);

  const loadData = async () => {

    try {

      const data =
        await getCategories();

      setCategories(data);

      setFilteredCategories(data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleSave = async () => {

    try {

      if (!name.trim()) {

        alert(
          "Vui lòng nhập tên Category"
        );

        return;
      }

      const body = {
        name
      };

      if (editing) {

        await updateCategory(
          editing.id,
          body
        );

      } else {

        await createCategory(body);

      }

      setName("");

      setEditing(null);

      loadData();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Có lỗi xảy ra"
      );
    }
  };

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Bạn có chắc muốn xóa Category này?"
      )
    ) {
      return;
    }

    try {

      await deleteCategory(id);

      loadData();

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data ||
        "Không thể xóa Category"
      );
    }
  };

  const handleEdit = (category) => {

    setEditing(category);

    setName(category.name);
  };

  const handleCancel = () => {

    setEditing(null);

    setName("");
  };

  const indexOfLast =
    currentPage *
    categoriesPerPage;

  const indexOfFirst =
    indexOfLast -
    categoriesPerPage;

  const currentCategories =
    filteredCategories.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages =
    Math.ceil(
      filteredCategories.length /
      categoriesPerPage
    );

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Category Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Categories:
            {" "}
            {filteredCategories.length}
          </p>

        </div>

      </div>

      {/* FORM */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow
        p-6
        "
      >

        <h2
          className="
          text-xl
          font-bold
          mb-5
          "
        >
          {editing
            ? "Update Category"
            : "Create Category"}
        </h2>

        <div className="flex gap-4">

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Category Name"
            className="
            flex-1
            border
            rounded-xl
            p-3
            "
          />

        </div>

        <div className="flex gap-3 mt-5">

          <button
            onClick={handleSave}
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            "
          >
            {editing
              ? "Update"
              : "Create"}
          </button>

          {editing && (

            <button
              onClick={handleCancel}
              className="
              bg-gray-300
              px-6
              py-3
              rounded-xl
              "
            >
              Cancel
            </button>

          )}

        </div>

      </div>

      {/* SEARCH */}

      <div
        className="
        bg-white
        rounded-2xl
        shadow
        p-5
        "
      >

        <input
          type="text"
          placeholder="Search Category..."
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

      {/* TABLE */}

      <div
        className="
        bg-white
        rounded-3xl
        shadow
        overflow-hidden
        "
      >

        <table className="w-full">

          <thead
            className="
            bg-slate-100
            "
          >

            <tr>

              <th className="p-4">
                ID
              </th>

              <th>
                Category Name
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {currentCategories.length === 0 ? (

              <tr>

                <td
                  colSpan="3"
                  className="
                  p-10
                  text-center
                  text-gray-500
                  "
                >
                  No Category Found
                </td>

              </tr>

            ) : (

              currentCategories.map(
                (category) => (

                  <tr
                    key={category.id}
                    className="
                    border-t
                    hover:bg-slate-50
                    text-center
                    "
                  >

                    <td className="p-4">
                      {category.id}
                    </td>

                    <td>
                      {category.name}
                    </td>

                    <td>

                      <div
                        className="
                        flex
                        justify-center
                        gap-2
                        "
                      >

                        <button
                          onClick={() =>
                            handleEdit(
                              category
                            )
                          }
                          className="
                          bg-yellow-500
                          hover:bg-yellow-600
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          "
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              category.id
                            )
                          }
                          className="
                          bg-red-500
                          hover:bg-red-600
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          "
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

      </div>

    </div>

  );
}

export default AdminCategoryPage;

