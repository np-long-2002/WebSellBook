using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("User")]
    [Authorize(Roles = "Admin")]
    public class UserController
        : ControllerBase
    {
        private readonly IUserService
            _service;

        public UserController(
            IUserService service
        )
        {
            _service = service;
        }
        [HttpPost]
        public async Task<IActionResult> Create(CreateUserDTO dto)
        {
            try
            {
                var result = await _service.Create(dto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message,
                    stack = ex.StackTrace
                });
            }
        }
        [HttpGet]
        public async Task<IActionResult>
            GetAll()
        {
            return Ok(
                await _service.GetAll()
            );
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>
            GetById(int id)
        {
            var user =
                await _service.GetById(id);

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>
            Update(
                int id,
                UpdateUserDTO dto
            )
        {
            var user =
                await _service.Update(
                    id,
                    dto
                );

            if (user == null)
                return NotFound();

            return Ok(user);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult>
            Delete(int id)
        {
            var result =
                await _service.Delete(id);

            if (!result)
                return NotFound();

            return NoContent();
        }
    }
}