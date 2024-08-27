using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Models
{
    public class ApplicationDbContext: IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<Switchboard> Switchboards { get; set; } = null!;
        public DbSet<Subscriber> Subscribers { get; set; } = null!;
        public DbSet<Reading> Readings { get; set; } = null!;
        public DbSet<Price> Prices { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<PaymentFee> PaymentFees { get; set; } = null!;
        public DbSet<StandartFee> StandartFees { get; set; } = null!;

    }
}
