import {
    useEffect,
    useState
} from "react";

import {
    FaPlus,
    FaEdit,
    FaTrash,
    FaTags
} from "react-icons/fa";

import {
    getPromotions,
    createPromotion,
    updatePromotion,
    deletePromotion,
    togglePromotion
} from "../services/promotionService";

import { getBooks }
    from "../services/bookService";

import {
    getCategories
}
    from "../services/categoryService";

import Pagination
    from "../components/Pagination";

function AdminPromotionPage() {

    const [promotions,
        setPromotions] =
        useState([]);

    const [books,
        setBooks] =
        useState([]);

    const [categories,
        setCategories] =
        useState([]);

    const [search,
        setSearch] =
        useState("");

    const [showModal,
        setShowModal] =
        useState(false);

    const [editing,
        setEditing] =
        useState(null);

    const [currentPage,
        setCurrentPage] =
        useState(1);

    const perPage = 10;

    const [form,
        setForm] =
        useState({
            name: "",
            description: "",
            discountPercent: 10,
            startDate: "",
            endDate: "",
            isActive: true,
            bookIds: [],
            categoryIds: []
        });

    useEffect(() => {

        loadData();

    }, []);

    const loadData =
        async () => {

            const [
                promotionData,
                bookData,
                categoryData
            ] =
                await Promise.all([
                    getPromotions(),
                    getBooks(),
                    getCategories()
                ]);

            setPromotions(
                promotionData
            );

            setBooks(
                bookData
            );

            setCategories(
                categoryData
            );
        };

    const resetForm =
        () => {

            setEditing(null);

            setForm({
                name: "",
                description: "",
                discountPercent: 10,
                startDate: "",
                endDate: "",
                isActive: true,
                bookIds: [],
                categoryIds: []
            });
        };

    const handleSave =
        async () => {

            try {

                if (editing) {

                    await updatePromotion(
                        editing.id,
                        form
                    );

                } else {

                    await createPromotion(
                        form
                    );

                }

                setShowModal(false);

                resetForm();

                loadData();

            }
            catch {

                alert(
                    "Có lỗi xảy ra"
                );
            }
        };

    const handleEdit =
        (promotion) => {

            setEditing(
                promotion
            );

            setForm({

                name:
                    promotion.name,

                description:
                    promotion.description,

                discountPercent:
                    promotion.discountPercent,

                startDate:
                    promotion.startDate
                        ?.substring(0, 10),

                endDate:
                    promotion.endDate
                        ?.substring(0, 10),

                isActive:
                    promotion.isActive,

                bookIds:
                    promotion.bookIds || [],

                categoryIds:
                    promotion.categoryIds || []
            });

            setShowModal(true);
        };

    const filtered =
        promotions.filter(p =>
            p.name
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
        );

    const totalPages =
        Math.ceil(
            filtered.length /
            perPage
        );

    const currentData =
        filtered.slice(
            (currentPage - 1) * perPage,
            currentPage * perPage
        );

    return (

        <div className="p-6">

            {/* HEADER */}

            <div
                className="
        flex
        justify-between
        items-center
        mb-6
        "
            >

                <div>

                    <h1
                        className="
            text-3xl
            font-bold
            "
                    >
                        Promotions
                    </h1>

                    <p
                        className="
            text-gray-500
            "
                    >
                        Quản lý khuyến mãi
                    </p>

                </div>

                <button
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                    className="
          flex
          items-center
          gap-2
          bg-blue-600
          text-white
          px-5
          py-3
          rounded-xl
          "
                >
                    <FaPlus />
                    New Promotion
                </button>

            </div>

            {/* SEARCH */}

            <div
                className="
        bg-white
        p-4
        rounded-2xl
        shadow
        mb-6
        "
            >

                <input
                    type="text"
                    placeholder="Search promotion..."
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

                <table
                    className="
          w-full
          "
                >

                    <thead
                        className="
            bg-slate-100
            "
                    >

                        <tr>

                            <th className="p-4">
                                Name
                            </th>

                            <th>
                                Discount
                            </th>

                            <th>
                                Start
                            </th>

                            <th>
                                End
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            currentData.map(
                                p => (
                                    <tr
                                        key={p.id}
                                        className="
                    border-t
                    text-center
                    "
                                    >

                                        <td className="p-4">

                                            <div
                                                className="
                        flex
                        items-center
                        gap-2
                        "
                                            >
                                                <FaTags />

                                                {p.name}
                                            </div>

                                        </td>

                                        <td>

                                            {p.discountPercent}%

                                        </td>

                                        <td>

                                            {
                                                new Date(
                                                    p.startDate
                                                )
                                                    .toLocaleDateString()
                                            }

                                        </td>

                                        <td>

                                            {
                                                new Date(
                                                    p.endDate
                                                )
                                                    .toLocaleDateString()
                                            }

                                        </td>

                                        <td>

                                            <span
                                                className={`
                        px-3
                        py-1
                        rounded-full
                        ${p.isActive
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                    }
                        `}
                                            >
                                                {
                                                    p.isActive
                                                        ? "Active"
                                                        : "Disabled"
                                                }
                                            </span>

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
                                                        handleEdit(p)
                                                    }
                                                    className="
                          bg-yellow-500
                          text-white
                          p-2
                          rounded-lg
                          "
                                                >
                                                    <FaEdit />
                                                </button>

                                                <button
                                                    onClick={
                                                        async () => {

                                                            await togglePromotion(
                                                                p.id
                                                            );

                                                            loadData();
                                                        }
                                                    }
                                                    className="
                          bg-indigo-600
                          text-white
                          px-3
                          rounded-lg
                          "
                                                >
                                                    Toggle
                                                </button>

                                                <button
                                                    onClick={
                                                        async () => {

                                                            if (
                                                                window.confirm(
                                                                    "Delete?"
                                                                )
                                                            ) {

                                                                await deletePromotion(
                                                                    p.id
                                                                );

                                                                loadData();
                                                            }
                                                        }
                                                    }
                                                    className="
                          bg-red-500
                          text-white
                          p-2
                          rounded-lg
                          "
                                                >
                                                    <FaTrash />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                )
                            )
                        }

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

            {/* MODAL */}

            {showModal && (

                <div
                    className="
    fixed
    inset-0
    bg-black/50
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
      max-w-6xl
      max-h-[90vh]
      rounded-3xl
      shadow-2xl
      overflow-hidden
      flex
      flex-col
      "
                    >

                        {/* HEADER */}

                        <div
                            className="
        p-6
        border-b
        bg-white
        sticky
        top-0
        z-10
        "
                        >

                            <h2
                                className="
          text-2xl
          font-bold
          "
                            >
                                {editing
                                    ? "Update Promotion"
                                    : "Create Promotion"}
                            </h2>

                        </div>

                        {/* BODY */}

                        <div
                            className="
        flex-1
        overflow-y-auto
        p-6
        "
                        >

                            <div
                                className="
          grid
          lg:grid-cols-2
          grid-cols-1
          gap-6
          "
                            >

                                {/* LEFT */}

                                <div className="space-y-5">

                                    <div>

                                        <label className="font-medium">
                                            Promotion Name
                                        </label>

                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    name: e.target.value
                                                })
                                            }
                                            className="
                w-full
                border
                rounded-xl
                p-3
                mt-2
                "
                                        />

                                    </div>

                                    <div>

                                        <label className="font-medium">
                                            Description
                                        </label>

                                        <textarea
                                            rows="4"
                                            value={form.description}
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    description:
                                                        e.target.value
                                                })
                                            }
                                            className="
                w-full
                border
                rounded-xl
                p-3
                mt-2
                "
                                        />

                                    </div>

                                    <div>

                                        <label className="font-medium">
                                            Discount Percent
                                        </label>

                                        <input
                                            type="number"
                                            min="1"
                                            max="100"
                                            value={
                                                form.discountPercent
                                            }
                                            onChange={(e) =>
                                                setForm({
                                                    ...form,
                                                    discountPercent:
                                                        Number(
                                                            e.target.value
                                                        )
                                                })
                                            }
                                            className="
                w-full
                border
                rounded-xl
                p-3
                mt-2
                "
                                        />

                                    </div>

                                    <div
                                        className="
              grid
              grid-cols-2
              gap-4
              "
                                    >

                                        <div>

                                            <label>
                                                Start Date
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    form.startDate
                                                }
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        startDate:
                                                            e.target.value
                                                    })
                                                }
                                                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  mt-2
                  "
                                            />

                                        </div>

                                        <div>

                                            <label>
                                                End Date
                                            </label>

                                            <input
                                                type="date"
                                                value={
                                                    form.endDate
                                                }
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        endDate:
                                                            e.target.value
                                                    })
                                                }
                                                className="
                  w-full
                  border
                  rounded-xl
                  p-3
                  mt-2
                  "
                                            />

                                        </div>

                                    </div>

                                    <div>

                                        <label
                                            className="
                flex
                items-center
                gap-3
                "
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    form.isActive
                                                }
                                                onChange={(e) =>
                                                    setForm({
                                                        ...form,
                                                        isActive:
                                                            e.target.checked
                                                    })
                                                }
                                            />

                                            Active Promotion

                                        </label>

                                    </div>

                                </div>

                                {/* RIGHT */}

                                <div className="space-y-6">

                                    {/* BOOKS */}

                                    <div>

                                        <h3
                                            className="
                font-bold
                text-lg
                mb-3
                "
                                        >
                                            Books
                                        </h3>

                                        <div
                                            className="
                border
                rounded-xl
                h-[300px]
                overflow-y-auto
                p-3
                bg-slate-50
                "
                                        >

                                            {books.map(book => (

                                                <label
                                                    key={book.id}
                                                    className="
                    flex
                    items-center
                    gap-3
                    py-2
                    "
                                                >

                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            form.bookIds.includes(
                                                                book.id
                                                            )
                                                        }
                                                        onChange={(e) => {

                                                            if (
                                                                e.target.checked
                                                            ) {

                                                                setForm({
                                                                    ...form,
                                                                    bookIds: [
                                                                        ...form.bookIds,
                                                                        book.id
                                                                    ]
                                                                });

                                                            }
                                                            else {

                                                                setForm({
                                                                    ...form,
                                                                    bookIds:
                                                                        form.bookIds.filter(
                                                                            x =>
                                                                                x !==
                                                                                book.id
                                                                        )
                                                                });

                                                            }

                                                        }}
                                                    />

                                                    {book.title}

                                                </label>

                                            ))}

                                        </div>

                                    </div>

                                    {/* CATEGORIES */}

                                    <div>

                                        <h3
                                            className="
                font-bold
                text-lg
                mb-3
                "
                                        >
                                            Categories
                                        </h3>

                                        <div
                                            className="
                border
                rounded-xl
                h-[250px]
                overflow-y-auto
                p-3
                bg-slate-50
                "
                                        >

                                            {categories.map(
                                                category => (

                                                    <label
                                                        key={
                                                            category.id
                                                        }
                                                        className="
                      flex
                      items-center
                      gap-3
                      py-2
                      "
                                                    >

                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                form.categoryIds.includes(
                                                                    category.id
                                                                )
                                                            }
                                                            onChange={(
                                                                e
                                                            ) => {

                                                                if (
                                                                    e.target.checked
                                                                ) {

                                                                    setForm({
                                                                        ...form,
                                                                        categoryIds: [
                                                                            ...form.categoryIds,
                                                                            category.id
                                                                        ]
                                                                    });

                                                                }
                                                                else {

                                                                    setForm({
                                                                        ...form,
                                                                        categoryIds:
                                                                            form.categoryIds.filter(
                                                                                x =>
                                                                                    x !==
                                                                                    category.id
                                                                            )
                                                                    });

                                                                }

                                                            }}
                                                        />

                                                        {category.name}

                                                    </label>

                                                )
                                            )}

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* FOOTER */}

                        <div
                            className="
        border-t
        p-5
        flex
        justify-end
        gap-3
        bg-white
        "
                        >

                            <button
                                onClick={() =>
                                    setShowModal(false)
                                }
                                className="
          px-6
          py-3
          border
          rounded-xl
          "
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSave}
                                className="
          px-6
          py-3
          bg-blue-600
          text-white
          rounded-xl
          "
                            >
                                {editing
                                    ? "Update"
                                    : "Create"}
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminPromotionPage;