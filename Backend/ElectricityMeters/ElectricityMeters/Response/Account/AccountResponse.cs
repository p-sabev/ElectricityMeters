namespace ElectricityMeters.Response.Account
{
    public class SearchResponse
    {
        public required List<SearchData> Data { get; set; }
        public required int TotalRecords { get; set; }
    }

    public class SearchData
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public List<string>? RoleIds { get; set; }
    }

    public class RolesList
    {
        public List<Role> Roles { get; set; }
    }

    public class Role
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }
}
