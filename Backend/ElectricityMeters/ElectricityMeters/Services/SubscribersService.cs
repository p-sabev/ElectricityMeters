using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Subscribers;
using Microsoft.EntityFrameworkCore;

namespace ElectricityMeters.Services
{
    public class SubscriberService : ISubscriberService
    {
        private readonly Models.DbContext _dbContext;

        public SubscriberService(Models.DbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<IEnumerable<Subscriber>> GetAllSubscribersAsync()
        {
            return await _dbContext.Subscribers.ToListAsync();
        }

        public async Task<Subscriber> InsertSubscriberAsync(InsertSubscriber insertSubscriber)
        {
            var switchboard = await _dbContext.Switchboards.FindAsync(insertSubscriber.SwitchboardId);
            if (switchboard == null)
            {
                return null;
            }

            var subscriber = new Subscriber
            {
                Id = 0,
                NumberPage = insertSubscriber.NumberPage,
                Name = insertSubscriber.Name,
                Switchboard = switchboard,
                Address = insertSubscriber.Address,
                Phone = insertSubscriber.Phone,
                MeterNumber = insertSubscriber.MeterNumber,
                Note = insertSubscriber.Note,
                LastRecordDate = null,
                LastReading = null
            };

            _dbContext.Subscribers.Add(subscriber);
            await _dbContext.SaveChangesAsync();

            return subscriber;
        }

        public async Task<bool> EditSubscriberAsync(EditSubscriber editSubscriber)
        {
            var existingSubscriber = await _dbContext.Subscribers.FindAsync(editSubscriber.Id);
            if (existingSubscriber == null)
            {
                return false;
            }

            var switchboard = await _dbContext.Switchboards.FindAsync(editSubscriber.SwitchboardId);
            if (switchboard == null)
            {
                return false;
            }

            existingSubscriber.Name = editSubscriber.Name;
            existingSubscriber.NumberPage = editSubscriber.NumberPage;
            existingSubscriber.Switchboard = switchboard;
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
                    return false;
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        public async Task<bool> DeleteSubscriberAsync(int id)
        {
            var subscriber = await _dbContext.Subscribers.FindAsync(id);
            if (subscriber == null)
            {
                return false;
            }

            // Check if there are any readings associated with this subscriber
            var hasReadings = await _dbContext.Readings.AnyAsync(r => r.Subscriber.Id == id);
            if (hasReadings)
            {
                return false;
            }

            _dbContext.Subscribers.Remove(subscriber);
            await _dbContext.SaveChangesAsync();

            return true;
        }

        private bool SubscriberExists(int id)
        {
            return (_dbContext?.Subscribers?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
