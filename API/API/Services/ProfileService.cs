using API.Datas;
using API.DTO;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services
{
    public class ProfileService
        : IProfileService
    {
        private readonly AppDbContext _context;

        public ProfileService(
            AppDbContext context)
        {
            _context = context;
        }

        public async Task<UserProfileDTO>
            GetProfile(
                ClaimsPrincipal user)
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                throw new Exception(
                    "User not found"
                );
            }

            return new UserProfileDTO
            {
                FullName =
                    dbUser.FullName,

                Email =
                    dbUser.Email,

                PhoneNumber =
                    dbUser.PhoneNumber,

                CreatedAt =
                    dbUser.CreatedAt
            };
        }

        public async Task<string>
            UpdateProfile(
                UpdateProfileDTO dto,
                ClaimsPrincipal user)
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                throw new Exception(
                    "User not found"
                );
            }

            dbUser.FullName =
                dto.FullName;

            dbUser.PhoneNumber =
                dto.PhoneNumber;

            await _context.SaveChangesAsync();

            return "Cập nhật thành công";
        }

        public async Task<string>
            ChangePassword(
                ChangePasswordDTO dto,
                ClaimsPrincipal user)
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                throw new Exception(
                    "User not found"
                );
            }

            bool isValid =
                BCrypt.Net.BCrypt.Verify(
                    dto.CurrentPassword,
                    dbUser.PasswordHash
                );

            if (!isValid)
            {
                throw new Exception(
                    "Mật khẩu hiện tại không đúng"
                );
            }

            dbUser.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    dto.NewPassword
                );

            await _context.SaveChangesAsync();

            return "Đổi mật khẩu thành công";
        }
    }
}