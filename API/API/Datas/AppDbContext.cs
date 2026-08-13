using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Datas
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(
        DbContextOptions<AppDbContext> options
        ) : base(options)
        {
        }
        // ==========================
        // TABLES
        // ==========================

        public DbSet<Book> Books { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Cart> Carts { get; set; }

        public DbSet<CartItem> CartItems { get; set; }

        public DbSet<Order> Orders { get; set; }

        public DbSet<OrderItem> OrderItems { get; set; }

        public DbSet<Review> Reviews { get; set; }

        public DbSet<Author> Authors { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Voucher> Vouchers { get; set; }
        public DbSet<VoucherUsage> VoucherUsages { get; set; }
        public DbSet<Promotion> Promotions { get; set; }

        public DbSet<PromotionBook> PromotionBooks { get; set; }

        public DbSet<PromotionCategory> PromotionCategories { get; set; }
        protected override void OnModelCreating(
            ModelBuilder modelBuilder
        )
        {
            base.OnModelCreating(modelBuilder);

            // ==================================
            // BOOK
            // ==================================

            modelBuilder.Entity<Book>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Title)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(x => x.Price)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.ImageUrl)
                    .HasMaxLength(1000);

                entity.Property(x => x.Description)
                    .HasMaxLength(4000);

                entity.HasOne(x => x.Author)
                    .WithMany(x => x.Books)
                    .HasForeignKey(x => x.AuthorId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(x => x.Category)
                    .WithMany(x => x.Books)
                    .HasForeignKey(x => x.CategoryId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ==================================
            // USER
            // ==================================

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.FullName)
                    .HasMaxLength(200);

                entity.Property(x => x.Email)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.HasIndex(x => x.Email)
                    .IsUnique();

                entity.Property(x => x.PasswordHash)
                    .IsRequired();

                entity.Property(x => x.Role)
                    .HasMaxLength(50);
            });

            // ==================================
            // AUTHOR
            // ==================================

            modelBuilder.Entity<Author>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            // ==================================
            // CATEGORY
            // ==================================

            modelBuilder.Entity<Category>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Name)
                    .IsRequired()
                    .HasMaxLength(255);
            });

            // ==================================
            // CART
            // ==================================

            modelBuilder.Entity<Cart>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.HasOne(x => x.User)
                    .WithOne(x => x.Cart)
                    .HasForeignKey<Cart>(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ==================================
            // CART ITEM
            // ==================================

            modelBuilder.Entity<CartItem>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Quantity)
                    .HasDefaultValue(1);

                entity.HasOne(x => x.Cart)
                    .WithMany(x => x.CartItems)
                    .HasForeignKey(x => x.CartId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Book)
                    .WithMany(x => x.CartItems)
                    .HasForeignKey(x => x.BookId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ==================================
            // ORDER
            // ==================================

            modelBuilder.Entity<Order>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.TotalAmount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.DiscountAmount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.Status)
                    .HasMaxLength(50);

                entity.HasOne(x => x.User)
                    .WithMany(x => x.Orders)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Voucher)
                    .WithMany(x => x.Orders)
                    .HasForeignKey(x => x.VoucherId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // ==================================
            // ORDER ITEM
            // ==================================

            modelBuilder.Entity<OrderItem>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Price)
                    .HasColumnType("decimal(18,2)");

                entity.HasOne(x => x.Order)
                    .WithMany(x => x.OrderItems)
                    .HasForeignKey(x => x.OrderId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Book)
                    .WithMany(x => x.OrderItems)
                    .HasForeignKey(x => x.BookId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // ==================================
            // REVIEW
            // ==================================

            modelBuilder.Entity<Review>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Comment)
                    .HasMaxLength(2000);

                entity.HasOne(x => x.User)
                    .WithMany(x => x.Reviews)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.Book)
                    .WithMany(x => x.Reviews)
                    .HasForeignKey(x => x.BookId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // ==================================
            // VOUCHER
            // ==================================

            modelBuilder.Entity<Voucher>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.Property(x => x.Code)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.HasIndex(x => x.Code)
                    .IsUnique();

                entity.Property(x => x.DiscountPercent)
                    .HasColumnType("decimal(5,2)");

                entity.Property(x => x.MaxDiscountAmount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.MinOrderAmount)
                    .HasColumnType("decimal(18,2)");

                entity.Property(x => x.Quantity)
                    .HasDefaultValue(0);

                entity.Property(x => x.UsedCount)
                    .HasDefaultValue(0);

                entity.Property(x => x.IsActive)
                    .HasDefaultValue(true);
            });

            // ==================================
            // VOUCHER USAGE
            // ==================================

            modelBuilder.Entity<VoucherUsage>(entity =>
            {
                entity.HasKey(x => x.Id);

                entity.HasOne(x => x.Voucher)
                    .WithMany(x => x.VoucherUsages)
                    .HasForeignKey(x => x.VoucherId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(x => x.User)
                    .WithMany(x => x.VoucherUsages)
                    .HasForeignKey(x => x.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasIndex(x => new
                {
                    x.VoucherId,
                    x.UserId
                }).IsUnique();
            });
            modelBuilder.Entity<PromotionBook>()
     .HasKey(x => new
     {
         x.PromotionId,
         x.BookId
     });

            modelBuilder.Entity<PromotionBook>()
                .HasOne(x => x.Promotion)
                .WithMany(x => x.PromotionBooks)
                .HasForeignKey(x => x.PromotionId);

            modelBuilder.Entity<PromotionBook>()
                .HasOne(x => x.Book)
                .WithMany()
                .HasForeignKey(x => x.BookId);

            modelBuilder.Entity<PromotionCategory>()
                .HasKey(x => new
                {
                    x.PromotionId,
                    x.CategoryId
                });

            modelBuilder.Entity<PromotionCategory>()
                .HasOne(x => x.Promotion)
                .WithMany(x => x.PromotionCategories)
                .HasForeignKey(x => x.PromotionId);

            modelBuilder.Entity<PromotionCategory>()
                .HasOne(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId);
        }
        }
}
