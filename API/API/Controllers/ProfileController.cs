using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/profile")]
    [Authorize]
    public class ProfileController
    : ControllerBase
    {
        private readonly IProfileService
            _profileService;

        public ProfileController(
            IProfileService profileService)
        {
            _profileService =
                profileService;
        }

        [HttpGet]
        public async Task<IActionResult>
            GetProfile()
        {
            return Ok(
                await _profileService
                    .GetProfile(User)
            );
        }

        [HttpPut]
        public async Task<IActionResult>
            UpdateProfile(
                UpdateProfileDTO dto)
        {
            return Ok(
                await _profileService
                    .UpdateProfile(
                        dto,
                        User
                    )
            );
        }

        [HttpPut("change-password")]
        public async Task<IActionResult>
            ChangePassword(
                ChangePasswordDTO dto)
        {
            return Ok(
                await _profileService
                    .ChangePassword(
                        dto,
                        User
                    )
            );
        }
    }
}
