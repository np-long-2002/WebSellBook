namespace API.Models
{
    public class PromotionBook
    {
        public int PromotionId { get; set; }

        public Promotion Promotion { get; set; }

        public int BookId { get; set; }

        public Book Book { get; set; }
    }
}
