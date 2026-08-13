using API.DTO;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class VoucherController : ControllerBase
    {
        private readonly IVoucherService _voucherService;

        public VoucherController(
            IVoucherService voucherService
        )
        {
            _voucherService = voucherService;
        }

        // ==========================
        // USER
        // ==========================

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var vouchers =
                await _voucherService.GetAllAsync();

            return Ok(vouchers);
        }

        [Authorize]
        [HttpPost("apply")]
        public async Task<IActionResult> ApplyVoucher(
            [FromBody] ApplyVoucherDTO dto
        )
        {
            var result =
                await _voucherService
                .ApplyVoucherAsync(
                    dto,
                    User
                );

            if (!result.IsValid)
            {
                return BadRequest(result);
            }

            return Ok(result);
        }

        // ==========================
        // ADMIN
        // ==========================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> Create(
            [FromBody] CreateVoucherDTO dto
        )
        {
            var voucher =
                await _voucherService
                .CreateAsync(dto);

            return Ok(voucher);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] UpdateVoucherDTO dto
        )
        {
            var success =
                await _voucherService
                .UpdateAsync(id, dto);

            if (!success)
            {
                return NotFound(
                    "Voucher not found"
                );
            }

            return Ok(
                new
                {
                    message =
                        "Voucher updated successfully"
                }
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(
            int id
        )
        {
            var success =
                await _voucherService
                .DeleteAsync(id);

            if (!success)
            {
                return NotFound(
                    "Voucher not found"
                );
            }

            return Ok(
                new
                {
                    message =
                        "Voucher deleted successfully"
                }
            );
        }

        [Authorize(Roles = "Admin")]
        [HttpPatch("{id}/toggle")]
        public async Task<IActionResult> ToggleActive(
            int id
        )
        {
            var success =
                await _voucherService
                .ToggleActiveAsync(id);

            if (!success)
            {
                return NotFound(
                    "Voucher not found"
                );
            }

            return Ok(
                new
                {
                    message =
                        "Voucher status updated"
                }
            );
        }
    }
}