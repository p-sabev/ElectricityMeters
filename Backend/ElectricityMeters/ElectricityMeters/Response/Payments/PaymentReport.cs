namespace ElectricityMeters.Response.Payments
{
    public class PaymentReportResponse
    {
        public required DateTime DateFrom { get; set; }
        public required DateTime DateTo { get; set; }
        public required double PaidTotalElectricity { get; set; }
        public required double PaidTotalFees { get; set; }
        public required List<PaidFees> Fees { get; set; }

    }

    public class PaidFees
    {
        public required string Description { get; set; }
        public required string TotalValue { get; set; }
    }
}
