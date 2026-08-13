import { useEffect, useMemo, useState } from "react";

import {
getOrders,
updateOrderStatus
} from "../services/orderService";

function AdminOrdersPage() {

const [orders, setOrders] =
useState([]);

const [loading, setLoading] =
useState(true);

const [search, setSearch] =
useState("");

const [statusFilter, setStatusFilter] =
useState("All");

const [currentPage, setCurrentPage] =
useState(1);

const ordersPerPage = 10;

useEffect(() => {
loadOrders();
}, []);

const loadOrders = async () => {


try {

  const data =
    await getOrders();

  const sorted =
    [...data].sort((a, b) => {

      if (
        a.status === "Pending" &&
        b.status !== "Pending"
      )
        return -1;

      if (
        a.status !== "Pending" &&
        b.status === "Pending"
      )
        return 1;

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    });

  setOrders(sorted);

} catch (err) {

  console.log(err);

} finally {

  setLoading(false);

}


};

const handleStatusChange =
async (id, status) => {


  try {

    await updateOrderStatus(
      id,
      status
    );

    setOrders(prev => {

      const updated =
        prev.map(order =>
          order.id === id
            ? {
                ...order,
                status
              }
            : order
        );

      return updated.sort(
        (a, b) => {

          if (
            a.status === "Pending" &&
            b.status !== "Pending"
          )
            return -1;

          if (
            a.status !== "Pending" &&
            b.status === "Pending"
          )
            return 1;

          return (
            new Date(
              b.createdAt
            ) -
            new Date(
              a.createdAt
            )
          );
        }
      );
    });

  } catch (err) {

    console.log(err);

    alert(
      "Không thể cập nhật trạng thái"
    );
  }
};


const filteredOrders =
useMemo(() => {


  return orders.filter(
    order => {

      const matchSearch =
        order.userName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        order.id
          .toString()
          .includes(search);

      const matchStatus =
        statusFilter === "All"
          ? true
          : order.status ===
            statusFilter;

      return (
        matchSearch &&
        matchStatus
      );
    }
  );

}, [
  orders,
  search,
  statusFilter
]);


const indexOfLastOrder =
currentPage *
ordersPerPage;

const indexOfFirstOrder =
indexOfLastOrder -
ordersPerPage;

const currentOrders =
filteredOrders.slice(
indexOfFirstOrder,
indexOfLastOrder
);

const totalPages =
Math.ceil(
filteredOrders.length /
ordersPerPage
);

if (loading)
return ( <div className="p-8">
Loading... </div>
);

return ( <div className="space-y-6">


  <div>

    <h1 className="text-3xl font-bold">
      Order Management
    </h1>

    <p className="text-gray-500 mt-1">
      Total Orders:
      {" "}
      {filteredOrders.length}
    </p>

  </div>

  <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-5
    flex
    gap-4
    "
  >

    <input
      type="text"
      placeholder="Search order..."
      value={search}
      onChange={(e) =>
        setSearch(
          e.target.value
        )
      }
      className="
      flex-1
      border
      rounded-xl
      p-3
      "
    />

    <select
      value={statusFilter}
      onChange={(e) => {

        setStatusFilter(
          e.target.value
        );

        setCurrentPage(1);

      }}
      className="
      border
      rounded-xl
      p-3
      "
    >
      <option value="All">
        All Status
      </option>

      <option value="Pending">
        Pending
      </option>

      <option value="Processing">
        Processing
      </option>

      <option value="Completed">
        Completed
      </option>

      <option value="Cancelled">
        Cancelled
      </option>

    </select>

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

        <tr className="bg-slate-100">

          <th className="p-4 text-left">
            ID
          </th>

          <th className="text-left">
            Customer
          </th>

          <th className="text-left">
            Total
          </th>

          <th className="text-left">
            Date
          </th>

          <th className="text-left">
            Status
          </th>

          <th className="text-center">
            Action
          </th>

        </tr>

      </thead>

      <tbody>

        {currentOrders.map(
          (order) => (

            <tr
              key={order.id}
              className="
              border-t
              hover:bg-slate-50
              "
            >

              <td className="p-4 font-semibold">
                #{order.id}
              </td>

              <td>
                {order.userName}
              </td>

              <td className="font-semibold text-green-600">
                {order.totalAmount?.toLocaleString("vi-VN")}
                ₫
              </td>

              <td>
                {new Date(
                  order.createdAt
                ).toLocaleDateString(
                  "vi-VN"
                )}
              </td>

              <td>

                <span
                  className={`
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium
                    ${
                      order.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "Processing"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "Completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {order.status}
                </span>

              </td>

              <td className="p-4">

                <div className="flex justify-center gap-2">

                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(
                        order.id,
                        e.target.value
                      )
                    }
                    className="
                    border
                    rounded-lg
                    px-3
                    py-2
                    "
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Processing">
                      Processing
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                  {order.status === "Pending" && (

                    <button
                      onClick={() =>
                        handleStatusChange(
                          order.id,
                          "Processing"
                        )
                      }
                      className="
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-3
                      py-2
                      rounded-lg
                      "
                    >
                      Duyệt
                    </button>

                  )}

                  {order.status === "Processing" && (

                    <button
                      onClick={() =>
                        handleStatusChange(
                          order.id,
                          "Completed"
                        )
                      }
                      className="
                      bg-blue-600
                      hover:bg-blue-700
                      text-white
                      px-3
                      py-2
                      rounded-lg
                      "
                    >
                      Hoàn thành
                    </button>

                  )}

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
              ${
                currentPage ===
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

</div>


);
}

export default AdminOrdersPage;
