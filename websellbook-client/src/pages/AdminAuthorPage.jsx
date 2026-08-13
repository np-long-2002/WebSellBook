
import { useEffect, useState } from "react";

import {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from "../services/authorService";

import Pagination from "../components/Pagination";

function AdminAuthorPage() {

  const [authors, setAuthors] =
    useState([]);

  const [filteredAuthors, setFilteredAuthors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [editing, setEditing] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const authorsPerPage = 10;

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {

    const result =
      authors.filter(author =>
        author.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredAuthors(result);

    setCurrentPage(1);

  }, [search, authors]);

  const loadData = async () => {

    try {

      const data =
        await getAuthors();

      setAuthors(data);

      setFilteredAuthors(data);

    } catch (error) {

      console.log(error);

    }
  };

  const handleSave =
    async () => {

      try {

        const body = {
          name,
          bio
        };

        if (editing) {

          await updateAuthor(
            editing.id,
            body
          );

        } else {

          await createAuthor(body);

        }

        setName("");
        setBio("");
        setEditing(null);

        loadData();

      } catch (error) {

        console.log(error);

      }
    };

  const handleDelete =
    async (id) => {

      if (
        !window.confirm(
          "Bạn có chắc muốn xóa Author này?"
        )
      ) {
        return;
      }

      try {

        await deleteAuthor(id);

        loadData();

      } catch (error) {

        console.log(error);

      }
    };

  const handleEdit =
    (author) => {

      setEditing(author);

      setName(author.name);

      setBio(author.bio);
    };

  const handleCancel =
    () => {

      setEditing(null);

      setName("");

      setBio("");
    };

  const indexOfLast =
    currentPage * authorsPerPage;

  const indexOfFirst =
    indexOfLast - authorsPerPage;

  const currentAuthors =
    filteredAuthors.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages =
    Math.ceil(
      filteredAuthors.length /
      authorsPerPage
    );

  return (

    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Author Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Authors:
            {" "}
            {filteredAuthors.length}
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
            ? "Update Author"
            : "Create Author"}
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            placeholder="Author Name"
            className="
            border
            rounded-xl
            p-3
            "
          />

          <input
            value={bio}
            onChange={(e) =>
              setBio(
                e.target.value
              )
            }
            placeholder="Biography"
            className="
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
          placeholder="Search Author..."
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
                Author Name
              </th>

              <th>
                Biography
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {currentAuthors.length === 0 ? (

              <tr>

                <td
                  colSpan="4"
                  className="
                  p-10
                  text-center
                  text-gray-500
                  "
                >
                  No Author Found
                </td>

              </tr>

            ) : (

              currentAuthors.map(
                (author) => (

                  <tr
                    key={author.id}
                    className="
                    border-t
                    hover:bg-slate-50
                    text-center
                    "
                  >

                    <td className="p-4">
                      {author.id}
                    </td>

                    <td>
                      {author.name}
                    </td>

                    <td>
                      {author.bio}
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
                              author
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
                              author.id
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

export default AdminAuthorPage;

