using ElectricityMeters.Models;
using ElectricityMeters.Request.Prices;
using ElectricityMeters.Response.Prices;
using ElectricityMeters.Services;
using Microsoft.AspNetCore.Mvc;

namespace ElectricityMeters.Controllers
{
    [ApiController]
    [Route("api/prices")]
    public class PricesController : ControllerBase
    {
        private readonly IPriceService _priceService;

        public PricesController(IPriceService priceService)
        {
            _priceService = priceService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Price>>> GetAllPrices()
        {
            var prices = await _priceService.GetAllPricesAsync();
            if (prices == null)
            {
                return NotFound();
            }

            return Ok(prices);
        }

        [HttpPost("search")]
        public async Task<ActionResult<SearchPricesResponse>> SearchPrices([FromBody] SearchPriceRequest request)
        {
            var result = await _priceService.SearchPricesList(request);
            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Price>> InsertPrice(InsertPrice insertPrice)
        {
            if (insertPrice == null)
            {
                return BadRequest();
            }

            var price = await _priceService.InsertPriceAsync(insertPrice);
            if (price == null)
            {
                return BadRequest();
            }

            return CreatedAtAction(nameof(GetAllPrices), new { id = price.Id }, price);
        }

        [HttpPut]
        public async Task<IActionResult> UpdatePrice(EditPrice editPrice)
        {
            var success = await _priceService.UpdatePriceAsync(editPrice);
            if (!success)
            {
                return BadRequest();
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePrice(int id)
        {
            var success = await _priceService.DeletePriceAsync(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
