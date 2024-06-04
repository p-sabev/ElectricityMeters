using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Switchboards;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class SwitchboardService : ISwitchboardService
    {
        private readonly Models.DbContext _dbContext;

        public SwitchboardService(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Switchboard>> GetAllSwitchboardsAsync()
        {
            return await _dbContext.Switchboards.ToListAsync();
        }

        public async Task<Switchboard> InsertSwitchboardAsync(InsertSwitchboard insertSwitchboard)
        {
            var switchboard = new Switchboard
            {
                Id = 0,
                Name = insertSwitchboard.Name
            };

            _dbContext.Switchboards.Add(switchboard);
            await _dbContext.SaveChangesAsync();

            return switchboard;
        }

        public async Task<bool> EditSwitchboardAsync(EditSwitchboard editSwitchboard)
        {
            var switchboard = await _dbContext.Switchboards.FindAsync(editSwitchboard.Id);
            if (switchboard == null)
            {
                return false;
            }

            switchboard.Name = editSwitchboard.Name;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SwitchboardExists(editSwitchboard.Id))
                {
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<bool> DeleteSwitchboardAsync(int id)
        {
            var switchboard = await _dbContext.Switchboards.FindAsync(id);
            if (switchboard == null)
            {
                return false;
            }

            // Check if any subscriber is connected to the electric meter
            var hasConnectedSubscribers = await _dbContext.Subscribers.AnyAsync(s => s.Switchboard.Id == id);
            if (hasConnectedSubscribers)
            {
                return false;
            }

            _dbContext.Switchboards.Remove(switchboard);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private bool SwitchboardExists(int id)
        {
            return (_dbContext?.Switchboards?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
