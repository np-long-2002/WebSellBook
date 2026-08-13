using API.DTO;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrderController(
            IOrderService orderService
        )
        {
            _orderService = orderService;
        }

        // ==========================
        // USER
        // ==========================

        [Authorize]
        [HttpPost("checkout")]
        public async Task<IActionResult>
            Checkout(
                CreateOrderDTO dto
            )
        {
            try
            {
                var result =
                    await _orderService.Checkout(
                        User,
                        dto
                    );

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                );
            }
        }

        [Authorize]
        [HttpGet("my-orders")]
        public async Task<IActionResult>
            GetMyOrders()
        {
            try
            {
                var orders =
                    await _orderService.GetMyOrders(
                        User
                    );

                return Ok(orders);
            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                );
            }
        }

        // ==========================
        // ADMIN
        // ==========================

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult>
            GetAllOrders()
        {
            var orders =
                await _orderService.GetAllOrders();

            return Ok(orders);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/status")]
        public async Task<IActionResult>
            UpdateStatus(
                int id,
                string status
            )
        {
            var result =
                await _orderService.UpdateStatus(
                    id,
                    status
                );

            if (!result)
                return NotFound();

            return Ok(
                new
                {
                    message =
                        "Update status success"
                }
            );
        }
        [Authorize]
        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> CancelOrder(
    int id
)
        {
            try
            {
                var result =
                    await _orderService.CancelOrder(
                        id,
                        User
                    );

                return Ok(new
                {
                    message = result
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}