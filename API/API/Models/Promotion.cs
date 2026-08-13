namespace API.Models
{
    public class Promotion
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal DiscountPercent { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; }
            = DateTime.Now;

        public ICollection<PromotionBook> PromotionBooks
            = new List<PromotionBook>();

        public ICollection<PromotionCategory> PromotionCategories
            = new List<PromotionCategory>();
    }
}