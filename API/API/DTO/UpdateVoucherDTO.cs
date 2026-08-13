namespace API.DTO
{
    public class UpdateVoucherDTO
    {
        public string Code { get; set; } = "";

        public decimal DiscountPercent { get; set; }

        public decimal MaxDiscountAmount { get; set; }

        public decimal MinOrderAmount { get; set; }

        public int Quantity { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime ExpiredAt { get; set; }

        public bool IsActive { get; set; }
    }
}