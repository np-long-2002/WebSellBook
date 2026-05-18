using API.DTO;

namespace API.Services
{
    public interface IAuthService
    {
        Task<string> Register(RegisterDTO dto);
        Task<string> Login(LoginDTO dto);
    }
}
