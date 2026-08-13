using API.DTO;
using System.Security.Claims;

namespace API.Services.Interfaces
{
    public interface IVoucherService
    {
        Task<List<VoucherDTO>> GetAllAsync();

        Task<VoucherDTO> CreateAsync(
            CreateVoucherDTO dto
        );

        Task<bool> UpdateAsync(
            int id,
            UpdateVoucherDTO dto
        );

        Task<bool> DeleteAsync(
            int id
        );

        Task<bool> ToggleActiveAsync(
            int id
        );

        Task<VoucherResultDTO> ApplyVoucherAsync(
            ApplyVoucherDTO dto,
            ClaimsPrincipal user
        );
    }
}