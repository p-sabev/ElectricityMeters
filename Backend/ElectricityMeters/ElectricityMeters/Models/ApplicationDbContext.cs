using ElectricityMeters.Base;
using ElectricityMeters.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Models
{
    public class ApplicationDbContext: IdentityDbContext<ApplicationUser, IdentityRole, string>
    {
        private readonly DataGroupService _dataGroupService;

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options, DataGroupService dataGroupService) : base(options) 
        {
            _dataGroupService = dataGroupService;
        }

        public DbSet<Switchboard> Switchboards { get; set; } = null!;
        public DbSet<Subscriber> Subscribers { get; set; } = null!;
        public DbSet<Reading> Readings { get; set; } = null!;
        public DbSet<Price> Prices { get; set; } = null!;
        public DbSet<Payment> Payments { get; set; } = null!;
        public DbSet<PaymentFee> PaymentFees { get; set; } = null!;
        public DbSet<StandartFee> StandartFees { get; set; } = null!;


        public override int SaveChanges()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity && e.State == EntityState.Added);

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;
                _dataGroupService.SetDataGroupForEntity(entity);
            }

            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseEntity && e.State == EntityState.Added);

            foreach (var entry in entries)
            {
                var entity = (BaseEntity)entry.Entity;
                _dataGroupService.SetDataGroupForEntity(entity);
            }

            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
