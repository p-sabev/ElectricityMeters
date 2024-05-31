using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/subscribers")]
    public class SubscribersController : ControllerBase
    {
        private readonly Models.DbContext _dbContext;

        public SubscribersController(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subscriber>>> GetAllSubscribers()
        {
            if (_dbContext == null || _dbContext.Subscribers == null)
            {
                return NotFound();
            }

            return await _dbContext.Subscribers.ToListAsync();
        }


        [HttpPost]
        public async Task<ActionResult<Subscriber>> InsertSubscriber(InsertSubscriber insertSubscriber)
        {
            if (_dbContext == null || _dbContext.Subscribers == null || _dbContext.ElectricMeters == null)
            {
                return Problem("Entity set 'DbContext' is null.");
            }

            var electricMeter = await _dbContext.ElectricMeters.FindAsync(insertSubscriber.ElectricMeterId);
            if (electricMeter == null)
            {
                return BadRequest("Invalid ElectricMeterId.");
            }

            var subscriber = new Subscriber
            {
                Id = 0,
                NumberPage = insertSubscriber.NumberPage,
                Name = insertSubscriber.Name,
                ElectricMeter = electricMeter,
                Address = insertSubscriber.Address,
                Phone = insertSubscriber.Phone,
                MeterNumber = insertSubscriber.MeterNumber,
                Note = insertSubscriber.Note,
                LastRecordDate = null,
                LastReading = null
            };

            _dbContext.Subscribers.Add(subscriber);
            await _dbContext.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllSubscribers), new { id = subscriber.Id }, subscriber);
        }

        [HttpPut]
        public async Task<IActionResult> EditSubscriber(EditSubscriber editSubscriber)
        {
            if (_dbContext == null || _dbContext.Subscribers == null || _dbContext.ElectricMeters == null)
            {
                return Problem("Entity set 'DbContext' is null.");
            }

            // Do not use LastRecordDate and LastReading in the edit operation
            var existingSubscriber = await _dbContext.Subscribers.FindAsync(editSubscriber.Id);
            if (existingSubscriber == null)
            {
                return NotFound();
            }

            var electricMeter = await _dbContext.ElectricMeters.FindAsync(editSubscriber.ElectricMeterId);
            if (electricMeter == null)
            {
                return BadRequest("Invalid ElectricMeterId.");
            }

            existingSubscriber.Name = editSubscriber.Name;
            existingSubscriber.NumberPage = editSubscriber.NumberPage;
            existingSubscriber.ElectricMeter = electricMeter;
            existingSubscriber.Address = editSubscriber.Address;
            existingSubscriber.Phone = editSubscriber.Phone;
            existingSubscriber.MeterNumber = editSubscriber.MeterNumber;
            existingSubscriber.Note = editSubscriber.Note;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SubscriberExists(editSubscriber.Id))
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
        public async Task<IActionResult> DeleteSubscriber(int id)
        {
            if (_dbContext == null || _dbContext.Subscribers == null)
            {
                return NotFound();
            }

            var subscriber = await _dbContext.Subscribers.FindAsync(id);
            if (subscriber == null)
            {
                return NotFound();
            }

            // Check if there are any readings associated with this subscriber
            var hasReadings = await _dbContext.Readings.AnyAsync(r => r.Subscriber.Id == id);
            if (hasReadings)
            {
                return BadRequest("Cannot delete the subscriber as there are readings associated with them.");
            }

            _dbContext.Subscribers.Remove(subscriber);
            await _dbContext.SaveChangesAsync();

            return NoContent();
        }

        private bool SubscriberExists(int id)
        {
            return (_dbContext?.Subscribers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
