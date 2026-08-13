using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO dto)
        {
            var result = await _authService.Register(dto);

            if (result == "Email already exists")
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDTO dto)
        {
            var token = await _authService.Login(dto);

            if (token == "Invalid email or password")
            {
                return Unauthorized(token);
            }

            return Ok(new { token });
        }
        [HttpPost("forgot-password")]
        public async Task<IActionResult>
ForgotPassword(
    ForgotPasswordDTO dto)
        {
            var result =
                await _authService
                .ForgotPassword(dto);

            return Ok(result);
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
    ResetPasswordDTO dto)
        {
            try
            {
                var result =
                    await _authService.ResetPassword(dto);

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("verify-email")]
        public async Task<IActionResult>
    VerifyEmail(
        VerifyEmailDTO dto)
        {
            var result =
                await _authService
                .VerifyEmail(dto);

            return Ok(result);
        }
    }
}