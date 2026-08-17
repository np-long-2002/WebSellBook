using API.Datas;
using API.DTO;
using API.Models;
using API.Services.Interfaces;

using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class PromotionService
        : IPromotionService
    {
        private readonly AppDbContext _context;

        public PromotionService(
            AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<PromotionDTO>>
            GetAllAsync()
        {
            return await _context.Promotions

                .Include(x => x.PromotionBooks)

                .Include(x => x.PromotionCategories)

                .Select(x => new PromotionDTO
                {
                    Id = x.Id,
                    Name = x.Name,
                    Description = x.Description,
                    DiscountPercent =
                        x.DiscountPercent,

                    StartDate = x.StartDate,
                    EndDate = x.EndDate,

                    IsActive = x.IsActive,

                    BookIds =
                        x.PromotionBooks
                         .Select(pb => pb.BookId)
                         .ToList(),

                    CategoryIds =
                        x.PromotionCategories
                         .Select(pc => pc.CategoryId)
                         .ToList()
                })

                .ToListAsync();
        }

        public async Task<PromotionDTO?>
            GetByIdAsync(int id)
        {
            var promotion =
                await _context.Promotions

                .Include(x => x.PromotionBooks)

                .Include(x => x.PromotionCategories)

                .FirstOrDefaultAsync(
                    x => x.Id == id);

            if (promotion == null)
                return null;

            return new PromotionDTO
            {
                Id = promotion.Id,
                Name = promotion.Name,
                Description =
                    promotion.Description,

                DiscountPercent =
                    promotion.DiscountPercent,

                StartDate =
                    promotion.StartDate,

                EndDate =
                    promotion.EndDate,

                IsActive =
                    promotion.IsActive,

                BookIds =
                    promotion.PromotionBooks
                    .Select(x => x.BookId)
                    .ToList(),

                CategoryIds =
                    promotion.PromotionCategories
                    .Select(x => x.CategoryId)
                    .ToList()
            };
        }

        public async Task<PromotionDTO>
            CreateAsync(
                CreatePromotionDTO dto)
        {
            var promotion =
                new Promotion
                {
                    Name = dto.Name,
                    Description =
                        dto.Description,

                    DiscountPercent =
                        dto.DiscountPercent,

                    StartDate =
                        dto.StartDate,

                    EndDate =
                        dto.EndDate,

                    IsActive =
                        dto.IsActive
                };

            _context.Promotions
                .Add(promotion);

            await _context.SaveChangesAsync();

            if (dto.BookIds != null)
            {
                foreach (var id in dto.BookIds)
                {
                    _context.PromotionBooks
                        .Add(
                            new PromotionBook
                            {
                                PromotionId =
                                    promotion.Id,

                                BookId = id
                            });
                }
            }

            if (dto.CategoryIds != null)
            {
                foreach (var id
                    in dto.CategoryIds)
                {
                    _context.PromotionCategories
                        .Add(
                            new PromotionCategory
                            {
                                PromotionId =
                                    promotion.Id,

                                CategoryId = id
                            });
                }
            }

            await _context.SaveChangesAsync();

            return (await GetByIdAsync(
                promotion.Id))!;
        }

        public async Task<PromotionDTO?>
            UpdateAsync(
                int id,
                UpdatePromotionDTO dto)
        {
            var promotion =
                await _context.Promotions

                .Include(x =>
                    x.PromotionBooks)

                .Include(x =>
                    x.PromotionCategories)

                .FirstOrDefaultAsync(
                    x => x.Id == id);

            if (promotion == null)
                return null;

            promotion.Name =
                dto.Name;

            promotion.Description =
                dto.Description;

            promotion.DiscountPercent =
                dto.DiscountPercent;

            promotion.StartDate =
                dto.StartDate;

            promotion.EndDate =
                dto.EndDate;

            promotion.IsActive =
                dto.IsActive;

            _context.PromotionBooks
                .RemoveRange(
                    promotion.PromotionBooks);

            _context.PromotionCategories
                .RemoveRange(
                    promotion.PromotionCategories);

            if (dto.BookIds != null)
            {
                foreach (var bookId
                    in dto.BookIds)
                {
                    _context.PromotionBooks
                        .Add(
                            new PromotionBook
                            {
                                PromotionId = id,
                                BookId = bookId
                            });
                }
            }

            if (dto.CategoryIds != null)
            {
                foreach (var categoryId
                    in dto.CategoryIds)
                {
                    _context.PromotionCategories
                        .Add(
                            new PromotionCategory
                            {
                                PromotionId = id,
                                CategoryId =
                                    categoryId
                            });
                }
            }

            await _context.SaveChangesAsync();

            return await GetByIdAsync(id);
        }

        public async Task<bool>
            DeleteAsync(int id)
        {
            var promotion =
                await _context.Promotions
                    .FindAsync(id);

            if (promotion == null)
                return false;

            _context.Promotions
                .Remove(promotion);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
            ToggleAsync(int id)
        {
            var promotion =
                await _context.Promotions
                    .FindAsync(id);

            if (promotion == null)
                return false;

            promotion.IsActive =
                !promotion.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }
        public async Task<decimal>
    GetBestDiscountPercentAsync(int bookId)
        {
            var now = DateTime.UtcNow;

            var book = await _context.Books
                .FirstOrDefaultAsync(x => x.Id == bookId);

            if (book == null)
            {
                return 0;
            }

            decimal maxDiscount = 0;

            var promotions =
                await _context.Promotions

                .Include(x => x.PromotionBooks)

                .Include(x => x.PromotionCategories)

                .Where(x =>
                    x.IsActive &&
                    x.StartDate <= now &&
                    x.EndDate >= now)

                .ToListAsync();

            foreach (var promotion in promotions)
            {
                bool apply = false;

                // giảm theo sách
                if (promotion.PromotionBooks
                    .Any(x => x.BookId == bookId))
                {
                    apply = true;
                }

                // giảm theo category
                if (promotion.PromotionCategories
                    .Any(x =>
                        x.CategoryId ==
                        book.CategoryId))
                {
                    apply = true;
                }

                if (apply)
                {
                    maxDiscount =
                        Math.Max(
                            maxDiscount,
                            promotion.DiscountPercent
                        );
                }
            }

            return maxDiscount;
        }
    }
}