namespace API.DTO
{
    public class CreateReviewDTO
    {
        public int BookId { get; set; }

        public int Rating { get; set; }

        public string? Comment { get; set; }
    }
}