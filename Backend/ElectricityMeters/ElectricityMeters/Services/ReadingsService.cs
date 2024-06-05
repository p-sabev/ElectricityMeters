using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Readings;
using ElectricityMeters.Response.Readings;
using ElectricityMeters.Response.Switchboards;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class ReadingService : IReadingsService
    {
        private readonly Models.DbContext _dbContext;

        public ReadingService(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Reading>> GetAllReadingsAsync()
        {
            return await _dbContext.Readings.ToListAsync();
        }

        public async Task<SearchReadingsResponse> SearchReadingsList(SearchReadingsRequest request)
        {
            var query = _dbContext.Readings.AsQueryable();

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

        // Извличане на данни
        var readings = await query
                .Select(r => new ReadingsResponse
                {
                    Id = r.Id,
                    Date = r.Date,
                    Value = r.Value,
                    AmountDue = r.AmountDue,
                    Difference = r.Difference,
                    CurrentPrice = r.CurrentPrice,
                    UsedPrice = _dbContext.Prices
                        .Where(p => p.Id == r.UsedPrice)
                        .Select(p => new Price
                        {
                            Id = p.Id,
                            PriceInLv = p.PriceInLv,
                            DateFrom = p.DateFrom,
                            DateTo = p.DateTo,
                            Note = p.Note
                        })
                        .FirstOrDefault(),
                    Subscriber = _dbContext.Subscribers
                        .Where(s => s.Id == r.Subscriber.Id)
                        .Select(s => new ReadingSubscriber
                        {
                            Id = s.Id,
                            NumberPage = s.NumberPage,
                            Name = s.Name,
                            Address = s.Address,
                            Phone = s.Phone,
                            SwitchboardNumber = s.Switchboard.Name,
                            MeterNumber = s.MeterNumber,
                            LastRecordDate = s.LastRecordDate,
                            LastReading = s.LastReading,
                            Note = s.Note
                        })
                        .FirstOrDefault()
                })
                .ToListAsync();

            return new SearchReadingsResponse
            {
                Data = readings,
                TotalRecords = totalRecords
            };
        }

        public async Task<Reading> InsertReadingAsync(InsertReading insertReading)
        {
            var subscriber = await _dbContext.Subscribers.FindAsync(insertReading.SubscriberId);
            if (subscriber == null)
            {
                return null;
            }

            var lastReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == insertReading.SubscriberId)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (lastReading != null && insertReading.Date <= lastReading.Date)
            {
                return null;
            }

            if (lastReading != null && insertReading.Value < lastReading.Value)
            {
                return null;
            }

            var currentPrice = await _dbContext.Prices
                .Where(p => p.DateFrom <= insertReading.Date && (p.DateTo == null || p.DateTo >= insertReading.Date))
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (currentPrice == null)
            {
                return null;
            }

            var difference = lastReading != null ? insertReading.Value - lastReading.Value : insertReading.Value;
            var amountDue = difference * currentPrice.PriceInLv;

            var reading = new Reading
            {
                Subscriber = subscriber,
                Date = insertReading.Date,
                Value = insertReading.Value,
                Difference = difference,
                AmountDue = amountDue,
                CurrentPrice = currentPrice.PriceInLv,
                UsedPrice = currentPrice.Id
            };

            _dbContext.Readings.Add(reading);

            subscriber.LastReading = insertReading.Value;
            subscriber.LastRecordDate = insertReading.Date;
            _dbContext.Update(subscriber);

            await _dbContext.SaveChangesAsync();

            return reading;
        }

        public async Task<IEnumerable<Reading>> InsertMultipleReadingsAsync(InsertMultipleReadings insertMultipleReadings)
        {
            var readings = new List<Reading>();

            foreach (var insertReading in insertMultipleReadings.SubscribersReading)
            {
                var subscriber = await _dbContext.Subscribers.FindAsync(insertReading.SubscriberId);
                if (subscriber == null)
                {
                    continue; // Skip this reading if the subscriber is not found
                }

                var lastReading = await _dbContext.Readings
                    .Where(r => r.Subscriber.Id == insertReading.SubscriberId)
                    .OrderByDescending(r => r.Date)
                    .FirstOrDefaultAsync();

                if (lastReading != null && (insertReading.Date <= lastReading.Date || insertReading.Value < lastReading.Value))
                {
                    continue; // Skip invalid readings
                }

                var currentPrice = await _dbContext.Prices
                    .Where(p => p.DateFrom <= insertReading.Date && (p.DateTo == null || p.DateTo >= insertReading.Date))
                    .OrderByDescending(p => p.DateFrom)
                    .FirstOrDefaultAsync();

                if (currentPrice == null)
                {
                    continue; // Skip if no valid price is found
                }

                var difference = lastReading != null ? insertReading.Value - lastReading.Value : insertReading.Value;
                var amountDue = difference * currentPrice.PriceInLv;

                var reading = new Reading
                {
                    Subscriber = subscriber,
                    Date = insertReading.Date,
                    Value = insertReading.Value,
                    Difference = difference,
                    AmountDue = amountDue,
                    CurrentPrice = currentPrice.PriceInLv,
                    UsedPrice = currentPrice.Id
                };

                _dbContext.Readings.Add(reading);

                subscriber.LastReading = insertReading.Value;
                subscriber.LastRecordDate = insertReading.Date;
                _dbContext.Update(subscriber);

                readings.Add(reading);
            }

            await _dbContext.SaveChangesAsync();

            return readings;
        }

        public async Task<bool> EditReadingAsync(int id, EditReading editReading)
        {
            var reading = await _dbContext.Readings
                .Include(r => r.Subscriber)
                .Where(r => r.Id == id)
                .FirstOrDefaultAsync();

            if (reading == null)
            {
                return false;
            }

            var lastReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == editReading.SubscriberId)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (reading.Id != lastReading.Id)
            {
                return false;
            }

            if (lastReading != null && editReading.Value < lastReading.Value)
            {
                return false;
            }

            var currentPrice = await _dbContext.Prices
                .Where(p => p.DateFrom <= editReading.Date && (p.DateTo == null || p.DateTo >= editReading.Date))
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (currentPrice == null)
            {
                return false;
            }

            var previousReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == editReading.SubscriberId && r.Date < editReading.Date)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            var difference = previousReading != null ? editReading.Value - previousReading.Value : editReading.Value;
            var amountDue = difference * currentPrice.PriceInLv;

            reading.Date = editReading.Date;
            reading.Value = editReading.Value;
            reading.Difference = difference;
            reading.AmountDue = amountDue;
            reading.CurrentPrice = currentPrice.PriceInLv;
            reading.UsedPrice = currentPrice.Id;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReadingExists(id))
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

        public async Task<bool> DeleteReadingAsync(int id)
        {
            var reading = await _dbContext.Readings
                .Include(r => r.Subscriber)
                .Where(r => r.Id == id)
                .FirstOrDefaultAsync();

            if (reading == null)
            {
                return false;
            }

            var lastReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == reading.Subscriber.Id)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (reading.Id != lastReading.Id)
            {
                return false;
            }

            _dbContext.Readings.Remove(reading);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private bool ReadingExists(int id)
        {
            return (_dbContext?.Readings?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
