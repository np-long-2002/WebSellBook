using API.DTO;

namespace API.Services
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDTO dto);
        Task<string> Login(LoginDTO dto);
        Task<string> ForgotPassword(ForgotPasswordDTO dto);
        Task<string> ResetPassword(ResetPasswordDTO dto);
        Task<string> VerifyEmail(VerifyEmailDTO dto);
    }
}
