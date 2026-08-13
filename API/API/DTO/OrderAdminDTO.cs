namespace API.DTO
{
    public class OrderAdminDTO
    {
        public int Id { get; set; }

        public string UserName { get; set; }

        public decimal TotalAmount { get; set; }

        public string Status { get; set; }

        public DateTime CreatedAt { get; set; }
    } 
}
