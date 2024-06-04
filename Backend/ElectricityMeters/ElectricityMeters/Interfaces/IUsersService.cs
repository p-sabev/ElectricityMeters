using ElectricityMeters.Models;

namespace ElectricityMeters.Interfaces
{
    public interface IUsersService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
    }
}
