using ElectricityMeters.Interfaces;
using ElectricityMeters.Models;
using ElectricityMeters.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.Text;
using Serilog;
using Serilog.Events;
using System.Security.Claims;


var builder = WebApplication.CreateBuilder(args);

// Configure Serilog from appsettings.json
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "C:\\LOGS\\ElectricityMeters\\API.txt",
        rollingInterval: RollingInterval.Day,
        restrictedToMinimumLevel: LogEventLevel.Information)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container.

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DbContext")));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 8;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = true;
    options.Password.RequireLowercase = false;
})
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false;
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Issuer"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        RoleClaimType = "role",
        NameClaimType = "name"
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = async context =>
        {
            context.Response.StatusCode = 401;
            context.Response.ContentType = "text/plain";

            await context.Response.CompleteAsync();

            return;
        },
        OnTokenValidated = async context =>
        {
            var userService = context.HttpContext.RequestServices.GetRequiredService<UserManager<ApplicationUser>>();
            var userId = context.Principal.FindFirstValue(ClaimTypes.NameIdentifier);
            var user = await userService.FindByIdAsync(userId);

            if (user == null)
            {
                context.Fail("Unauthorized");
                return; // Ensure the event stops processing
            }

            await Task.CompletedTask;
        },
    };
});



builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IPriceService, PriceService>();
builder.Services.AddScoped<IReadingsService, ReadingService>();
builder.Services.AddScoped<ISubscriberService, SubscriberService>();
builder.Services.AddScoped<ISwitchboardService, SwitchboardService>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
builder.Services.AddScoped<ISettingsService, SettingsService>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<DataGroupService>();

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.SwaggerDoc("v1", new OpenApiInfo { Title = "ElectricMetersAPI", Version = "v1" });
    opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Please enter bearer token",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "bearer"
    });

    opt.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type=ReferenceType.SecurityScheme,
                    Id="Bearer"
                }
            },
            new string[]{}
        }
    });
});


if (!builder.Environment.IsDevelopment())
{
    // Configure CORS
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigins",
            builder =>
            {
                builder.WithOrigins(
                    "http://localhost:4200",
                    "http://192.168.0.207:4200",
                    "http://91.139.199.178:4200",
                    "http://elmeters.website:4200",
                    "http://elmeters.website",
                    "https://localhost:4200",
                    "https://192.168.0.207:4200",
                    "https://91.139.199.178:4200",
                    "https://elmeters.website:4200",
                    "https://elmeters.website",
                    "https://www.elmeters.website",
                    "http://www.elmeters.website",
                    "www.elmeters.website")
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .AllowCredentials();
            });
    });

    builder.WebHost.UseKestrel(options =>
    {
        options.ListenAnyIP(7007, listenOptions =>
        {
            listenOptions.UseHttps("C:\\Users\\Administrator\\elmeters-certificate.pfx", "");
        });
    });

    builder.WebHost.UseUrls("https://*:7007");
    builder.Host.UseWindowsService();
}

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseCors("AllowSpecificOrigins");
}

// Configure the HTTP request pipeline.
// if (app.Environment.IsDevelopment())
// {
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

CultureInfo.DefaultThreadCurrentCulture = CultureInfo.InvariantCulture;
CultureInfo.DefaultThreadCurrentUICulture = CultureInfo.InvariantCulture;

app.Run();

SeedRoles(app.Services).Wait();



async Task SeedRoles(IServiceProvider serviceProvider)
{
    var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();

    string[] roleNames = { "Administrator", "Moderator", "Basic" };
    foreach (var roleName in roleNames)
    {
        var roleExist = await roleManager.RoleExistsAsync(roleName);
        if (!roleExist)
        {
            await roleManager.CreateAsync(new IdentityRole(roleName));
        }
    }
}
