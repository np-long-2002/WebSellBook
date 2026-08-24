using API.Datas;
using API.Models;
using API.Services;
using API.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Resend;
using System.Text;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);

// ========================================
// Environment Variables
// ========================================
var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION");
var jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET");
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER");
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
var resendApiKey = Environment.GetEnvironmentVariable("RESEND_API_KEY");
var adminEmail = Environment.GetEnvironmentVariable("ADMIN_EMAIL");
var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD");

if (string.IsNullOrEmpty(connectionString))
    throw new Exception("DB_CONNECTION is missing");
if (string.IsNullOrEmpty(jwtSecret))
    throw new Exception("JWT_SECRET is missing");
if (string.IsNullOrEmpty(jwtIssuer))
    throw new Exception("JWT_ISSUER is missing");
if (string.IsNullOrEmpty(jwtAudience))
    throw new Exception("JWT_AUDIENCE is missing");

// ========================================
// Controllers
// ========================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ========================================
// Database
// ========================================
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// ========================================
// JWT Authentication
// ========================================
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret))
        };
    });

// ========================================
// Swagger
// ========================================
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Input JWT Token"
        }
    );

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        }
    );
});

// ========================================
// CORS
// ========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowReact",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173",
                    "https://web-sell-book.vercel.app" // Thay bằng domain Vercel chính xác của bạn
                )
                .SetIsOriginAllowedToAllowWildcardSubdomains()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

// ========================================
// Resend
// ========================================
builder.Services.Configure<ResendClientOptions>(o =>
{
    o.ApiToken = resendApiKey;
});

builder.Services.AddHttpClient<ResendClient>();
builder.Services.AddTransient<IResend, ResendClient>();

// ========================================
// Dependency Injection
// ========================================
builder.Services.AddScoped<IBookService, BookService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IAuthorService, AuthorService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
builder.Services.AddScoped<IPromotionService, PromotionService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<IProfileService, ProfileService>();

builder.Services.AddSingleton<SupabaseStorageService>();

// ========================================
// Build App
// ========================================
var app = builder.Build();

// ========================================
// Middleware
// ========================================
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// ========================================
// Auto Migration
// ========================================
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    await db.Database.MigrateAsync();

    if (!await db.Users.AnyAsync(x => x.Role == "Admin"))
    {
        var admin = new User
        {
            FullName = "Administrator",
            Email = adminEmail ?? "admin@websellbook.com",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword ?? "Admin@123"),
            Role = "Admin",
            IsVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();

        Console.WriteLine("Admin account created!");
    }
}

app.Run();