namespace ElectricityMeters.Request.Payments
{
    public class PaymentReportRequest
    {
        public required DateTime DateFrom { get; set; }
        public required DateTime DateTo { get; set; }
    }
}
