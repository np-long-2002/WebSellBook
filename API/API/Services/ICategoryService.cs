using API.DTO;

namespace API.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<CategoryDTO>> GetAll();
        Task<CategoryDTO?> GetById(int id);

        Task<CategoryDTO> Create(CategoryDTO category);

        Task<CategoryDTO?> Update(int id,CategoryDTO category);

        Task<bool> Delete(int id);
    }
}