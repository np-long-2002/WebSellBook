import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
}
from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444"
];

function OrderStatusChart({
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
        Orders Status
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            label
          >

            {data.map(
              (entry,index)=>(
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

  );
}

export default OrderStatusChart;