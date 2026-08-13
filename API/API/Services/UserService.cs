using API.Datas;
using API.DTO;
using API.Models;

namespace API.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(
            AppDbContext context
        )
        {
            _context = context;
        }
        public async Task<UserDTO> Create(CreateUserDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email))
                throw new Exception("Email is required");

            if (string.IsNullOrWhiteSpace(dto.Password))
                throw new Exception("Password is required");

            if (string.IsNullOrWhiteSpace(dto.Role))
                dto.Role = "User";

            var exists = _context.Users.Any(x => x.Email == dto.Email);

            if (exists)
                throw new Exception("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = dto.Role
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            return new UserDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        public async Task<IEnumerable<UserDTO>>
            GetAll()
        {
            return _context.Users
                .Select(x => new UserDTO
                {
                    Id = x.Id,
                    FullName = x.FullName,
                    Email = x.Email,
                    Role = x.Role,
                    CreatedAt = x.CreatedAt
                })
                .ToList();
        }

        public async Task<UserDTO?>
            GetById(int id)
        {
            var user =
                _context.Users
                .FirstOrDefault(
                    x => x.Id == id
                );

            if (user == null)
                return null;

            return new UserDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDTO?>
            Update(
                int id,
                UpdateUserDTO dto
            )
        {
            var user =
                _context.Users
                .FirstOrDefault(
                    x => x.Id == id
                );

            if (user == null)
                return null;

            user.FullName =
                dto.FullName;

            user.Role =
                dto.Role;

            await _context.SaveChangesAsync();

            return new UserDTO
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool>
            Delete(int id)
        {
            var user =
                _context.Users
                .FirstOrDefault(
                    x => x.Id == id
                );

            if (user == null)
                return false;

            _context.Users.Remove(user);

            await _context.SaveChangesAsync();

            return true;
        }
    }
}