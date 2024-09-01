using ElectricityMeters.Base;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace ElectricityMeters.Services
{
    public class DataGroupService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DataGroupService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetCurrentUserDataGroup()
        {
            // Логика за извличане на DataGroup от текущия потребител
            
            /*var user = _httpContextAccessor.HttpContext.User;
            var userId = user != null && user.Identity.IsAuthenticated ? int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier)) : 0;
            var isAuthenticated = user != null && user.Identity.IsAuthenticated;

            if (!user.Identity.IsAuthenticated)
            {
                throw new UnauthorizedAccessException("UserIsNotAuthenticated");
            }*/
            // Предполага се, че DataGroup е записан като claim, вземете го оттук
            return 1;
            // return int.Parse(user.FindFirst("DataGroup").Value);
        }

        public void SetDataGroupForEntity(BaseEntity entity)
        {
            entity.DataGroup = GetCurrentUserDataGroup();
        }
    }

}
