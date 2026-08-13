

/**
 * BookDescriptionSection - Displays book description
 */
function BookDescriptionSection({ description }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg mt-8 p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Mô tả sản phẩm</h2>
      <p className="text-gray-700 leading-8 text-base">
        {description}
      </p>
    </div>
  );
}

export default BookDescriptionSection;
