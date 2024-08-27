namespace ElectricityMeters.Models
{
    public class Payment
    {
        public int Id { get; set; }
        public required Reading Reading { get; set; }
        public required DateTime Date { get; set; }
        public List<PaymentFee>? FeeList { get; set; }

    }
}