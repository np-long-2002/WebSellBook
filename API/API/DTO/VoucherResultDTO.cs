namespace API.DTO
{
    public class VoucherResultDTO
    {
        public bool IsValid { get; set; }

        public string Message { get; set; } = "";

        public decimal DiscountAmount { get; set; }

        public decimal FinalAmount { get; set; }

        public string VoucherCode { get; set; } = "";
    }
}