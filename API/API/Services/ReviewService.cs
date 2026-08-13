using API.Datas;
using API.DTO;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;

        public ReviewService(
            AppDbContext context)
        {
            _context = context;
        }

        public async Task<string> CreateReview(
            CreateReviewDTO dto,
            ClaimsPrincipal user)
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                throw new Exception(
                    "User not found"
                );
            }

            var hasPurchased =
                await _context.OrderItems
                .AnyAsync(x =>
                    x.BookId == dto.BookId &&
                    x.Order.UserId == dbUser.Id &&
                    x.Order.Status == "Completed"
                );

            if (!hasPurchased)
            {
                throw new Exception(
                    "Bạn phải mua sách trước khi đánh giá"
                );
            }

            var existedReview =
                await _context.Reviews
                .FirstOrDefaultAsync(x =>
                    x.BookId == dto.BookId &&
                    x.UserId == dbUser.Id
                );

            if (existedReview != null)
            {
                existedReview.Rating =
                    dto.Rating;

                existedReview.Comment =
                    dto.Comment;

                existedReview.CreatedAt =
                    DateTime.Now;

                await _context.SaveChangesAsync();

                return "Đã cập nhật đánh giá";
            }

            var review = new Review
            {
                UserId = dbUser.Id,
                BookId = dto.BookId,
                Rating = dto.Rating,
                Comment = dto.Comment
            };

            _context.Reviews.Add(review);

            await _context.SaveChangesAsync();

            return "Đánh giá thành công";
        }

        public async Task<List<ReviewDTO>>
            GetReviews(int bookId)
        {
            return await _context.Reviews
                .Where(x =>
                    x.BookId == bookId
                )
                .Include(x => x.User)
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Select(x =>
                    new ReviewDTO
                    {
                        Id = x.Id,
                        UserId = x.UserId,
                        BookId = x.BookId,
                        UserName =
                            x.User.FullName,
                        Rating = x.Rating,
                        Comment = x.Comment,
                        CreatedAt =
                            x.CreatedAt
                    })
                .ToListAsync();
        }

        public async Task<bool> CanReview(
            int bookId,
            ClaimsPrincipal user)
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                return false;
            }

            var hasPurchased =
                await _context.OrderItems
                .AnyAsync(x =>
                    x.BookId == bookId &&
                    x.Order.UserId == dbUser.Id &&
                    x.Order.Status == "Completed"
                );

            if (!hasPurchased)
            {
                return false;
            }

            var hasReviewed =
                await _context.Reviews
                .AnyAsync(x =>
                    x.BookId == bookId &&
                    x.UserId == dbUser.Id
                );

            return !hasReviewed;
        }

        public async Task<string> DeleteReview(
            int reviewId,
            ClaimsPrincipal user)
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            var review =
                await _context.Reviews
                .FirstOrDefaultAsync(
                    x =>
                        x.Id == reviewId &&
                        x.UserId == dbUser.Id
                );

            if (review == null)
            {
                throw new Exception(
                    "Review not found"
                );
            }

            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();

            return "Xóa đánh giá thành công";
        }

        public async Task<List<ReviewDTO>>
            GetAllReviews()
        {
            return await _context.Reviews
                .Include(x => x.User)
                .Include(x => x.Book)
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Select(x =>
                    new ReviewDTO
                    {
                        Id = x.Id,
                        UserId = x.UserId,
                        BookId = x.BookId,
                        UserName =
                            x.User.FullName,
                        Rating = x.Rating,
                        Comment = x.Comment,
                        CreatedAt =
                            x.CreatedAt
                    })
                .ToListAsync();
        }

        public async Task<string>
            AdminDeleteReview(
                int reviewId)
        {
            var review =
                await _context.Reviews
                .FirstOrDefaultAsync(
                    x => x.Id == reviewId
                );

            if (review == null)
            {
                throw new Exception(
                    "Review not found"
                );
            }

            _context.Reviews.Remove(review);

            await _context.SaveChangesAsync();

            return "Admin xóa review thành công";
        }
    }
}