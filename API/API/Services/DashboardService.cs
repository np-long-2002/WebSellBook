using API.Datas;
using API.DTO;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }
        public async Task<DashboardDTO> GetDashboard()
        {
            // ==========================
            // DOANH THU THEO THÁNG
            // ==========================

            var revenueByMonth = await _context.Orders
                .Where(x => x.Status == "Completed")
                .AsEnumerable()
                .GroupBy(x => new
                {
                    x.CreatedAt.Year,
                    x.CreatedAt.Month
                })
                .Select(g => new RevenueChartDTO
                {
                    Month = $"{g.Key.Month}/{g.Key.Year}",
                    Revenue = g.Sum(x => x.TotalAmount)
                })
                .OrderBy(x =>
                {
                    var parts = x.Month.Split('/');
                    return int.Parse(parts[1]) * 100
                        + int.Parse(parts[0]);
                })
                .ToListAsyncSafe();

            // ==========================
            // ĐƠN HÀNG MỚI NHẤT
            // ==========================

            var latestOrders = await _context.Orders
                .Include(x => x.User)
                .OrderByDescending(x => x.CreatedAt)
                .Take(5)
                .Select(x => new LatestOrderDTO
                {
                    Id = x.Id,

                    UserName =
                        x.User != null
                        ? x.User.FullName
                        : "Unknown",

                    TotalAmount =
                        x.TotalAmount,

                    Status =
                        x.Status,

                    CreatedAt =
                        x.CreatedAt
                })
                .ToListAsync();

            // ==========================
            // DOANH THU THỰC TẾ
            // ==========================

            decimal totalRevenue =
                await _context.Orders
                .Where(x => x.Status == "Completed")
                .SumAsync(x => (decimal?)x.TotalAmount)
                ?? 0;

            // ==========================
            // THỐNG KÊ
            // ==========================

            int totalBooks =
                await _context.Books.CountAsync();

            int totalUsers =
                await _context.Users.CountAsync();

            int totalOrders =
                await _context.Orders.CountAsync();

            int pendingOrders =
                await _context.Orders.CountAsync(
                    x => x.Status == "Pending"
                );

            int confirmedOrders =
                await _context.Orders.CountAsync(
                    x => x.Status == "Confirmed"
                );

            int shippingOrders =
                await _context.Orders.CountAsync(
                    x => x.Status == "Shipping"
                );

            int completedOrders =
                await _context.Orders.CountAsync(
                    x => x.Status == "Completed"
                );

            int cancelledOrders =
                await _context.Orders.CountAsync(
                    x => x.Status == "Cancelled"
                );

            // ==========================
            // RETURN
            // ==========================

            return new DashboardDTO
            {
                TotalBooks = totalBooks,

                TotalUsers = totalUsers,

                TotalOrders = totalOrders,

                PendingOrders = pendingOrders,

                ConfirmedOrders = confirmedOrders,

                ShippingOrders = shippingOrders,

                CompletedOrders = completedOrders,

                CancelledOrders = cancelledOrders,

                TotalRevenue = totalRevenue,

                RevenueByMonth = revenueByMonth,

                LatestOrders = latestOrders
            };
        }
    }



        public static class EnumerableExtension
    {
        public static Task<List<T>> ToListAsyncSafe<T>(this IEnumerable<T> source)
        {
            return Task.FromResult(source.ToList());
        }
    }
}