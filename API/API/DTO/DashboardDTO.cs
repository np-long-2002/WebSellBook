namespace API.DTO
{
    public class DashboardDTO
    {
        public int TotalBooks { get; set; }

        public int TotalUsers { get; set; }

        public int TotalOrders { get; set; }

        public int PendingOrders { get; set; }

        public int ConfirmedOrders { get; set; }

        public int ShippingOrders { get; set; }

        public int CompletedOrders { get; set; }

        public int CancelledOrders { get; set; }

        public decimal TotalRevenue { get; set; }

        public List<RevenueChartDTO> RevenueByMonth { get; set; }
            = new();

        public List<LatestOrderDTO> LatestOrders { get; set; }
            = new();
    }

    public class RevenueChartDTO
    {
        public string Month { get; set; } = "";

        public decimal Revenue { get; set; }
    }

    public class LatestOrderDTO
    {
        public int Id { get; set; }

        public string UserName { get; set; } = "";

        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = "";

        public DateTime CreatedAt { get; set; }
    }
}