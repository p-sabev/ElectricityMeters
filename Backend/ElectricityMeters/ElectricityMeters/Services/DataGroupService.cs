using ElectricityMeters.Base;
using ElectricityMeters.Interfaces;

namespace ElectricityMeters.Services
{
    public class DataGroupService : IDataGroupService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public DataGroupService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public int GetCurrentUserDataGroup()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null || !user.Identity.IsAuthenticated)
            {
                throw new UnauthorizedAccessException("UserIsNotAuthenticated");
            }

            var dataGroupClaim = user.FindFirst("DataGroup");
            if (dataGroupClaim == null)
            {
                throw new UnauthorizedAccessException("DataGroupClaimNotFound");
            }

            if (!int.TryParse(dataGroupClaim.Value, out int dataGroup))
            {
                throw new FormatException("Invalid DataGroup claim value");
            }

            return dataGroup;
        }

        public void SetDataGroupForEntity(BaseEntity entity)
        {
            entity.DataGroup = GetCurrentUserDataGroup();
        }
    }

}
