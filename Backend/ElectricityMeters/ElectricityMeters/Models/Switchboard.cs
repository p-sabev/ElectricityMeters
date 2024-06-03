namespace ElectricityMeters.Models
{
    public class Switchboard
    {

        public required int Id { get; set; }
        public required string Name { get; set; }

        public Switchboard() { }

        public Switchboard(int id, string name)
        {
            Id = id;
            Name = name;
        }

    }
}
