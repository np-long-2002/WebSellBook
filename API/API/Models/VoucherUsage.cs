namespace API.Models
{
    public class VoucherUsage
    {
        public int Id { get; set; }

        public int VoucherId { get; set; }

        public int UserId { get; set; }

        public DateTime UsedAt { get; set; } = DateTime.UtcNow;

        public Voucher? Voucher { get; set; }

        public User? User { get; set; }
    }
}