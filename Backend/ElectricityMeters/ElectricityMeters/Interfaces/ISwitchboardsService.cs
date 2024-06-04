using ElectricityMeters.Models;
using ElectricityMeters.Request.Switchboards;

namespace ElectricityMeters.Interfaces
{
    public interface ISwitchboardService
    {
        Task<IEnumerable<Switchboard>> GetAllSwitchboardsAsync();
        Task<Switchboard> InsertSwitchboardAsync(InsertSwitchboard insertSwitchboard);
        Task<bool> EditSwitchboardAsync(EditSwitchboard editSwitchboard);
        Task<bool> DeleteSwitchboardAsync(int id);
    }
}
