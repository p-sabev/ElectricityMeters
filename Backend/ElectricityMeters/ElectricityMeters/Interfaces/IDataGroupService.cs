using ElectricityMeters.Base;

namespace ElectricityMeters.Interfaces
{
    public interface IDataGroupService
    {
        int GetCurrentUserDataGroup();
        void SetDataGroupForEntity(BaseEntity entity);
    }
}
