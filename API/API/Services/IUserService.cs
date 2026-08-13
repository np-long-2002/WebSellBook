using API.DTO;

namespace API.Services
{
    public interface IUserService
    {
        Task<UserDTO> Create(CreateUserDTO dto);

        Task<IEnumerable<UserDTO>> GetAll();

        Task<UserDTO?> GetById(int id);

        Task<UserDTO?> Update(
            int id,
            UpdateUserDTO dto
        );

        Task<bool> Delete(int id);
    }
}