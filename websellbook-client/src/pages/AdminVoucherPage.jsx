import { useEffect, useState } from "react";

import {
  getVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  toggleVoucher
} from "../services/voucherService";

import Pagination from "../components/Pagination";

function AdminVoucherPage() {

  const [vouchers, setVouchers] =
    useState([]);

  const [filtered, setFiltered] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [editing, setEditing] =
    useState(null);

  const [currentPage, setCurrentPage] =
    useState(1);

  const vouchersPerPage = 10;

  const [form, setForm] =
    useState({
      code: "",
      discountPercent: 10,
      maxDiscountAmount: 50000,
      minOrderAmount: 100000,
      quantity: 100,
      startDate: "",
      expiredAt: ""
    });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {

    const result =
      vouchers.filter(v =>
        v.code
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
      );

    setFiltered(result);

    setCurrentPage(1);

  }, [search, vouchers]);

  const loadData = async () => {

    try {

      const data =
        await getVouchers();

      setVouchers(data);

      setFiltered(data);

    }
    catch (err) {

      console.log(err);

    }

  };

  const resetForm = () => {

    setEditing(null);

    setForm({
      code: "",
      discountPercent: 10,
      maxDiscountAmount: 50000,
      minOrderAmount: 100000,
      quantity: 100,
      startDate: "",
      expiredAt: ""
    });

  };

  const handleSubmit = async () => {

    try {

      if (!form.code.trim()) {

        alert("Voucher code is required");

        return;

      }

      if (editing) {

        await updateVoucher(
          editing.id,
          form
        );

      }
      else {

        await createVoucher(form);

      }

      resetForm();

      loadData();

    }
    catch (err) {

      console.log(err);

      alert("Có lỗi xảy ra");

    }

  };

  const handleEdit = (voucher) => {

    setEditing(voucher);

    setForm({
      code: voucher.code,
      discountPercent:
        voucher.discountPercent,
      maxDiscountAmount:
        voucher.maxDiscountAmount,
      minOrderAmount:
        voucher.minOrderAmount,
      quantity:
        voucher.quantity,
      startDate:
        voucher.startDate?.substring(0, 10) || "",
      expiredAt:
        voucher.expiredAt?.substring(0, 10) || ""
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

  };

  const handleDelete = async (id) => {

    if (
      !window.confirm(
        "Delete voucher?"
      )
    ) {
      return;
    }

    try {

      await deleteVoucher(id);

      loadData();

    }
    catch (err) {

      console.log(err);

    }

  };

  const handleToggle = async (id) => {

    try {

      await toggleVoucher(id);

      loadData();

    }
    catch (err) {

      console.log(err);

    }

  };

  const indexOfLast =
    currentPage *
    vouchersPerPage;

  const indexOfFirst =
    indexOfLast -
    vouchersPerPage;

  const currentVouchers =
    filtered.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages =
    Math.ceil(
      filtered.length /
      vouchersPerPage
    );

  return (

    <div className="space-y-6">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Voucher Management
          </h1>

          <p className="text-gray-500 mt-1">
            Total Vouchers:
            {" "}
            {filtered.length}
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
          {
            editing
              ? "Update Voucher"
              : "Create Voucher"
          }
        </h2>

        <div className="grid grid-cols-2 gap-4">

          <input
            value={form.code}
            placeholder="Voucher Code"
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                code: e.target.value
              })
            }
          />

          <input
            type="number"
            value={form.discountPercent}
            placeholder="% Discount"
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                discountPercent:
                  Number(e.target.value)
              })
            }
          />

          <input
            type="number"
            value={form.maxDiscountAmount}
            placeholder="Max Discount"
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                maxDiscountAmount:
                  Number(e.target.value)
              })
            }
          />

          <input
            type="number"
            value={form.minOrderAmount}
            placeholder="Min Order"
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                minOrderAmount:
                  Number(e.target.value)
              })
            }
          />

          <input
            type="number"
            value={form.quantity}
            placeholder="Quantity"
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                quantity:
                  Number(e.target.value)
              })
            }
          />

          <div />

          <input
            type="date"
            value={form.startDate}
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                startDate:
                  e.target.value
              })
            }
          />

          <input
            type="date"
            value={form.expiredAt}
            className="border p-3 rounded-xl"
            onChange={(e) =>
              setForm({
                ...form,
                expiredAt:
                  e.target.value
              })
            }
          />

        </div>

        <div className="flex gap-3 mt-5">

          <button
            onClick={handleSubmit}
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            px-6
            py-3
            rounded-xl
            "
          >
            {
              editing
                ? "Update"
                : "Create"
            }
          </button>

          {
            editing &&
            (
              <button
                onClick={resetForm}
                className="
                bg-gray-300
                px-6
                py-3
                rounded-xl
                "
              >
                Cancel
              </button>
            )
          }

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
          placeholder="Search Voucher..."
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
                Code
              </th>

              <th>
                Discount
              </th>

              <th>
                Max Discount
              </th>

              <th>
                Quantity
              </th>

              <th>
                Used
              </th>

              <th>
                Status
              </th>

              <th>
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {
              currentVouchers.length === 0
                ? (
                  <tr>

                    <td
                      colSpan="7"
                      className="
                      p-10
                      text-center
                      text-gray-500
                      "
                    >
                      No Voucher Found
                    </td>

                  </tr>
                )
                : (
                  currentVouchers.map(v => (

                    <tr
                      key={v.id}
                      className="
                      border-t
                      hover:bg-slate-50
                      text-center
                      "
                    >

                      <td className="font-semibold p-4">
                        {v.code}
                      </td>

                      <td>
                        {v.discountPercent}%
                      </td>

                      <td>
                        {v.maxDiscountAmount?.toLocaleString("vi-VN")}₫
                      </td>

                      <td>
                        {v.quantity}
                      </td>

                      <td>
                        {v.usedCount}
                      </td>

                      <td>

                        <span
                          className={`
                          px-3
                          py-1
                          rounded-full
                          text-sm
                          ${
                            v.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        `}
                        >
                          {
                            v.isActive
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
                              handleEdit(v)
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
                              handleToggle(v.id)
                            }
                            className="
                            bg-indigo-600
                            hover:bg-indigo-700
                            text-white
                            px-4
                            py-2
                            rounded-lg
                            "
                          >
                            Toggle
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(v.id)
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

                  ))
                )
            }

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

export default AdminVoucherPage;

