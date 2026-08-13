using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : Controller
    {
        private readonly IBookService _bookService;

        public BookController(IBookService bookService)
        {
            _bookService = bookService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var books = await _bookService.GetAll();
            return Ok(books);
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookId(int id)
        {
            var book = await _bookService.GetById(id);
            if (book == null)
            {
                return NotFound();
            }
            return Ok(book);
        }
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(BookDTO book)
        {
            var createdBook = await _bookService.Create(book);
            return Ok(createdBook);
        }
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, BookDTO book)
        {
            var updatedBook = await _bookService.Update(id, book);
            if (updatedBook == null)
            {
                return NotFound();
            }
            return Ok(updatedBook);
        }
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _bookService.Delete(id);
            if (!deleted)
            {
                return NotFound();
            }
            return NoContent();
        }
        [HttpGet("{id}/preview")]
        public async Task<IActionResult> GetPreview(int id)
        {
            var url =
                await _bookService.GetPreviewFileUrl(id);

            if (url == null)
                return NotFound();

            return Ok(url);
        }

        [Authorize]
        [HttpPost("upload-image")]
        public async Task<IActionResult> UploadImage(IFormFile file)
        {
            var imageUrl =
                await _bookService.UploadImage(file);

            return Ok(new
            {
                imageUrl
            });
        }

        [Authorize]
        [HttpPost("upload-preview")]
        public async Task<IActionResult> UploadPreview(IFormFile file)
        {
            var previewUrl = await _bookService.UploadPreview(file);

            return Ok(new
            {
                previewUrl
            });
        }
    }
}
