using ElectricityMeters.Models;
using ElectricityMeters.Request.Prices;
using ElectricityMeters.Response.Prices;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class PriceService : IPriceService
    {
        private readonly Models.DbContext _dbContext;

        public PriceService(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Price>> GetAllPricesAsync()
        {
            if (_dbContext == null || _dbContext.Prices == null)
            {
                return null;
            }

            return await _dbContext.Prices.ToListAsync();
        }

        public async Task<SearchPricesResponse> SearchPricesList(SearchPriceRequest request)
        {
            var query = _dbContext.Prices.AsQueryable();

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
            var prices = await query
                .Select(p => new PriceResponse
                {
                    Id = p.Id,
                    PriceInLv = p.PriceInLv,
                    DateFrom = p.DateFrom,
                    DateTo = p.DateTo,
                    Note = p.Note,
                    IsUsed = _dbContext.Readings.Any(r => r.UsedPrice == p.Id)
                })
                .ToListAsync();

            return new SearchPricesResponse
            {
                Data = prices,
                TotalRecords = totalRecords
            };
        }

        public async Task<Price> InsertPriceAsync(InsertPrice insertPrice)
        {
            if (insertPrice == null)
            {
                return null;
            }

            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < insertPrice.DateFrom)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null)
            {
                previousPrice.DateTo = insertPrice.DateFrom;
                _dbContext.Prices.Update(previousPrice);
            }

            var nextPrice = await _dbContext.Prices
                .Where(p => p.DateFrom > insertPrice.DateFrom)
                .OrderBy(p => p.DateFrom)
                .FirstOrDefaultAsync();

            var price = new Price
            {
                Id = 0,
                PriceInLv = insertPrice.PriceInLv,
                DateFrom = insertPrice.DateFrom,
                DateTo = null,
                Note = insertPrice.Note
            };

            if (nextPrice != null)
            {
                price.DateTo = nextPrice.DateFrom;
            }

            _dbContext.Prices.Add(price);
            await _dbContext.SaveChangesAsync();

            return price;
        }

        public async Task<bool> UpdatePriceAsync(EditPrice editPrice)
        {
            var existingPrice = await _dbContext.Prices.FindAsync(editPrice.Id);
            if (existingPrice == null)
            {
                return false;
            }

            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < existingPrice.DateFrom && p.Id != editPrice.Id)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            var nextPrice = await _dbContext.Prices
                .Where(p => p.DateFrom > existingPrice.DateFrom && p.Id != editPrice.Id)
                .OrderBy(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null && editPrice.DateFrom <= previousPrice.DateFrom)
            {
                return false;
            }

            if (nextPrice != null && editPrice.DateFrom >= nextPrice.DateFrom)
            {
                return false;
            }

            if (previousPrice != null)
            {
                previousPrice.DateTo = editPrice.DateFrom;
                _dbContext.Prices.Update(previousPrice);
            }

            if (nextPrice != null)
            {
                existingPrice.DateTo = nextPrice.DateFrom;
            }

            existingPrice.PriceInLv = editPrice.PriceInLv;
            existingPrice.DateFrom = editPrice.DateFrom;
            existingPrice.Note = editPrice.Note;

            _dbContext.Prices.Update(existingPrice);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        public async Task<bool> DeletePriceAsync(int id)
        {
            var price = await _dbContext.Prices.FindAsync(id);
            if (price == null)
            {
                return false;
            }

            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < price.DateFrom && p.Id != price.Id)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            var nextPrice = await _dbContext.Prices
                .Where(p => p.DateFrom > price.DateFrom && p.Id != price.Id)
                .OrderBy(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null)
            {
                if (nextPrice != null)
                {
                    previousPrice.DateTo = nextPrice.DateFrom;
                    _dbContext.Prices.Update(previousPrice);
                }
                else
                {
                    previousPrice.DateTo = null;
                    _dbContext.Prices.Update(previousPrice);
                }
            }

            _dbContext.Prices.Remove(price);
            await _dbContext.SaveChangesAsync();

            return true;
        }
    }
}