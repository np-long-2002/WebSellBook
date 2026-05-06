namespace API.Models
{
    public class Order
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public User? User { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
    }
}