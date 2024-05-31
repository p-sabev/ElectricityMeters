using ElectricityMeters.Models;
using ElectricityMeters.Request.Readings;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/readings")]
    public class ReadingsController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public ReadingsController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Reading>>> GetAllReadings()
        {
            if (_dbContext == null || _dbContext.Readings == null)
            {
                return NotFound();
            }

            return await _dbContext.Readings.ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<Reading>> InsertReading(InsertReading insertReading)
        {
            if (_dbContext == null || _dbContext.Readings == null || _dbContext.Subscribers == null)
            {
                return Problem("Entity set 'DbContext' is null.");
            }

            var subscriber = await _dbContext.Subscribers.FindAsync(insertReading.SubscriberId);
            if (subscriber == null)
            {
                return BadRequest("Invalid SubscriberId.");
            }

            var lastReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == insertReading.SubscriberId)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (lastReading != null && insertReading.Date <= lastReading.Date)
            {
                return BadRequest("The new reading date must be later than the last reading date.");
            }

            if (lastReading != null && insertReading.Value < lastReading.Value)
            {
                return BadRequest("The new reading should be bigger than the last reading");
            }

            var currentPrice = await _dbContext.Prices
                .Where(p => p.DateFrom <= insertReading.Date && (p.DateTo == null || p.DateTo >= insertReading.Date))
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (currentPrice == null)
            {
                return BadRequest("No valid price found for the given date.");
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
                CurrentPrice = currentPrice.PriceInLv
            };

            _dbContext.Readings.Add(reading);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllReadings), new { id = reading.Id }, reading);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditReading(int id, EditReading editReading)
        {
            if (id != editReading.Id)
            {
                return BadRequest();
            }

            var reading = await _dbContext.Readings
                .Include(r => r.Subscriber)
                .Where(r => r.Id == id)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (reading == null)
            {
                return NotFound();
            }

            var lastReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == editReading.SubscriberId)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (reading.Id != lastReading.Id)
            {
                return BadRequest("Only the latest reading can be edited.");
            }

            if (lastReading != null && editReading.Value < lastReading.Value)
            {
                return BadRequest("The new reading should be bigger than the last reading");
            }

            var currentPrice = await _dbContext.Prices
                .Where(p => p.DateFrom <= editReading.Date && (p.DateTo == null || p.DateTo >= editReading.Date))
                .OrderByDescending(p => p.DateFrom)
                .FirstOrDefaultAsync();

            if (currentPrice == null)
            {
                return BadRequest("No valid price found for the given date.");
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

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReadingExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReading(int id)
        {
            var reading = await _dbContext.Readings
                .Include(r => r.Subscriber)
                .Where(r => r.Id == id)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (reading == null)
            {
                return NotFound();
            }

            var lastReading = await _dbContext.Readings
                .Where(r => r.Subscriber.Id == reading.Subscriber.Id)
                .OrderByDescending(r => r.Date)
                .FirstOrDefaultAsync();

            if (reading.Id != lastReading.Id)
            {
                return BadRequest("Only the latest reading can be deleted.");
            }

            _dbContext.Readings.Remove(reading);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool ReadingExists(int id)
        {
            return (_dbContext?.Readings?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
