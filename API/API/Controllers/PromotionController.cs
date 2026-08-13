using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PromotionController
    : ControllerBase
    {
        private readonly
            IPromotionService _service;

        public PromotionController(
            IPromotionService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult>
            GetAll()
        {
            return Ok(
                await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult>
            Get(int id)
        {
            var result =
                await _service.GetByIdAsync(id);

            if (result == null)
                return NotFound();

            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult>
            Create(
                CreatePromotionDTO dto)
        {
            return Ok(
                await _service.CreateAsync(dto));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>
            Update(
                int id,
                UpdatePromotionDTO dto)
        {
            return Ok(
                await _service.UpdateAsync(
                    id,
                    dto));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult>
            Delete(int id)
        {
            return Ok(
                await _service.DeleteAsync(id));
        }

        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult>
            Toggle(int id)
        {
            return Ok(
                await _service.ToggleAsync(id));
        }
    }
}
