import { useEffect, useState } from "react";

import {
  getBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../services/bookService";

import BookModal from "../components/BookModal";
import { API_URL } from "../config";

function AdminBooksPage() {

  const [books, setBooks] =
    useState([]);

  const [filteredBooks, setFilteredBooks] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [editingBook, setEditingBook] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const booksPerPage = 10;

  const loadBooks = async () => {
    try {


      const data =
        await getBooks();

      setBooks(data);
      setFilteredBooks(data);

    } catch (error) {
      console.log(error);
    }


  };

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {


    const result =
      books.filter((book) =>
        book.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFilteredBooks(result);

    setCurrentPage(1);


  }, [search, books]);

  const handleSave =
    async (book) => {


      try {

        if (editingBook) {

          await updateBook(
            editingBook.id,
            book
          );

        } else {

          await createBook(book);

        }

        setShowModal(false);
        setEditingBook(null);

        loadBooks();

      } catch (err) {

        console.log(err);

        alert(
          "Lỗi khi lưu sách"
        );
      }
    };


  const handleDelete =
    async (id) => {


      if (
        !window.confirm(
          "Bạn có chắc muốn xóa sách?"
        )
      ) {
        return;
      }

      try {

        await deleteBook(id);

        loadBooks();

      } catch (error) {

        console.log(error);

      }
    };

  const indexOfLastBook =
    currentPage * booksPerPage;

  const indexOfFirstBook =
    indexOfLastBook -
    booksPerPage;

  const currentBooks =
    filteredBooks.slice(
      indexOfFirstBook,
      indexOfLastBook
    );

  const totalPages =
    Math.ceil(
      filteredBooks.length /
      booksPerPage
    );

  return (<div className="space-y-6">


    <div className="flex justify-between items-center">

      <div>

        <h1 className="text-3xl font-bold">
          Books Management
        </h1>

        <p className="text-gray-500 mt-1">
          Total Books:
          {" "}
          {filteredBooks.length}
        </p>

      </div>

      <button
        onClick={() => {
          setEditingBook(null);
          setShowModal(true);
        }}
        className="
      px-5
      py-3
      bg-blue-600
      hover:bg-blue-700
      text-white
      rounded-xl
      shadow
      "
      >
        + Add Book
      </button>

    </div>

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
        placeholder="Search book..."
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

    <div
      className="
    bg-white
    rounded-2xl
    shadow
    overflow-hidden
    "
    >

      <table className="w-full">

        <thead>

          <tr
            className="
          bg-slate-100
          "
          >

            <th className="p-4">
              ID
            </th>

            <th>
              Cover
            </th>

            <th>
              Title
            </th>

            <th>
              Price
            </th>

            <th>
              Stock
            </th>

            <th>
              PDF
            </th>

            <th>
              Action
            </th>

          </tr>

        </thead>

        <tbody>

          {currentBooks.map(
            (book) => (

              <tr
                key={book.id}
                className="
              border-t
              text-center
              hover:bg-slate-50
              "
              >

                <td className="p-4">
                  {book.id}
                </td>

                <td>

                  {book.imageUrl && (

                    <img
  src={`${API_URL}${book.imageUrl}`}
  alt={book.title}
  className="
  w-16
  h-20
  object-cover
  rounded-lg
  mx-auto
  "
/>
                  )}

                </td>

                <td>
                  {book.title}
                </td>

                <td>
                  {book.price?.toLocaleString("vi-VN")}
                  ₫
                </td>

                <td>
                  {book.availableStock <= 0 ? (
                    <span className="text-red-600 font-bold">
                      Hết hàng
                    </span>
                  ) : (
                    <span className="text-green-600">
                      {book.availableStock}
                    </span>
                  )}
                </td>

                <td>

                  {book.previewFileUrl && (

                    <a
  href={`${API_URL}${book.previewFileUrl}`}
  target="_blank"
  rel="noreferrer"
  className="text-blue-600"
>
  PDF
</a>

                  )}

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
                      onClick={() => {
                        setEditingBook(book);
                        setShowModal(true);
                      }}
                      className="
                    px-3
                    py-2
                    bg-yellow-500
                    text-white
                    rounded-lg
                    "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          book.id
                        )
                      }
                      className="
                    px-3
                    py-2
                    bg-red-500
                    text-white
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

      <div
        className="
      flex
      justify-center
      items-center
      gap-2
      p-6
      border-t
      "
      >

        <button
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
          className="
        px-4
        py-2
        border
        rounded-lg
        disabled:opacity-50
        "
        >
          Prev
        </button>

        {[...Array(totalPages)].map(
          (_, index) => (

            <button
              key={index}
              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }
              className={`
            px-4
            py-2
            rounded-lg
            ${currentPage ===
                  index + 1
                  ? "bg-blue-600 text-white"
                  : "border"
                }
          `}
            >
              {index + 1}
            </button>

          )
        )}

        <button
          disabled={
            currentPage ===
            totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
          className="
        px-4
        py-2
        border
        rounded-lg
        disabled:opacity-50
        "
        >
          Next
        </button>

      </div>

    </div>

    <BookModal
      isOpen={showModal}
      onClose={() => {
        setShowModal(false);
        setEditingBook(null);
      }}
      onSave={handleSave}
      book={editingBook}
    />

  </div>


  );
}

export default AdminBooksPage;
