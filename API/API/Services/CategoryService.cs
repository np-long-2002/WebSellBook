using API.Datas;
using API.DTO;
using API.Models;

namespace API.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly AppDbContext _context;

        public CategoryService(
            AppDbContext context
        )
        {
            _context = context;
        }

        public async Task<CategoryDTO>Create(CategoryDTO dto)
        {
            var category = new Category
                            {
                                Name = dto.Name
                            };

            _context.Categories.Add(category);

            await _context.SaveChangesAsync();

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public async Task<bool> Delete(int id)
        {
            var category = _context.Categories
                .FirstOrDefault(c => c.Id == id);

            if (category == null)
                return false;

            var hasBooks = _context.Books
                .Any(b => b.CategoryId == id);

            if (hasBooks)
            {
                throw new Exception(
                    "Category đang chứa sách, không thể xóa"
                );
            }

            _context.Categories.Remove(category);

            await _context.SaveChangesAsync();

            return true;
        }

        public Task<IEnumerable<CategoryDTO>> GetAll()
        {
            return Task.FromResult(
                _context.Categories
                .Select(c => new CategoryDTO
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .AsEnumerable()
            );
        }

        public async Task<CategoryDTO?>GetById(int id)
        {
            var category = _context.Categories.FirstOrDefault(c => c.Id == id);

            if (category == null)
                return null;

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }


        public async Task<CategoryDTO?>Update(int id,CategoryDTO dto)
        {
            var category =_context.Categories.FirstOrDefault(c => c.Id == id);

            if (category == null)
                return null;

            category.Name = dto.Name;

            await _context.SaveChangesAsync();

            return new CategoryDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }

    }
}