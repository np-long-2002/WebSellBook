

import { useEffect, useState } from "react";

import {
getDashboard
} from "../services/dashboardService";

import {
ResponsiveContainer,
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
CartesianGrid,
PieChart,
Pie,
Cell
} from "recharts";

import {
BookOpen,
Users,
ShoppingCart,
DollarSign,
Clock3,
Ticket
} from "lucide-react";

function AdminDashboardPage() {

const [dashboard, setDashboard] =
useState(null);

useEffect(() => {
loadData();
}, []);

const loadData = async () => {


try {

  const data =
    await getDashboard();

  setDashboard(data);

} catch (error) {

  console.log(error);

}


};

if (!dashboard) {


return (
  <div className="p-10">
    Loading...
  </div>
);


}

const pieData = [
{
name: "Books",
value: dashboard.totalBooks
},
{
name: "Users",
value: dashboard.totalUsers
},
{
name: "Orders",
value: dashboard.totalOrders
}
];

const COLORS = [
"#3B82F6",
"#10B981",
"#F59E0B"
];

const pendingOrders =
dashboard.latestOrders?.filter(
x => x.status === "Pending"
) || [];

return ( <div className="space-y-6">


  <div>

    <h1 className="text-4xl font-bold">
      Dashboard
    </h1>

    <p className="text-gray-500 mt-2">
      Tổng quan hệ thống bán sách
    </p>

  </div>

  {/* CARDS */}

  <div className="grid grid-cols-5 gap-6">

  <StatCard
    title="Books"
    value={dashboard.totalBooks}
    icon={<BookOpen size={28} />}
    color="bg-blue-500"
  />

  <StatCard
    title="Users"
    value={dashboard.totalUsers}
    icon={<Users size={28} />}
    color="bg-green-500"
  />

  <StatCard
    title="Orders"
    value={dashboard.totalOrders}
    icon={<ShoppingCart size={28} />}
    color="bg-orange-500"
  />

  <StatCard
    title="Revenue"
    value={
      dashboard.totalRevenue?.toLocaleString("vi-VN") + " ₫"
    }
    icon={<DollarSign size={28} />}
    color="bg-purple-500"
  />

  <StatCard
    title="Vouchers"
    value={
      dashboard.activeVouchers ?? 0
    }
    icon={<Ticket size={28} />}
    color="bg-pink-500"
  />

</div>

  {/* PENDING */}

  <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-6
    "
  >

    <div className="flex items-center gap-3 mb-5">

      <Clock3
        className="text-yellow-500"
      />

      <h2 className="text-xl font-bold">
        Đơn hàng chờ duyệt
      </h2>

    </div>

    {pendingOrders.length === 0 ? (

      <p className="text-gray-500">
        Không có đơn hàng chờ duyệt
      </p>

    ) : (

      <div className="space-y-3">

        {pendingOrders.map(order => (

          <div
            key={order.id}
            className="
            flex
            justify-between
            items-center
            border
            rounded-xl
            p-4
            "
          >

            <div>

              <p className="font-semibold">
                #{order.id}
              </p>

              <p className="text-gray-500">
                {order.userName}
              </p>

            </div>

            <div className="text-right">

              <p className="font-bold text-green-600">
                {order.totalAmount?.toLocaleString("vi-VN")}₫
              </p>

              <span
                className="
                bg-yellow-100
                text-yellow-700
                px-3
                py-1
                rounded-full
                text-sm
                "
              >
                Pending
              </span>

            </div>

          </div>

        ))}

      </div>

    )}

  </div>

  {/* CHART */}

  <div className="grid grid-cols-12 gap-6">

    <div
      className="
      col-span-8
      bg-white
      rounded-2xl
      shadow
      p-6
      "
    >

      <h2 className="text-xl font-bold mb-6">
        Revenue By Month
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <BarChart
          data={dashboard.revenueByMonth}
        >

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="revenue"
            radius={[8, 8, 0, 0]}
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

    <div
      className="
      col-span-4
      bg-white
      rounded-2xl
      shadow
      p-6
      "
    >

      <h2 className="text-xl font-bold mb-6">
        System Overview
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <PieChart>

          <Pie
            data={pieData}
            dataKey="value"
            outerRadius={120}
            label
          >

            {pieData.map(
              (entry, index) => (

                <Cell
                  key={index}
                  fill={
                    COLORS[index]
                  }
                />

              )
            )}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  </div>

  {/* LATEST ORDERS */}

  <div
    className="
    bg-white
    rounded-2xl
    shadow
    p-6
    "
  >

    <h2 className="text-xl font-bold mb-5">
      Latest Orders
    </h2>

    <table className="w-full">

      <thead>

        <tr className="border-b">

          <th className="text-left py-3">
            ID
          </th>

          <th className="text-left py-3">
            Customer
          </th>

          <th className="text-left py-3">
            Total
          </th>

          <th className="text-left py-3">
            Status
          </th>

        </tr>

      </thead>

      <tbody>

        {dashboard.latestOrders?.map(
          order => (

            <tr
              key={order.id}
              className="border-b"
            >

              <td className="py-3">
                #{order.id}
              </td>

              <td>
                {order.userName}
              </td>

              <td>
                {order.totalAmount?.toLocaleString("vi-VN")}₫
              </td>

              <td>

                <span
                  className={`
                  px-3
                  py-1
                  rounded-full
                  text-sm
                  ${
                    order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : order.status === "Cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }
                `}
                >
                  {order.status}
                </span>

              </td>

            </tr>

          )
        )}

      </tbody>

    </table>

  </div>

</div>


);
}

function StatCard({
title,
value,
icon,
color
}) {

return (


<div
  className="
  bg-white
  rounded-2xl
  shadow
  p-6
  flex
  justify-between
  items-center
  "
>

  <div>

    <p className="text-gray-500">
      {title}
    </p>

    <h2 className="text-3xl font-bold mt-2">
      {value}
    </h2>

  </div>

  <div
    className={`
    w-14
    h-14
    rounded-xl
    flex
    items-center
    justify-center
    text-white
    ${color}
    `}
  >
    {icon}
  </div>

</div>


);
}

export default AdminDashboardPage;
