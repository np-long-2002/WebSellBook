namespace API.DTO
{
    public class CheckoutDTO
    {
        public List<CheckoutItemDTO> Items { get; set; }
            = new();

        public string? VoucherCode { get; set; }
    }
}