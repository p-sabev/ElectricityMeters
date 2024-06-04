using ElectricityMeters.Interfaces;
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
        private readonly ISubscriberService _subscriberService;

        public SubscribersController(ISubscriberService subscriberService)
        {
            _subscriberService = subscriberService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Subscriber>>> GetAllSubscribers()
        {
            var subscribers = await _subscriberService.GetAllSubscribersAsync();
            if (subscribers == null)
            {
                return NotFound();
            }

            return Ok(subscribers);
        }

        [HttpPost]
        public async Task<ActionResult<Subscriber>> InsertSubscriber(InsertSubscriber insertSubscriber)
        {
            var subscriber = await _subscriberService.InsertSubscriberAsync(insertSubscriber);
            if (subscriber == null)
            {
                return BadRequest("Invalid Switchboard Id.");
            }

            return CreatedAtAction(nameof(GetAllSubscribers), new { id = subscriber.Id }, subscriber);
        }

        [HttpPut]
        public async Task<IActionResult> EditSubscriber(EditSubscriber editSubscriber)
        {
            var result = await _subscriberService.EditSubscriberAsync(editSubscriber);
            if (!result)
            {
                return BadRequest("Invalid Switchboard Id or Subscriber does not exist.");
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscriber(int id)
        {
            var result = await _subscriberService.DeleteSubscriberAsync(id);
            if (!result)
            {
                return BadRequest("Cannot delete the subscriber as there are readings associated with them.");
            }

            return NoContent();
        }
    }
}
