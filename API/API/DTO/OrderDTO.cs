namespace API.DTO
{
    public class OrderDTO
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public decimal TotalAmount { get; set; }

        public string? Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public List<OrderItemDTO>? Items { get; set; }
    }
}