using API.DTO;
using System.Security.Claims;

namespace API.Services
{
    public interface IOrderService
    {
        Task<OrderDTO> Checkout(
            ClaimsPrincipal user,
            CreateOrderDTO dto
        );

        Task<IEnumerable<OrderDTO>>
            GetMyOrders(
                ClaimsPrincipal user
            );

        Task<IEnumerable<OrderAdminDTO>>
            GetAllOrders();

        Task<bool>
            UpdateStatus(
                int id,
                string status
            );

        Task<string>
            CancelOrder(
                int orderId,
                ClaimsPrincipal user
            );
    }
}