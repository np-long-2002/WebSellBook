import { useEffect, useState } from "react";
import HeroBanner from "../components/HeroBanner";
import CategorySidebar from "../components/CategorySidebar";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import { getBooks } from "../services/bookService";

function HomePage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const booksPerPage = 20;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // Filter books by category
  let filteredBooks =
    selectedCategory === null
      ? books
      : books.filter((book) => book.categoryId === selectedCategory);

  // Sort books
  if (sortBy === "latest") {
    filteredBooks = [...filteredBooks].sort((a, b) => b.id - a.id);
  } else if (sortBy === "price-low") {
    filteredBooks = [...filteredBooks].sort((a, b) => (a.finalPrice || a.price) - (b.finalPrice || b.price));
  } else if (sortBy === "price-high") {
    filteredBooks = [...filteredBooks].sort((a, b) => (b.finalPrice || b.price) - (a.finalPrice || a.price));
  } else if (sortBy === "rating") {
    filteredBooks = [...filteredBooks].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  }

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-600 bg-clip-text text-transparent mb-2">
                Khám Phá Thế Giới Sách
              </h1>
              <p className="text-slate-600 text-lg">
                Tìm kiếm hơn {books.length} đầu sách từ các tác giả nổi tiếng thế giới
              </p>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filter */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-6">
              {/* Category Filter */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <CategorySidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(id) => {
                    setSelectedCategory(id);
                    setCurrentPage(1);
                  }}
                />
              </div>

              {/* Sort & Filter Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-4">
                <p className="text-sm font-semibold text-slate-700 mb-2">📊 Kết quả</p>
                <p className="text-2xl font-bold text-blue-600">{filteredBooks.length}</p>
                <p className="text-xs text-slate-600 mt-1">sách được tìm thấy</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-700">Sắp xếp theo:</span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-slate-300 transition-colors cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="latest">Mới nhất</option>
                  <option value="price-low">Giá: Thấp → Cao</option>
                  <option value="price-high">Giá: Cao → Thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
              <div className="text-xs text-slate-500">
                {selectedCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentPage(1);
                    }}
                    className="text-blue-600 hover:text-blue-700 font-medium underline"
                  >
                    Xóa bộ lọc
                  </button>
                )}
              </div>
            </div>

            {/* Books Grid or Loading/Empty State */}
            {loading ? (
              <div className="flex justify-center items-center py-48">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <div className="w-8 h-8 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                  <p className="text-slate-600 font-medium">Đang tải sách...</p>
                </div>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-24 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full">
                    <span className="text-3xl">📚</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy sách</h3>
                <p className="text-slate-500">Thử thay đổi bộ lọc hoặc tìm kiếm từ khóa khác</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                  className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Xem tất cả sách
                </button>
              </div>
            ) : (
              <>
                {/* Books Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {currentBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      image={book.imageUrl}
                      title={book.title}
                      price={book.finalPrice}
                      stock={book.availableStock}
                      discountPercent={book.discountPercent}
                      finalPrice={book.finalPrice}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer Spacer */}
      <div className="h-8"></div>
    </div>
  );
}

export default HomePage;