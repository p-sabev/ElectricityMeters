using ElectricityMeters.Models;
using ElectricityMeters.Request.Readings;

namespace ElectricityMeters.Interfaces
{
    public interface IReadingsService
    {
        Task<IEnumerable<Reading>> GetAllReadingsAsync();
        Task<Reading> InsertReadingAsync(InsertReading insertReading);
        Task<bool> EditReadingAsync(int id, EditReading editReading);
        Task<bool> DeleteReadingAsync(int id);
    }
}
