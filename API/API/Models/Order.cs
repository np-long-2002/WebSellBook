namespace API.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public decimal TotalAmount { get; set; }

        public int? VoucherId { get; set; }

        public decimal DiscountAmount { get; set; }

        public string? Status { get; set; } = "Pending";

        // ===== Thông tin giao hàng =====

        public string ReceiverName { get; set; }

        public string ReceiverPhone { get; set; }

        public string ShippingAddress { get; set; }

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        // ===== Navigation =====

        public User? User { get; set; }

        public Voucher? Voucher { get; set; }

        public ICollection<OrderItem>?
            OrderItems
        { get; set; }
    }
}