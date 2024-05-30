using ElectricityMeters.Models;
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
        public async Task<ActionResult<Price>> InsertPrice(Price price)
        {
            if (price == null)
            {
                return BadRequest();
            }

            // Намиране на най-близкия предишен запис
            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateFrom < price.DateFrom)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null)
            {
                previousPrice.DateTo = price.DateFrom;
                _dbContext.Prices.Update(previousPrice);
            }

            // Намиране на най-близкия следващ запис
            var nextPrice = await _dbContext.Prices
                .Where(p => p.DateFrom > price.DateFrom)
                .OrderBy(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (nextPrice != null)
            {
                price.DateTo = nextPrice.DateFrom;
            }

            _dbContext.Prices.Add(price);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllPrices), new { id = price.Id }, price);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePrice(int id, Price price)
        {
            if (id != price.Id)
            {
                return BadRequest();
            }

            var existingPrice = await _dbContext.Prices.FindAsync(id);
            if (existingPrice == null)
            {
                return NotFound();
            }

            existingPrice.PriceInLv = price.PriceInLv;
            existingPrice.DateFrom = price.DateFrom;
            existingPrice.Note = price.Note;

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

            // Намиране на предишната цена
            var previousPrice = await _dbContext.Prices
                .Where(p => p.DateTo == price.DateFrom)
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (previousPrice != null)
            {
                previousPrice.DateTo = null;
                _dbContext.Prices.Update(previousPrice);
            }

            _dbContext.Prices.Remove(price);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

    }
}
