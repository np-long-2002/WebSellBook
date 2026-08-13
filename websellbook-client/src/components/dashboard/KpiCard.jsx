import {
  TrendingUp,
  ShoppingCart,
  Users,
  BookOpen
} from "lucide-react";

const icons = {
  revenue: TrendingUp,
  orders: ShoppingCart,
  users: Users,
  books: BookOpen
};

function KpiCard({
  title,
  value,
  type
}) {

  const Icon = icons[type];

  return (
    <div
      className="
      bg-white
      rounded-2xl
      shadow-sm
      border
      p-6
      "
    >
      <div
        className="
        flex
        justify-between
        items-center
        "
      >
        <div>
          <p className="text-gray-500">
            {title}
          </p>

          <h2
            className="
            text-3xl
            font-bold
            mt-2
            "
          >
            {value}
          </h2>
        </div>

        <Icon size={38} />
      </div>
    </div>
  );
}

export default KpiCard;