namespace API.Models
{
    public class Book
    {
        public int Id { get; set; }

        public string? Title { get; set; }
        public string? Description { get; set; }

        public decimal Price { get; set; }
        public int Stock { get; set; }

        public int AuthorId { get; set; }
        public int CategoryId { get; set; }

        public string? ImageUrl { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public Author? Author { get; set; }
        public Category? Category { get; set; }

        public ICollection<CartItem>? CartItems { get; set; }
        public ICollection<OrderItem>? OrderItems { get; set; }
        public ICollection<Review>? Reviews { get; set; }
    }
}
