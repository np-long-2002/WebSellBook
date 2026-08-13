import { useState } from 'react';

/**
 * BookDetailsSection - Displays book information, pricing, and purchase controls
 */
function BookDetailsSection({ book, imageUrl, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);

  const hasDiscount = book.discountPercent > 0;
  const displayPrice = book.finalPrice || book.price;
  const isOutOfStock = book.availableStock <= 0;

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, Math.min(quantity + change, book.availableStock));
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    onAddToCart({
      id: book.id,
      title: book.title,
      price: displayPrice,
      image: imageUrl,
    }, quantity);
  };

  const handleBuyNow = () => {
    onBuyNow({
      id: book.id,
      title: book.title,
      price: displayPrice,
      image: imageUrl,
    }, quantity);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 grid lg:grid-cols-2 gap-10">
      {/* Book Image */}
      <div>
        <img
          src={imageUrl}
          alt={book.title}
          className="w-full h-[650px] object-cover rounded-3xl shadow-md"
        />
      </div>

      {/* Book Information */}
      <div>
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="inline-block bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
            -{book.discountPercent}%
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold mt-5 text-gray-900">
          {book.title}
        </h1>

        {/* Rating and Reviews Count */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-yellow-500 text-lg">
            {'⭐'.repeat(Math.round(book.averageRating || 0))}
          </span>
          <span className="text-gray-500 text-sm">
            ({book.reviewCount || 0} đánh giá)
          </span>
        </div>

        {/* Pricing */}
        <div className="mt-6">
          {hasDiscount ? (
            <>
              <p className="text-red-500 text-4xl font-bold">
                {displayPrice?.toLocaleString('vi-VN')}₫
              </p>
              <div className="flex gap-4 items-center mt-2">
                <span className="line-through text-gray-400 text-lg">
                  {book.price?.toLocaleString('vi-VN')}₫
                </span>
                <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm font-semibold">
                  -{book.discountPercent}%
                </span>
              </div>
            </>
          ) : (
            <p className="text-red-500 text-4xl font-bold">
              {displayPrice?.toLocaleString('vi-VN')}₫
            </p>
          )}
        </div>

        {/* Stock Status */}
        <div className="mt-6 space-y-2">
          {isOutOfStock ? (
            <p className="text-red-600 font-semibold text-lg">
              ❌ Hết hàng
            </p>
          ) : (
            <p className="text-green-600 font-semibold text-lg">
              ✅ Còn {book.availableStock} sản phẩm
            </p>
          )}
        </div>

        {/* Quantity Selector */}
        <div className="mt-8">
          <p className="font-semibold mb-3 text-gray-700">Số lượng</p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={isOutOfStock}
              className="w-10 h-10 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 rounded-xl font-semibold transition"
            >
              −
            </button>
            <span className="text-xl font-bold min-w-[40px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isOutOfStock}
              className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 rounded-xl font-semibold transition"
            >
              +
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex-1 py-4 rounded-2xl font-semibold transition ${
              isOutOfStock
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
          </button>
          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`flex-1 py-4 rounded-2xl font-semibold transition ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
            }`}
          >
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetailsSection;
