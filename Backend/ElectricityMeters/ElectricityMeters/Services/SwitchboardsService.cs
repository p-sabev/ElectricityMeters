using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;
using ElectricityMeters.Request.Switchboards;
using ElectricityMeters.Response.Subscribers;
using ElectricityMeters.Response.Switchboards;
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

        public async Task<SearchSwitchboardsResponse> SearchSwitchboardsList(SearchSwitchboardsRequest request)
        {
            var query = _dbContext.Switchboards.AsQueryable();

            // Сортиране
            if (!string.IsNullOrEmpty(request.Sorting.SortProp))
            {
                query = request.Sorting.SortDirection == 1
                    ? query.OrderByDynamic(request.Sorting.SortProp)
                    : query.OrderByDescendingDynamic(request.Sorting.SortProp);
            }

            // Общо записи преди пейджинг
            var totalRecords = await query.CountAsync();

            // Пейджинг
            query = query
                .Skip(request.Paging.Page * request.Paging.PageSize)
                .Take(request.Paging.PageSize);

            var switchboards = await query
                .Select(p => new SwitchboardsResponse
                {
                    Id = p.Id,
                    Name = p.Name,
                    Subscribers = _dbContext.Subscribers
                        .Where(s => s.Switchboard.Id == p.Id)
                        .Select(s => new SwitchboardSubscribers
                        {
                            Id = s.Id,
                            NumberPage = s.NumberPage,
                            Name = s.Name,
                            Address = s.Address,
                            Phone = s.Phone,
                            MeterNumber = s.MeterNumber,
                            LastRecordDate = s.LastRecordDate,
                            LastReading = s.LastReading,
                            Note = s.Note
                        })
                        .ToList() // This will still be an IQueryable, so we need to materialize it later
                })
                .ToListAsync();

            // Process each switchboard to fetch subscribers asynchronously
            foreach (var switchboard in switchboards)
            {
                // Await each set of subscribers separately
                switchboard.Subscribers = await _dbContext.Subscribers
                    .Where(s => s.Switchboard.Id == switchboard.Id)
                    .Select(s => new SwitchboardSubscribers
                    {
                        Id = s.Id,
                        NumberPage = s.NumberPage,
                        Name = s.Name,
                        Address = s.Address,
                        Phone = s.Phone,
                        MeterNumber = s.MeterNumber,
                        LastRecordDate = s.LastRecordDate,
                        LastReading = s.LastReading,
                        Note = s.Note
                    })
                    .ToListAsync();
            }

            return new SearchSwitchboardsResponse
            {
                Data = switchboards,
                TotalRecords = totalRecords
            };
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
