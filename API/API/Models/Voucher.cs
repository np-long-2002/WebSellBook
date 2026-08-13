namespace API.Models
{
    public class Voucher
    {
        public int Id { get; set; }

        public string Code { get; set; } = "";

        public decimal DiscountPercent { get; set; }

        public decimal MaxDiscountAmount { get; set; }

        public decimal MinOrderAmount { get; set; }

        public int Quantity { get; set; }

        public int UsedCount { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime ExpiredAt { get; set; }

        public bool IsActive { get; set; } = true;

        public ICollection<Order>? Orders { get; set; }
        public ICollection<VoucherUsage>? VoucherUsages { get; set; }
    }
}