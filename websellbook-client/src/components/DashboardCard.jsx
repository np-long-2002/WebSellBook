function DashboardCard({
  title,
  value,
  icon,
  color
}) {
  return (
    <div
      className="
      bg-white
      rounded-3xl
      p-6
      shadow-sm
      hover:shadow-lg
      transition
      "
    >
      <div className="flex justify-between">

        <div>
          <p className="text-gray-500">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
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
    </div>
  );
}

export default DashboardCard;