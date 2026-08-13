import { useState } from 'react';
import {
  createReview,
  updateReview,
  deleteReview,
  hideReview,
} from '../services/reviewService';

/**
 * ReviewForm - Form component for creating/editing reviews
 */
function ReviewForm({ onSubmit, initialRating = 5, initialComment = '', submitLabel = 'Gửi đánh giá' }) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('Vui lòng nhập bình luận');
      return;
    }
    setLoading(true);
    try {
      await onSubmit(rating, comment);
      setRating(5);
      setComment('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-2xl p-6 mb-6 bg-slate-50">
      <h3 className="font-bold mb-4 text-gray-900">
        {submitLabel === 'Gửi đánh giá' ? 'Viết đánh giá' : 'Sửa đánh giá'}
      </h3>

      <select
        value={rating}
        onChange={(e) => setRating(Number(e.target.value))}
        className="w-full border border-gray-300 p-3 rounded-xl mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      >
        <option value={5}>⭐⭐⭐⭐⭐ - Tuyệt vời</option>
        <option value={4}>⭐⭐⭐⭐ - Rất tốt</option>
        <option value={3}>⭐⭐⭐ - Tốt</option>
        <option value={2}>⭐⭐ - Bình thường</option>
        <option value={1}>⭐ - Không tốt</option>
      </select>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Chia sẻ kinh nghiệm sử dụng sách này..."
        className="w-full border border-gray-300 p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
        rows="4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold transition"
      >
        {loading ? 'Đang gửi...' : submitLabel}
      </button>
    </div>
  );
}



/**
 * ReviewItem - Individual review display and edit
 */
function ReviewItem({ review, currentUser, onEdit, onDelete, onAdminDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editRating, setEditRating] = useState(review.rating);
  const [editComment, setEditComment] = useState(review.comment);
  const [loading, setLoading] = useState(false);

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await onEdit(review.id, editRating, editComment);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const isOwnReview = currentUser?.id === review.userId;
  const isAdmin = currentUser?.role === 'Admin';

  if (isEditing) {
    return (
      <div className="border rounded-2xl p-6 mb-4 bg-slate-50">
        <h4 className="font-bold mb-4 text-gray-900">Sửa đánh giá</h4>

        <select
          value={editRating}
          onChange={(e) => setEditRating(Number(e.target.value))}
          className="w-full border border-gray-300 p-3 rounded-xl mb-4 bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>

        <textarea
          value={editComment}
          onChange={(e) => setEditComment(e.target.value)}
          placeholder="Nhận xét..."
          className="w-full border border-gray-300 p-4 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          rows="4"
        />

        <div className="flex gap-3">
          <button
            onClick={handleSaveEdit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-xl font-semibold transition"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-xl font-semibold transition"
          >
            Hủy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b pb-6 mb-6 last:border-b-0">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold text-gray-900">{review.userName}</h4>
          <div className="text-yellow-500 mt-1">
            {'⭐'.repeat(review.rating)}
          </div>
          <p className="text-gray-600 mt-2">{review.comment}</p>
        </div>

        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-gray-500">
            {new Date(review.createdAt).toLocaleDateString('vi-VN')}
          </span>

          {isOwnReview && (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Sửa
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
                    onDelete(review.id);
                  }
                }}
                className="text-red-600 hover:underline text-sm font-medium"
              >
                Xóa
              </button>
            </div>
          )}

          {isAdmin && !isOwnReview && (
            <button
              onClick={() => {
                if (window.confirm('Bạn có chắc muốn xóa đánh giá này?')) {
                  onAdminDelete(review.id);
                }
              }}
              className="text-red-600 hover:underline text-sm font-medium"
            >
              🗑️ Xóa
            </button>
          )}
        </div>
      </div>
    </div>
  );
}



/**
 * ReviewsSection - Displays all reviews and review form
 */
function ReviewsSection({ bookId, reviews, canUserReview, currentUser, onReviewsChange }) {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [loading, setLoading] = useState(false);

  const handleCreateReview = async (rating, comment) => {
    setLoading(true);
    try {
      await createReview(bookId, rating, comment);
      alert('Đánh giá thành công');
      onReviewsChange();
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể tạo đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateReview = async (reviewId, rating, comment) => {
    try {
      await updateReview(reviewId, rating, comment);
      alert('Cập nhật đánh giá thành công');
      onReviewsChange();
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể cập nhật đánh giá');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      alert('Xóa đánh giá thành công');
      onReviewsChange();
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể xóa đánh giá');
    }
  };

  const handleAdminDeleteReview = async (reviewId) => {
    try {
      await hideReview(reviewId);
      alert('Xóa đánh giá thành công');
      onReviewsChange();
    } catch (error) {
      alert(error.response?.data?.message || 'Không thể xóa đánh giá');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg mt-8 p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Đánh giá từ khách hàng</h2>

      {/* Review Form */}
      {canUserReview && (
        <ReviewForm
          onSubmit={handleCreateReview}
          submitLabel="Gửi đánh giá"
        />
      )}

      {/* Reviews List */}
      {localReviews.length === 0 ? (
        <div className="text-center text-gray-500 py-12">
          <p className="text-lg">Chưa có đánh giá nào</p>
          <p className="text-sm mt-2">Hãy là người đầu tiên đánh giá sách này</p>
        </div>
      ) : (
        <div className="space-y-6">
          {localReviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              currentUser={currentUser}
              onEdit={handleUpdateReview}
              onDelete={handleDeleteReview}
              onAdminDelete={handleAdminDeleteReview}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsSection;
