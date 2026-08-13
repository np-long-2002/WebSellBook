namespace API.DTO
{
    public class ApplyVoucherDTO
    {
        public string Code { get; set; } = "";

        public decimal OrderAmount { get; set; }

        public int UserId { get; set; }
    }
}