using API.DTO;
using System.Security.Claims;

namespace API.Services
{
    public interface IProfileService
    {
        Task<UserProfileDTO>
            GetProfile(
                ClaimsPrincipal user
            );

        Task<string>
            UpdateProfile(
                UpdateProfileDTO dto,
                ClaimsPrincipal user
            );

        Task<string>
            ChangePassword(
                ChangePasswordDTO dto,
                ClaimsPrincipal user
            );
    }
}