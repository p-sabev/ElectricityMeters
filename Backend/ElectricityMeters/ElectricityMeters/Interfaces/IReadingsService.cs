using ElectricityMeters.Models;
using ElectricityMeters.Request.Readings;
using ElectricityMeters.Response.Readings;

namespace ElectricityMeters.Interfaces
{
    public interface IReadingsService
    {
        Task<IEnumerable<Reading>> GetAllReadingsAsync();
        Task<SearchReadingsResponse> SearchReadingsList(SearchReadingsRequest request);
        Task<Reading> InsertReadingAsync(InsertReading insertReading);
        Task<bool> EditReadingAsync(int id, EditReading editReading);
        Task<bool> DeleteReadingAsync(int id);
        Task<IEnumerable<Reading>> InsertMultipleReadingsAsync(InsertMultipleReadings insertMultipleReadings);
    }
}
