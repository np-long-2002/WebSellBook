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
        private readonly SupabaseStorageService _storage;

        public BookService(
            AppDbContext context,
            IPromotionService promotionService,
            SupabaseStorageService storage)
        {
            _context = context;
            _promotionService = promotionService;
            _storage = storage;
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
        public async Task<IEnumerable<BookDTO>> GetAll()
        {
            try
            {
                Console.WriteLine("GET ALL BOOKS START");

                var books = await _context.Books.ToListAsync();

                Console.WriteLine($"TOTAL BOOKS: {books.Count}");

                var result = new List<BookDTO>();

                foreach (var book in books)
                {
                    try
                    {
                        result.Add(await MapBook(book));
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(
                            $"MAP BOOK ERROR ID={book.Id}"
                        );

                        Console.WriteLine(ex.ToString());

                        throw;
                    }
                }

                Console.WriteLine("GET ALL BOOKS SUCCESS");

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine("GET ALL BOOKS FAILED");

                Console.WriteLine(ex.ToString());

                throw;
            }
        }

        private async Task<BookDTO> MapBook(Book book)
        {
            decimal discount = 0;

            try
            {
                discount =
                    await _promotionService
                    .GetBestDiscountPercentAsync(book.Id);
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"PROMOTION ERROR BOOK ID={book.Id}"
                );

                Console.WriteLine(ex.ToString());

                discount = 0;
            }

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
                    book.PreviewFileUrl
            };
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

                PreviewFileUrl = book.PreviewFileUrl
            };
        }

        public async Task<string> UploadImage(IFormFile file)
        {
            return await _storage.UploadImage(file);
        }

        public async Task<string> UploadPreview(IFormFile file)
        {
            return await _storage.UploadPreview(file);
        }
    }
}
