using API.Datas;
using API.DTO;
using API.Models;

namespace API.Services
{
    public class AuthorService: IAuthorService
    {
        private readonly AppDbContext _context;

        public AuthorService(
            AppDbContext context
        )
        {
            _context = context;
        }

        public async Task<AuthorDTO> Create(AuthorDTO dto)
        {
            var author = new Author
            {
                Name = dto.Name,
                Bio = dto.Bio
            };

            _context.Authors.Add(author);

            await _context.SaveChangesAsync();

            return new AuthorDTO
            {
                Id = author.Id,
                Name = author.Name,
                Bio = author.Bio
            };
        }

        public async Task<bool>Delete(int id)
        {
            var author =_context.Authors.FirstOrDefault(a => a.Id == id);

            if (author == null)
                return false;

            var hasBooks =_context.Books.Any(b => b.AuthorId == id);

            if (hasBooks)
            {
                throw new Exception("Author đang chứa sách");
            }

            _context.Authors.Remove(author);

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<AuthorDTO>>GetAll()
        {
            return _context.Authors.Select(a => new AuthorDTO
                {
                    Id = a.Id,
                    Name = a.Name,
                    Bio = a.Bio
                }).ToList();
        }

        public async Task<AuthorDTO?>GetById(int id)
        {
            var author =_context.Authors.FirstOrDefault(a => a.Id == id);

            if (author == null)
                return null;

            return new AuthorDTO
            {
                Id = author.Id,
                Name = author.Name,
                Bio = author.Bio
            };
        }

        public async Task<AuthorDTO?>Update(int id,AuthorDTO dto)
        {
            var author =_context.Authors.FirstOrDefault(a => a.Id == id);

            if (author == null)
                return null;

            author.Name = dto.Name;
            author.Bio = dto.Bio;

            await _context.SaveChangesAsync();

            return new AuthorDTO
            {
                Id = author.Id,
                Name = author.Name,
                Bio = author.Bio
            };
        }
    }
}