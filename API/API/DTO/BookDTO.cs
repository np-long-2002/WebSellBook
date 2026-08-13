namespace API.DTO
{
    public class BookDTO
    {
        public int Id { get; set; }

        public string? Title { get; set; }

        public string? Description { get; set; }

        public decimal Price { get; set; }

        public decimal DiscountPercent { get; set; }

        public decimal FinalPrice { get; set; }

        public int Stock { get; set; }

        public int ReservedStock { get; set; }

        public int AvailableStock { get; set; }

        public int AuthorId { get; set; }

        public int CategoryId { get; set; }

        public string? ImageUrl { get; set; }

        public string? PreviewFileUrl { get; set; }
    }
}
