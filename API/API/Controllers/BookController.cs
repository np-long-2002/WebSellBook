using API.DTO;
using API.Services;
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
        [HttpPost]
        public async Task<IActionResult> Create(BookDTO book)
        {
            var createdBook = await _bookService.Create(book);
            return Ok(createdBook);
        }
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
    }
}
