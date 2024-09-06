using ElectricityMeters.Models;
using ElectricityMeters.Request.Prices;
using ElectricityMeters.Response.Prices;
using ElectricityMeters.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

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
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<Price>>> GetAllPrices()
        {
            try
            {
                var prices = await _priceService.GetAllPricesAsync();
                if (prices == null)
                {
                    return NotFound();
                }

                return Ok(prices);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            
        }

        [HttpPost("search")]
        [Authorize]
        public async Task<ActionResult<SearchPricesResponse>> SearchPrices([FromBody] SearchPriceRequest request)
        {
            var result = await _priceService.SearchPricesList(request);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<Price>> InsertPrice(InsertPrice insertPrice)
        {
            if (insertPrice == null)
            {
                return BadRequest("PriceIsRequired");
            }

            try
            {
                var price = await _priceService.InsertPriceAsync(insertPrice);
                if (price == null)
                {
                    return BadRequest("PriceIsRequired");
                }

                return CreatedAtAction(nameof(GetAllPrices), new { id = price.Id }, price);
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> UpdatePrice(EditPrice editPrice)
        {
            try
            {
                var success = await _priceService.UpdatePriceAsync(editPrice);
                if (!success)
                {
                    return BadRequest();
                }
            } catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeletePrice(int id)
        {
            try
            {
                var success = await _priceService.DeletePriceAsync(id);
                if (!success)
                {
                    return NotFound();
                }
            } catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
            

            return NoContent();
        }
    }
}
