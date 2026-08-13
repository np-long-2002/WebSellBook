import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import noBook from "../assets/nobook.png";

function BookCard({
  id,
  image,
  title,
  price,
  finalPrice,
  discountPercent,
  stock,
  averageRating,
  reviewCount
}) {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const isDiscount = discountPercent > 0;
  const isOutOfStock = stock <= 0;
  const imageUrl = !image
    ? noBook
    : image.startsWith("http")
      ? image
      : `http://localhost:5000/${image.replace(/^\/+/, "")}`;

  const rating = averageRating || 0;
  const reviewsCount = reviewCount || 0;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full flex flex-col group">
      {/* Image Container */}
      <div
        className="relative cursor-pointer overflow-hidden bg-slate-100 h-64"
        onClick={() => navigate(`/book/${id}`)}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {isDiscount && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
            -{discountPercent}%
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold text-sm">
              Hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title */}
        <h3
          onClick={() => navigate(`/book/${id}`)}
          className="font-semibold text-slate-800 line-clamp-2 h-[48px] cursor-pointer hover:text-blue-600 transition text-sm"
        >
          {title}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mt-2 mb-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={14}
                className={i < Math.round(rating) ? "text-yellow-400" : "text-slate-300"}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">
            ({reviewsCount} đánh giá)
          </span>
        </div>

        {/* Price Section */}
        <div className="mb-4">
          {isDiscount ? (
            <>
              <div className="text-red-600 text-lg font-bold">
                {finalPrice?.toLocaleString("vi-VN")}₫
              </div>
              <div className="text-xs text-slate-400 line-through">
                {price?.toLocaleString("vi-VN")}₫
              </div>
            </>
          ) : (
            <div className="text-red-600 text-lg font-bold">
              {price?.toLocaleString("vi-VN")}₫
            </div>
          )}
        </div>

        {/* Stock Info */}
        <div className="text-xs text-slate-500 mb-4">
          Còn lại: <span className="font-semibold text-slate-700">{stock}</span>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => navigate(`/book/${id}`)}
            className="flex-1 py-2.5 rounded-lg border-2 border-blue-200 text-blue-600 font-medium hover:bg-blue-50 transition duration-200 text-sm"
          >
            Chi tiết
          </button>

          <button
            disabled={isOutOfStock}
            onClick={() =>
              addToCart({
                id,
                image,
                title,
                price: finalPrice || price
              })
            }
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition duration-200 text-sm ${
              isOutOfStock
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            <FaShoppingCart size={16} />
            {isOutOfStock ? "Hết hàng" : "Mua"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookCard;