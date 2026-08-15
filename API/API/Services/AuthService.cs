using API.Datas;
using API.DTO;
using API.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace API.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthService(
            AppDbContext context,
            IConfiguration configuration,
            IEmailService emailService)
        {
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public Task<string> Login(LoginDTO dto)
        {
            var user = _context.Users
                .FirstOrDefault(
                    u => u.Email == dto.Email
                );

            if (user == null)
            {
                return Task.FromResult(
                    "Invalid email or password"
                );
            }

            bool isPasswordValid =
                BCrypt.Net.BCrypt.Verify(
                    dto.Password,
                    user.PasswordHash
                );

            if (!isPasswordValid)
            {
                return Task.FromResult(
                    "Invalid email or password"
                );
            }

            // Kiểm tra xác thực email

            if (!user.IsVerified)
            {
                return Task.FromResult(
                    "Tài khoản chưa được xác thực email"
                );
            }

            var claims = new[]
            {
        new System.Security.Claims.Claim(
            System.Security.Claims.ClaimTypes.Name,
            user.FullName ?? ""
        ),

        new System.Security.Claims.Claim(
            System.Security.Claims.ClaimTypes.Email,
            user.Email
        ),

        new System.Security.Claims.Claim(
            System.Security.Claims.ClaimTypes.Role,
            user.Role
        ),

        new System.Security.Claims.Claim(
            "UserId",
            user.Id.ToString()
        )
    };

            var key =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(
                        _configuration["Jwt:Key"]
                    )
                );

            var creds =
                new SigningCredentials(
                    key,
                    SecurityAlgorithms.HmacSha256
                );

            var token =
                new JwtSecurityToken(
                    issuer:
                        _configuration["Jwt:Issuer"],

                    audience:
                        _configuration["Jwt:Audience"],

                    claims: claims,

                    expires:
                        DateTime.UtcNow.AddDays(7),

                    signingCredentials:
                        creds
                );

            return Task.FromResult(
                new JwtSecurityTokenHandler()
                    .WriteToken(token)
            );
        }

        public async Task<string> Register(RegisterDTO dto)
        {
            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == dto.Email);

            if (existingUser != null)
            {
                return "Email already exists";
            }

            string hashedPassword =
                BCrypt.Net.BCrypt.HashPassword(dto.Password);

            var otp =
                new Random()
                .Next(100000, 999999)
                .ToString();

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                PasswordHash = hashedPassword,

                Role = "User",

                IsVerified = false,

                VerificationCode = otp,

                // PostgreSQL nên dùng UTC
                VerificationCodeExpiry =
                    DateTime.UtcNow.AddMinutes(10)
            };

            _context.Users.Add(user);

            await _context.SaveChangesAsync();

            // ===== TẠM THỜI TẮT EMAIL ĐỂ TEST =====

            /*
            await _emailService.SendEmailAsync(
                user.Email,
                "Xác thực tài khoản BookStore",
                $@"
                <h2>BookStore</h2>

                <p>Mã xác thực của bạn là:</p>

                <h1>{otp}</h1>

                <p>Mã có hiệu lực trong 10 phút.</p>
                "
            );
            */

            return $"Đăng ký thành công. OTP: {otp}";
        }
        public async Task<string> ForgotPassword(
    ForgotPasswordDTO dto)
        {
            var user =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == dto.Email
                );

            if (user == null)
            {
                return "Nếu email tồn tại hệ thống sẽ gửi mail.";
            }

            user.ResetPasswordToken =
                Guid.NewGuid().ToString();

            user.ResetPasswordTokenExpiry =
                DateTime.UtcNow.AddMinutes(30);

            await _context.SaveChangesAsync();

            var resetLink =
                $"http://localhost:5173/reset-password?token={user.ResetPasswordToken}";

            await _emailService.SendEmailAsync(
                user.Email,
                "Reset Password",
                $@"
        <h2>Đặt lại mật khẩu</h2>

        <p>Nhấn vào link bên dưới:</p>

        <a href='{resetLink}'>
            Reset Password
        </a>
        "
            );

            return "Đã gửi email reset mật khẩu.";
        }
        public async Task<string> ResetPassword(
    ResetPasswordDTO dto)
        {
            var user =
                await _context.Users
                .FirstOrDefaultAsync(
                    x =>
                    x.ResetPasswordToken == dto.Token
                );

            if (user == null)
            {
                throw new Exception(
                    "Token không hợp lệ"
                );
            }

            if (
                user.ResetPasswordTokenExpiry == null
                ||
                user.ResetPasswordTokenExpiry
                < DateTime.UtcNow
            )
            {
                throw new Exception(
                    "Token đã hết hạn"
                );
            }

            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    dto.NewPassword
                );

            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpiry = null;

            await _context.SaveChangesAsync();

            return "Đổi mật khẩu thành công";
        }

        public async Task<string>
    VerifyEmail(
        VerifyEmailDTO dto)
        {
            var user =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == dto.Email
                );

            if (user == null)
            {
                throw new Exception(
                    "User not found"
                );
            }

            if (
                user.VerificationCode
                != dto.Code
            )
            {
                throw new Exception(
                    "OTP không đúng"
                );
            }

            if (
                user.VerificationCodeExpiry
                == null
            )
            {
                throw new Exception(
                    "OTP không hợp lệ"
                );
            }

            if (
                user.VerificationCodeExpiry
                < DateTime.UtcNow
            )
            {
                throw new Exception(
                    "OTP đã hết hạn"
                );
            }

            user.IsVerified = true;

            user.VerificationCode = null;

            user.VerificationCodeExpiry = null;

            await _context.SaveChangesAsync();

            return
                "Xác thực thành công";
        }
    }
}
