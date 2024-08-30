using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Settings;
using ElectricityMeters.Response.Settings;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class SettingsService:ISettingsService
    {
        private readonly ApplicationDbContext _dbContext;

        public SettingsService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<SearchStandartFeeListResponse>> GetAllDefaultFees()
        {
            return await _dbContext.StandartFees
                .Select(fee => new SearchStandartFeeListResponse
                {
                    Id = fee.Id,
                    Value = fee.Value,
                    Description = fee.Description
                })
                .ToListAsync();
        }

        public async Task<bool> UpdateDefaultFees(UpdateDefaultFeesRequest request)
        {
            // Clear the current fees
            _dbContext.StandartFees.RemoveRange(_dbContext.StandartFees);

            if (!(request.StandartFees == null || !request.StandartFees.Any()))
            {
                // Add the new fees
                foreach (var fee in request.StandartFees)
                {
                    var newFee = new Models.StandartFee(0, fee.Value, fee.Description);
                    _dbContext.StandartFees.Add(newFee);
                }
            }
            
            await _dbContext.SaveChangesAsync();
            return true;
        }
    }
}
