using ElectricityMeters.Base;

namespace ElectricityMeters.Models
{
    public class StandartFee : BaseEntity
    {

        public int Id { get; set; }
        public double Value { get; set; }
        public string? Description { get; set; }

        public StandartFee(int id, double value, string? description)
        {
            Id=id;
            Value=value;
            Description=description;
        }
    }
}
