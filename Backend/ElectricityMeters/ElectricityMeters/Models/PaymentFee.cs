﻿namespace ElectricityMeters.Models
{
    public class PaymentFee
    {
        public int Id { get; set; }
        public int Payment {  get; set; }
        public double Value { get; set; }
        public string? Description { get; set; }
        public int DataGroup { get; set; }
    }
}
