using API.DTO;

namespace API.Services
{
    public interface IPromotionService
    {
        Task<List<PromotionDTO>> GetAllAsync();

        Task<PromotionDTO?> GetByIdAsync(int id);

        Task<PromotionDTO> CreateAsync(
            CreatePromotionDTO dto);

        Task<PromotionDTO?> UpdateAsync(
            int id,
            UpdatePromotionDTO dto);

        Task<bool> DeleteAsync(int id);

        Task<bool> ToggleAsync(int id);

        Task<decimal> GetBestDiscountPercentAsync(
            int bookId);
    }
}