using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ReviewController
        : ControllerBase
    {
        private readonly IReviewService
            _reviewService;

        public ReviewController(
            IReviewService reviewService)
        {
            _reviewService =
                reviewService;
        }

        [HttpGet("book/{bookId}")]
        public async Task<IActionResult>
            GetReviews(int bookId)
        {
            return Ok(
                await _reviewService
                .GetReviews(bookId)
            );
        }

        [Authorize]
        [HttpGet(
            "can-review/{bookId}")]
        public async Task<IActionResult>
            CanReview(int bookId)
        {
            return Ok(
                await _reviewService
                .CanReview(
                    bookId,
                    User
                )
            );
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult>
            CreateReview(
                CreateReviewDTO dto)
        {
            return Ok(
                await _reviewService
                .CreateReview(
                    dto,
                    User
                )
            );
        }

        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult>
            DeleteReview(int id)
        {
            return Ok(
                await _reviewService
                .DeleteReview(
                    id,
                    User
                )
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public async Task<IActionResult>
            GetAllReviews()
        {
            return Ok(
                await _reviewService
                .GetAllReviews()
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete(
            "admin/{id}")]
        public async Task<IActionResult>
            AdminDeleteReview(
                int id)
        {
            return Ok(
                await _reviewService
                .AdminDeleteReview(id)
            );
        }
    }
}