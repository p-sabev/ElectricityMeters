﻿using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Switchboards;
using ElectricityMeters.Response.Switchboards;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class SwitchboardService : ISwitchboardService
    {
        private readonly ApplicationDbContext _dbContext;

        public SwitchboardService(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Switchboard>> GetAllSwitchboardsAsync()
        {
            return await _dbContext.Switchboards.ToListAsync();
        }

        public async Task<SearchSwitchboardsResponse> SearchSwitchboardsList(SearchSwitchboardRequest request)
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
                            LastRecordDate = _dbContext.Readings
                                .Where(r => r.Subscriber.Id == s.Id)
                                .OrderByDescending(r => r.DateTo)
                                .Select(r => r.DateTo)
                                .FirstOrDefault(),
                            LastReading = _dbContext.Readings
                                .Where(r => r.Subscriber.Id == s.Id)
                                .OrderByDescending(r => r.DateTo)
                                .Select(r => r.Value)
                                .FirstOrDefault(),
                            LastFirstPhaseValue = _dbContext.Readings
                                .Where(r => r.Subscriber.Id == s.Id)
                                .OrderByDescending(r => r.DateTo)
                                .Select(r => r.FirstPhaseValue)
                                .FirstOrDefault(),
                            LastSecondPhaseValue = _dbContext.Readings
                                .Where(r => r.Subscriber.Id == s.Id)
                                .OrderByDescending(r => r.DateTo)
                                .Select(r => r.SecondPhaseValue)
                                .FirstOrDefault(),
                            LastThirdPhaseValue = _dbContext.Readings
                                .Where(r => r.Subscriber.Id == s.Id)
                                .OrderByDescending(r => r.DateTo)
                                .Select(r => r.ThirdPhaseValue)
                                .FirstOrDefault(),
                            Note = s.Note,
                            DefaultReading = s.DefaultReading,
                            PhaseCount = s.PhaseCount,
                        })
                        .ToList()
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
                        LastRecordDate = _dbContext.Readings
                            .Where(r => r.Subscriber.Id == s.Id)
                            .OrderByDescending(r => r.DateTo)
                            .Select(r => r.DateTo)
                            .FirstOrDefault(),
                        LastReading = _dbContext.Readings
                            .Where(r => r.Subscriber.Id == s.Id)
                            .OrderByDescending(r => r.DateTo)
                            .Select(r => r.Value)
                            .FirstOrDefault(),
                        LastFirstPhaseValue = _dbContext.Readings
                            .Where(r => r.Subscriber.Id == s.Id)
                            .OrderByDescending(r => r.DateTo)
                            .Select(r => r.FirstPhaseValue)
                            .FirstOrDefault(),
                        LastSecondPhaseValue = _dbContext.Readings
                            .Where(r => r.Subscriber.Id == s.Id)
                            .OrderByDescending(r => r.DateTo)
                            .Select(r => r.SecondPhaseValue)
                            .FirstOrDefault(),
                        LastThirdPhaseValue = _dbContext.Readings
                            .Where(r => r.Subscriber.Id == s.Id)
                            .OrderByDescending(r => r.DateTo)
                            .Select(r => r.ThirdPhaseValue)
                            .FirstOrDefault(),
                        Note = s.Note,
                        DefaultReading = s.DefaultReading,
                        PhaseCount = s.PhaseCount,
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
                throw new Exception("SwitchboardNotFound");
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
                    throw new Exception("SwitchboardNotFound");
                }
                else
                {
                    throw new Exception("SomethingWentWrong");
                }
            }

            return true;
        }

        public async Task<bool> DeleteSwitchboardAsync(int id)
        {
            var switchboard = await _dbContext.Switchboards.FindAsync(id);
            if (switchboard == null)
            {
                throw new Exception("SwitchboardNotFound");
            }

            // Check if any subscriber is connected to the electric meter
            var hasConnectedSubscribers = await _dbContext.Subscribers.AnyAsync(s => s.Switchboard.Id == id);
            if (hasConnectedSubscribers)
            {
                throw new Exception("SwitchboardHasSubscribersAndCannotBeDeleted");
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
