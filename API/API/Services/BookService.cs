using API.Datas;
using API.DTO;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.AccessControl;

namespace API.Services
{
    public class BookService : IBookService
    {
        private readonly AppDbContext _context;
        private readonly IPromotionService _promotionService;

        public BookService(
            AppDbContext context,
            IPromotionService promotionService)
        {
            _context = context;
            _promotionService = promotionService;
        }

        public async Task<BookDTO> Create(BookDTO book)
        {
            var newBook = new Book
            {
                Title = book.Title,
                Description = book.Description,
                Price = book.Price,
                Stock = book.Stock,
                AuthorId = book.AuthorId,
                CategoryId = book.CategoryId,
                ImageUrl = book.ImageUrl,
                PreviewFileUrl = book.PreviewFileUrl
            };

            _context.Books.Add(newBook);

            await _context.SaveChangesAsync();

            return new BookDTO
            {
                Id = newBook.Id,
                Title = newBook.Title,
                Description = newBook.Description,
                Price = newBook.Price,
                Stock = newBook.Stock,
                AuthorId = newBook.AuthorId,
                CategoryId = newBook.CategoryId,
                ImageUrl = newBook.ImageUrl,
                PreviewFileUrl = newBook.PreviewFileUrl
            };
        }

        public async Task<bool> Delete(int id)
        {
            var book = _context.Books.FirstOrDefault(b => b.Id == id);

            if (book == null)
            {
                return false;
            }

            _context.Books.Remove(book);

            await _context.SaveChangesAsync();

            return true;
        }
        private async Task<BookDTO> MapBook(Book book)
        {
            var discount =
                await _promotionService
                .GetBestDiscountPercentAsync(book.Id);

            return new BookDTO
            {
                Id = book.Id,

                Title = book.Title,

                Description = book.Description,

                Price = book.Price,

                DiscountPercent = discount,

                FinalPrice =
                    Math.Round(
                        book.Price -
                        (book.Price * discount / 100),
                        0
                    ),

                Stock = book.Stock,

                ReservedStock =
                    book.ReservedStock,

                AvailableStock =
                    book.Stock -
                    book.ReservedStock,

                AuthorId = book.AuthorId,

                CategoryId = book.CategoryId,

                ImageUrl = book.ImageUrl,

                PreviewFileUrl =
                    string.IsNullOrEmpty(book.PreviewFileUrl)
                    ? null
                    : $"http://localhost:5000/{book.PreviewFileUrl}"
            };
        }
        public async Task<IEnumerable<BookDTO>> GetAll()
        {
            var books = await _context.Books.ToListAsync();

            var result = new List<BookDTO>();

            foreach (var book in books)
            {
                result.Add(
                    await MapBook(book)
                );
            }

            return result;
        }
        public async Task<BookDTO?> GetById(int id)
        {
            var book = await _context.Books
                .FirstOrDefaultAsync(x => x.Id == id);

            if (book == null)
                return null;

            return await MapBook(book);
        }
        public async Task<string?> GetPreviewFileUrl(int id)
        {
            var book = _context.Books
                .FirstOrDefault(b => b.Id == id);

            if (book == null)
                return null;

            return book.PreviewFileUrl;
        }

        public async Task<BookDTO?> Update(
            int id,
            BookDTO book
        )
        {
            var dbBook = _context.Books.FirstOrDefault(
                b => b.Id == id
            );

            if (dbBook == null)
            {
                return null;
            }

            dbBook.Title = book.Title;
            dbBook.Description = book.Description;
            dbBook.Price = book.Price;
            dbBook.Stock = book.Stock;
            dbBook.AuthorId = book.AuthorId;
            dbBook.CategoryId = book.CategoryId;
            dbBook.ImageUrl = book.ImageUrl;
            dbBook.PreviewFileUrl = book.PreviewFileUrl;

            await _context.SaveChangesAsync();

            return new BookDTO
            {
                Id = dbBook.Id,
                Title = dbBook.Title,
                Description = dbBook.Description,
                Price = dbBook.Price,
                Stock = dbBook.Stock,
                AuthorId = dbBook.AuthorId,
                CategoryId = dbBook.CategoryId,
                ImageUrl = dbBook.ImageUrl,

                PreviewFileUrl =
                    string.IsNullOrEmpty(dbBook.PreviewFileUrl)
                    ? null
                    : $"http://localhost:5000/{dbBook.PreviewFileUrl}"
            };
        }

        public async Task<string> UploadImage(
    IFormFile file
)
        {
            var uploadsFolder =
                Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "images"
                );

            if (!Directory.Exists(uploadsFolder))
            {
                Directory.CreateDirectory(
                    uploadsFolder
                );
            }

            var fileName =
                Guid.NewGuid() +
                Path.GetExtension(
                    file.FileName
                );

            var filePath =
                Path.Combine(
                    uploadsFolder,
                    fileName
                );

            using (var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                ))
            {
                await file.CopyToAsync(stream);
            }

            return $"images/{fileName}";
        }

        public async Task<string> UploadPreview(
            IFormFile file
        )
        {
            var previewFolder =
                Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "previews"
                );

            if (!Directory.Exists(previewFolder))
            {
                Directory.CreateDirectory(
                    previewFolder
                );
            }

            var fileName =
                Guid.NewGuid() +
                Path.GetExtension(
                    file.FileName
                );

            var filePath =
                Path.Combine(
                    previewFolder,
                    fileName
                );

            using (var stream =
                new FileStream(
                    filePath,
                    FileMode.Create
                ))
            {
                await file.CopyToAsync(stream);
            }

            return $"previews/{fileName}";
        }
    }
}
