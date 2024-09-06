namespace ElectricityMeters.Request.Account
{
    public class RegisterModel
    {
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }

    public class RoleModel
    {
        public string Name { get; set; }
    }

    public class SearchModel
    {
        public required Paging Paging { get; set; }
        public required Sorting Sorting { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
    }

    public class EditModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string UserName { get; set; }
        public List<string> RoleIds { get; set; }
    }
}
