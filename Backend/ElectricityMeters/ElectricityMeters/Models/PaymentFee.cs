using ElectricityMeters.Base;

namespace ElectricityMeters.Models
{
    public class PaymentFee : BaseEntity
    {
        public int Id { get; set; }
        public int Payment {  get; set; }
        public double Value { get; set; }
        public string? Description { get; set; }
    }
}
