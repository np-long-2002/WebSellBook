import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../context/CartContext";
import noBook from "../assets/nobook.png";

function BookCard({
  id,
  image,
  title,
  price,
  finalPrice,
  discountPercent,
  stock
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

  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-500 h-full flex flex-col group">
      {/* Image Container */}
      <Link
        to={`/book/${id}`}
        className="relative block overflow-hidden bg-slate-200 h-72 cursor-pointer"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />

        {/* Discount Badge */}
        {isDiscount && (
          <div className="absolute top-4 left-4 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            -{discountPercent}% OFF
          </div>
        )}
      </Link>
      {/* Content Container */}
      <div className="p-6 flex flex-col flex-1">
        <Link
          to={`/book/${id}`}
          className="font-bold text-slate-800 line-clamp-2 h-12 hover:text-indigo-600 transition text-sm block"
        >
          {title}
        </Link>

        {/* Price Section */}
        <div className="mt-4 mb-auto">
          {isDiscount ? (
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-indigo-600">
                {finalPrice?.toLocaleString("vi-VN")}₫
              </span>
              <span className="text-xs text-slate-400 line-through">
                {price?.toLocaleString("vi-VN")}₫
              </span>
            </div>
          ) : (
            <div className="text-xl font-black text-indigo-600">
              {price?.toLocaleString("vi-VN")}₫
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
            disabled={isOutOfStock}
            onClick={() =>
              addToCart({
                id,
                image,
                title,
              price: finalPrice || price,
              })
            }
          className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all duration-300 ${
              isOutOfStock
              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
              : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/30"
            }`}
          >
          <FaShoppingCart />
          {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
        </div>
      </div>
  );
}

export default BookCard;