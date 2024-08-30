using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Request.Prices;
using ElectricityMeters.Request.Subscribers;
using ElectricityMeters.Response.Prices;
using ElectricityMeters.Response.Subscribers;
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

        [HttpPost("search")]
        public async Task<ActionResult<SearchSubscribersResponse>> SearchSubscribers([FromBody] SearchSubscribersRequest request)
        {
            var result = await _subscriberService.SearchSubscribersList(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Subscriber>> InsertSubscriber(InsertSubscriber insertSubscriber)
        {
            try
            {
                var subscriber = await _subscriberService.InsertSubscriberAsync(insertSubscriber);
                if (subscriber == null)
                {
                    return BadRequest("SomethingWentWrong");
                }

                return CreatedAtAction(nameof(GetAllSubscribers), new { id = subscriber.Id }, subscriber);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [HttpPut]
        public async Task<IActionResult> EditSubscriber(EditSubscriber editSubscriber)
        {
            try
            {
                var result = await _subscriberService.EditSubscriberAsync(editSubscriber);
                if (!result)
                {
                    return BadRequest("SomethingWentWrong");
                }

                return NoContent();
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubscriber(int id)
        {
            try
            {
                var result = await _subscriberService.DeleteSubscriberAsync(id);
                if (!result)
                {
                    return BadRequest("SomethingWentWrong");
                }

                return NoContent();
            } catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }
    }
}
