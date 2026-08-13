using API.DTO;

namespace API.Services
{
    public interface IDashboardService
    {
        Task<DashboardDTO> GetDashboard();
    }
}