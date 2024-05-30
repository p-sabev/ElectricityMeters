using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Models
{
    public class DbContext: Microsoft.EntityFrameworkCore.DbContext
    {
        public DbContext(DbContextOptions<DbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<ElectricMeter> ElectricMeters { get; set; } = null!;
        public DbSet<Subscriber> Subscribers { get; set; } = null!;
        public DbSet<Reading> Readings { get; set; } = null!;
        public DbSet<Price> Prices { get; set; } = null!;

    }
}
