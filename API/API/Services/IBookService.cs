using API.DTO;
using API.Models;

namespace API.Services
{
    public interface IBookService
    {
        Task<IEnumerable<BookDTO>> GetAll();
        Task<BookDTO?> GetById(int id);

        Task<BookDTO> Create(BookDTO book);

        Task<BookDTO?> Update(int id, BookDTO book);

        Task<bool> Delete(int id);
    }
}
