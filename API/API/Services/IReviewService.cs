using API.DTO;
using System.Security.Claims;

namespace API.Services
{
    public interface IReviewService
    {
        Task<string> CreateReview(
            CreateReviewDTO dto,
            ClaimsPrincipal user);

        Task<List<ReviewDTO>> GetReviews(
            int bookId);

        Task<bool> CanReview(
            int bookId,
            ClaimsPrincipal user);

        Task<string> DeleteReview(
            int reviewId,
            ClaimsPrincipal user);

        Task<List<ReviewDTO>> GetAllReviews();

        Task<string> AdminDeleteReview(
            int reviewId);
    }
}