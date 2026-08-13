using API.DTO;

namespace API.Services
{
    public interface IAuthorService
    {
        Task<IEnumerable<AuthorDTO>> GetAll();

        Task<AuthorDTO?> GetById(int id);

        Task<AuthorDTO> Create(AuthorDTO dto);

        Task<AuthorDTO?> Update(
            int id,
            AuthorDTO dto
        );

        Task<bool> Delete(int id);
    }
}