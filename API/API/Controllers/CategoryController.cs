using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController
        : ControllerBase
    {
        private readonly
            ICategoryService _service;

        public CategoryController(
            ICategoryService service
        )
        {
            _service = service;
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
            var category =
                await _service.GetById(id);

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult>
            Create(CategoryDTO dto)
        {
            return Ok(
                await _service.Create(dto)
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult>
            Update(
                int id,
                CategoryDTO dto
            )
        {
            var category =
                await _service.Update(
                    id,
                    dto
                );

            if (category == null)
                return NotFound();

            return Ok(category);
        }

        [Authorize(Roles = "Admin")]
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