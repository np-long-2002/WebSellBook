import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { getBookById } from '../services/bookService';
import { getReviews, canReview } from '../services/reviewService';
import { getUserInfo } from '../utils/jwtUtils';
import BookDetailsSection from '../components/BookDetailsSection';
import BookDescriptionSection from '../components/BookDescriptionSection';
import ReviewsSection from '../components/ReviewsSection';
import PdfModal from '../components/PdfModal';
import noBook from '../assets/nobook.png';
import api from '../services/api';

/**
 * BookDetailPage - Main page for displaying book details
 */
function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCartWithQuantity } = useContext(CartContext);

  // State
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [canUserReview, setCanUserReview] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showPdf, setShowPdf] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load reviews
  const loadReviews = async () => {
    try {
      const data = await getReviews(id);
      setReviews(data);
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  // Check if user can review
  const checkCanReview = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const result = await canReview(id);
      setCanUserReview(result);
    } catch (error) {
      console.error('Failed to check review permission:', error);
    }
  };

  // Load book data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const bookData = await getBookById(id);
        setBook(bookData);
        await loadReviews();
        await checkCanReview();
        setCurrentUser(getUserInfo());
      } catch (error) {
        console.error('Failed to load book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <p className="text-2xl font-bold text-gray-700">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Book not found
  if (!book) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-2xl font-bold text-gray-700">Không tìm thấy sách</p>
        </div>
      </div>
    );
  }

  // Get image URL with fallback
 const API_URL = "https://websellbook-production.up.railway.app";

const imageUrl = book?.imageUrl || noBook;
const previewUrl = book?.previewFileUrl
  ? book.previewFileUrl.startsWith("http")
    ? book.previewFileUrl
    : `${API_URL}/${book.previewFileUrl.replace(/^\/+/, "")}`
  : null;
  // Handle add to cart
  const handleAddToCart = (bookItem, quantity) => {
    addToCartWithQuantity(bookItem, quantity);
    alert(`Đã thêm ${quantity} cuốn vào giỏ hàng`);
  };

  // Handle buy now
  const handleBuyNow = (bookItem, quantity) => {
    addToCartWithQuantity(bookItem, quantity);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Book Details Section */}
        <BookDetailsSection
          book={book}
          imageUrl={imageUrl}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
        />

        {/* Preview Button */}
        {book.previewFileUrl && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setShowPdf(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition shadow-lg"
            >
              📖 Xem bản xem trước
            </button>
          </div>
        )}

        {/* Description Section */}
        <BookDescriptionSection description={book.description} />

        {/* Reviews Section */}
        <ReviewsSection
          bookId={book.id}
          reviews={reviews}
          canUserReview={canUserReview}
          currentUser={currentUser}
          onReviewsChange={loadReviews}
        />
      </div>

      {/* PDF Preview Modal */}
  <PdfModal
  isOpen={showPdf}
  onClose={() => setShowPdf(false)}
  pdfUrl={previewUrl}
/>
    </div>
  );
}

export default BookDetailPage;
