import { useEffect, useState } from "react";
import { API_URL } from "../config";
import {
  uploadImage,
  uploadPreview
} from "../services/bookService";

import {
  getAuthors
} from "../services/authorService";

import {
  getCategories
} from "../services/categoryService";

function BookModal({
  isOpen,
  onClose,
  onSave,
  book
}) {

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: 0,
    stock: 0,
    authorId: "",
    categoryId: "",
    imageUrl: "",
    previewFileUrl: ""
  });

  const [imageFile, setImageFile] =
    useState(null);

  const [previewFile, setPreviewFile] =
    useState(null);

  const [authors, setAuthors] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const loadDropdownData =
    async () => {

      try {

        const authorData =
          await getAuthors();

        const categoryData =
          await getCategories();

        setAuthors(authorData);

        setCategories(categoryData);

      } catch (err) {
        console.log(err);
      }
    };

  useEffect(() => {

    loadDropdownData();

    if (book) {

      setForm({
        ...book
      });

    } else {

      setForm({
        title: "",
        description: "",
        price: 0,
        stock: 0,
        authorId: "",
        categoryId: "",
        imageUrl: "",
        previewFileUrl: ""
      });

    }

  }, [book]);

  if (!isOpen) return null;

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

    setForm({
      ...form,
      [name]:
        [
          "price",
          "stock",
          "authorId",
          "categoryId"
        ].includes(name)
          ? Number(value)
          : value
    });
  };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      let imageUrl =
        form.imageUrl;

      let previewFileUrl =
        form.previewFileUrl;

      try {

        if (imageFile) {

          imageUrl =
            await uploadImage(
              imageFile
            );
        }

        if (previewFile) {

          previewFileUrl =
            await uploadPreview(
              previewFile
            );
        }

        await onSave({
          ...form,
          imageUrl,
          previewFileUrl
        });

      } catch (err) {

        console.log(err);

        alert(
          "Upload thất bại"
        );
      }
    };

return (
  <div
    className="
    fixed
    inset-0
    bg-black/50
    backdrop-blur-sm
    flex
    items-center
    justify-center
    z-50
    p-4
    "
  >
    <div
      className="
      bg-white
  w-full
  max-w-2xl
  max-h-[90vh]
  rounded-3xl
  shadow-2xl
  overflow-y-auto
      "
    >
      {/* HEADER */}

      <div
        className="
        flex
        justify-between
        items-center
        px-6
        py-5
        border-b
        "
      >
        <div>
          <h2 className="text-2xl font-bold">
            {book
              ? "Edit Book"
              : "Add New Book"}
          </h2>

          <p className="text-gray-500 text-sm">
            Manage your book information
          </p>
        </div>

        <button
          onClick={onClose}
          className="
          text-gray-400
          hover:text-red-500
          text-3xl
          "
        >
          ×
        </button>
      </div>

      {/* BODY */}

      <form
        onSubmit={handleSubmit}
        className="p-6 space-y-5"
      >
        <div>
          <label className="font-medium">
            Book Title
          </label>

          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            "
          />
        </div>

        <div>
          <label className="font-medium">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="4"
            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            "
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="font-medium">
              Price
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="
              w-full
              mt-2
              border
              rounded-xl
              p-3
              "
            />
          </div>

          <div>
            <label className="font-medium">
              Stock
            </label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="
              w-full
              mt-2
              border
              rounded-xl
              p-3
              "
            />
          </div>
        </div>

        <div>
          <label className="font-medium">
            Author
          </label>

          <select
            name="authorId"
            value={form.authorId}
            onChange={handleChange}
            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            "
          >
            <option value="">
              Select Author
            </option>

            {authors.map(author => (
              <option
                key={author.id}
                value={author.id}
              >
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-medium">
            Category
          </label>

          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            "
          >
            <option value="">
              Select Category
            </option>

            {categories.map(category => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* IMAGE */}

        <div>
          <label className="font-medium">
            Book Cover
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImageFile(
                e.target.files[0]
              )
            }
            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            "
          />
        </div>

        {form.imageUrl && (
          <div className="flex justify-center">
          <img
  src={
    form.imageUrl?.startsWith("http")
      ? form.imageUrl
      : `${API_URL}${form.imageUrl}`
  }
  alt=""
  className="
  w-36
  h-52
  object-cover
  rounded-xl
  shadow
  "
/>
          </div>
        )}

        {/* PDF */}

        <div>
          <label className="font-medium">
            Preview PDF
          </label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setPreviewFile(
                e.target.files[0]
              )
            }
            className="
            w-full
            mt-2
            border
            rounded-xl
            p-3
            "
          />
        </div>

        {form.previewFileUrl && (
  <a
    href={
      form.previewFileUrl.startsWith("http")
        ? form.previewFileUrl
        : `${API_URL}${form.previewFileUrl}`
    }
    target="_blank"
    rel="noreferrer"
    className="
    inline-flex
    bg-blue-100
    text-blue-700
    px-4
    py-2
    rounded-xl
    "
  >
    View Current PDF
  </a>
)}

        {/* FOOTER */}

        <div
          className="
          flex
          justify-end
          gap-3
          pt-5
          border-t
          "
        >
          <button
            type="button"
            onClick={onClose}
            className="
            px-5
            py-3
            rounded-xl
            bg-gray-200
            hover:bg-gray-300
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            className="
            px-6
            py-3
            rounded-xl
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            "
          >
            Save Book
          </button>
        </div>
      </form>
    </div>
  </div>
);


}

export default BookModal;
