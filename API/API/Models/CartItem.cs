namespace API.Models
{
    public class CartItem
    {
        public int Id { get; set; }

        public int CartId { get; set; }
        public int BookId { get; set; }

        public int Quantity { get; set; }

        // Navigation
        public Cart? Cart { get; set; }
        public Book? Book { get; set; }
    }
}