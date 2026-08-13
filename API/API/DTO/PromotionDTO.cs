namespace API.DTO
{
    public class PromotionDTO
    {
        public int Id { get; set; }

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public decimal DiscountPercent { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public bool IsActive { get; set; }

        public List<int> BookIds { get; set; }
            = new();

        public List<int> CategoryIds { get; set; }
            = new();
    }
}
