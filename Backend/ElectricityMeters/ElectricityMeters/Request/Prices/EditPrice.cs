namespace ElectricityMeters.Request.Prices
{
    public class EditPrice
    {
        public required int Id { get; set; }
        public required double PriceInLv { get; set; }
        public required DateTime DateFrom { get; set; }
        public string Note { get; set; }
    }
}
