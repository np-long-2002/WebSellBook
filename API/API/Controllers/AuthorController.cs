using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthorController: ControllerBase
    {
        private readonly IAuthorService _service;

        public AuthorController(IAuthorService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult>GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>GetById(int id)
        {
            var author =await _service.GetById(id);

            if (author == null)
                return NotFound();

            return Ok(author);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult>Create(AuthorDTO dto)
        {
            return Ok(await _service.Create(dto));
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult>Update(int id,AuthorDTO dto)
        {
            var author = await _service.Update(id,dto);

            if (author == null)
                return NotFound();

            return Ok(author);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult>
            Delete(int id)
        {
            try
            {
                var result =await _service.Delete(id);

                if (!result)
                    return NotFound();

                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}