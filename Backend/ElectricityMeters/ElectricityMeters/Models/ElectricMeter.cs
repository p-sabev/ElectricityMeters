namespace ElectricityMeters.Models
{
    public class ElectricMeter
    {

        public required int Id { get; set; }
        public required string Name { get; set; }

        public ElectricMeter() { }

        public ElectricMeter(int id, string name)
        {
            Id = id;
            Name = name;
        }

    }
}
