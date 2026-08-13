using API.DTO;

public class CreateOrderDTO
{
    public string ReceiverName { get; set; }

    public string ReceiverPhone { get; set; }

    public string ShippingAddress { get; set; }

    public List<CreateOrderItemDTO> Items { get; set; }
        = new();

    public string? VoucherCode { get; set; }
}