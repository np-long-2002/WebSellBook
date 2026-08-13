import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
}
from "recharts";

function RevenueChart({
  data
}) {

  return (

    <div
      className="
      bg-white
      rounded-2xl
      p-6
      shadow-sm
      border
      "
    >

      <h2
        className="
        font-bold
        text-xl
        mb-5
        "
      >
        Revenue
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <AreaChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2563eb"
            fill="#93c5fd"
          />

        </AreaChart>

      </ResponsiveContainer>

    </div>

  );
}

export default RevenueChart;