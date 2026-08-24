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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Banner */}
      <div className="pt-24 pb-12">
      <HeroBanner />
            </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Content Layout: Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filter */}
          <aside className="w-full lg:w-64 shrink-0">
            <div className="sticky top-28 bg-white/50 backdrop-blur-xl p-6 rounded-3xl border border-white/50 shadow-sm">
              <CategorySidebar
                  selectedCategory={selectedCategory}
                  setSelectedCategory={(id) => {
                    setSelectedCategory(id);
                    setCurrentPage(1);
                  }}
                />
              </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                Top Picks
              </h1>
              <select
                value={sortBy}
                onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="latest">Mới nhất</option>
                <option value="price-low">Giá: Thấp tới cao</option>
                <option value="price-high">Giá: Cao tới thấp</option>
                  <option value="rating">Đánh giá cao</option>
                </select>
              </div>
                {/* Books Grid */}
            {loading ? (
              <div className="flex justify-center items-center py-48">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
            ) : filteredBooks.length === 0 ? (
              <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-slate-200 py-24 text-center">
                <h3 className="text-xl font-bold text-slate-800">Không tìm thấy sách</h3>
          </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                  {currentBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      id={book.id}
                      image={book.imageUrl}
                      title={book.title}
                      price={book.price}
                      finalPrice={book.finalPrice}
                      stock={book.availableStock}
                      discountPercent={book.discountPercent}
                      averageRating={book.averageRating}
                      reviewCount={book.reviewCount}
                    />
                  ))}
      </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
    </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default HomePage;