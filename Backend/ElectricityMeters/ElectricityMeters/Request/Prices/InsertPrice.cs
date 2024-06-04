namespace ElectricityMeters.Request.Prices
{
    public class InsertPrice
    {
        public required double PriceInLv { get; set; }
        public required DateTime DateFrom { get; set; }
        public string Note { get; set; }
    }
}
