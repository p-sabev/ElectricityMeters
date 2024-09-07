using ElectricityMeters.Base;
using System.Text.Json.Serialization;

namespace ElectricityMeters.Models
{
    public class PaymentFee : BaseEntity
    {
        public int Id { get; set; }
        public double Value { get; set; }
        public string? Description { get; set; }
        // This is the foreign key that connects to the Payment entity
        public int PaymentId { get; set; }

        // Navigation property to the Payment entity
        [JsonIgnore]
        public Payment Payment { get; set; }
    }
}
