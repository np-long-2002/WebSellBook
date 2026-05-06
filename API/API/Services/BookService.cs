using API.Datas;
using API.DTO;
using API.Models;
using System.Security.AccessControl;

namespace API.Services
{
    public class BookService : IBookService
    {
        private readonly AppDbContext _context;

        public BookService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<BookDTO> Create(BookDTO book)
        {
            _context.Books.Add(new Book
            {
                Title = book.Title,
                Description = book.Description,
                Price = book.Price,
                Stock = book.Stock,
                AuthorId = book.AuthorId,
                CategoryId = book.CategoryId,
                ImageUrl = book.ImageUrl
            });
            await _context.SaveChangesAsync();
            return new BookDTO
            {
                Id = book.Id,
                Title = book.Title,
                Description = book.Description,
                Price = book.Price,
                Stock = book.Stock,
                AuthorId = book.AuthorId,
                CategoryId = book.CategoryId,
                ImageUrl = book.ImageUrl
            };
        }

        public async Task<bool> Delete(int id)
        {
            var _book = _context.Books.FirstOrDefault(b => b.Id == id);
            if (_book == null)
            {
                return false;
            }
            _context.Books.Remove(_book);
            await _context.SaveChangesAsync();
            return true;
        }

        public Task<IEnumerable<BookDTO>> GetAll()
        {
            return Task.FromResult(_context.Books.Select(b => new BookDTO
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                Price = b.Price,
                Stock = b.Stock,
                AuthorId = b.AuthorId,
                CategoryId = b.CategoryId,
                ImageUrl = b.ImageUrl
            }).AsEnumerable());
        }

        public async Task<BookDTO?> GetById(int id)
        {
            var _book = _context.Books.FirstOrDefault(b => b.Id == id);
            if (_book == null)
            {
                return null;
            }
            return new BookDTO
            {
                Id = _book.Id,
                Title = _book.Title,
                Description = _book.Description,
                Price = _book.Price,
                Stock = _book.Stock,
                AuthorId = _book.AuthorId,
                CategoryId = _book.CategoryId,
                ImageUrl = _book.ImageUrl
            };
        }

        public async Task<BookDTO?> Update(int id, BookDTO book)
        {
            var _book = _context.Books.FirstOrDefault(b => b.Id == id);
            if (_book == null)
            {
                return null;
            }
            _book.Title = book.Title;
            _book.Description = book.Description;
            _book.Price = book.Price;
            _book.Stock = book.Stock;
            _book.AuthorId = book.AuthorId;
            _book.CategoryId = book.CategoryId;
            _book.ImageUrl = book.ImageUrl;
            await _context.SaveChangesAsync();
            return new BookDTO
            {
                Id = _book.Id,
                Title = _book.Title,
                Description = _book.Description,
                Price = _book.Price,
                Stock = _book.Stock,
                AuthorId = _book.AuthorId,
                CategoryId = _book.CategoryId,
                ImageUrl = _book.ImageUrl
            };
        }
    }
}
