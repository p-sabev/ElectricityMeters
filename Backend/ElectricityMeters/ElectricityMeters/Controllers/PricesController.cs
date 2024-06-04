using ElectricityMeters.Models;
using ElectricityMeters.Request.Prices;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/prices")]
    public class PricesController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public PricesController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Price>>> GetAllPrices()
        {
            if (_dbContext == null || _dbContext.Prices == null)
            {
                return NotFound();
            }

            return await _dbContext.Prices.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Price>> InsertPrice(InsertPrice insertPrice)
        {
            if (insertPrice == null)
            {
                return BadRequest();
            }

            // Намиране на най-близкия предишен запис
            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < insertPrice.DateFrom)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null)
            {
                previousPrice.DateTo = insertPrice.DateFrom;
                _dbContext.Prices.Update(previousPrice);
            }

            // Намиране на най-близкия следващ запис
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

            return CreatedAtAction(nameof(GetAllPrices), new { id = price.Id }, price);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePrice(EditPrice editPrice)
        {

            var existingPrice = await _dbContext.Prices.FindAsync(editPrice.Id);
            if (existingPrice == null)
            {
                return NotFound();
            }

            // Намиране на най-близкия предишен запис
            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < existingPrice.DateFrom && p.Id != editPrice.Id)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            // Намиране на най-близкия следващ запис
            var nextPrice = await _dbContext.Prices
                .Where(p => p.DateFrom > existingPrice.DateFrom && p.Id != editPrice.Id)
                .OrderBy(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null && editPrice.DateFrom <= previousPrice.DateFrom)
            {
                return BadRequest("ThereIsAPriceBeforeTheEditDate");
            }

            if (nextPrice != null && editPrice.DateFrom >= nextPrice.DateFrom)
            {
                return BadRequest("ThereIsAPriceAfterTheEditDate");
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

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrice(int id)
        {
            var price = await _dbContext.Prices.FindAsync(id);
            if (price == null)
            {
                return NotFound();
            }

            // Намиране на най-близкия предишен запис
            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < price.DateFrom && p.Id != price.Id)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            // Намиране на най-близкия следващ запис
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

            return NoContent();
        }

    }
}
