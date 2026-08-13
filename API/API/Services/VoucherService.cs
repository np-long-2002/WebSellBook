using API.Datas;
using API.DTO;
using API.Models;
using API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly AppDbContext _context;

        public VoucherService(
            AppDbContext context
        )
        {
            _context = context;
        }

        public async Task<List<VoucherDTO>> GetAllAsync()
        {
            return await _context.Vouchers
                .Select(v => new VoucherDTO
                {
                    Id = v.Id,
                    Code = v.Code,
                    DiscountPercent = v.DiscountPercent,
                    MaxDiscountAmount = v.MaxDiscountAmount,
                    MinOrderAmount = v.MinOrderAmount,
                    Quantity = v.Quantity,
                    UsedCount = v.UsedCount,
                    StartDate = v.StartDate,
                    ExpiredAt = v.ExpiredAt,
                    IsActive = v.IsActive
                })
                .ToListAsync();
        }

        public async Task<VoucherResultDTO>
            ApplyVoucherAsync(
            ApplyVoucherDTO dto,
            ClaimsPrincipal user
        )
        {
            var email =
                user.FindFirst(
                    ClaimTypes.Email
                )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "User không tồn tại"
                };
            }

            var voucher =
                await _context.Vouchers
                .FirstOrDefaultAsync(
                    v => v.Code == dto.Code
                );

            if (voucher == null)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "Voucher không tồn tại"
                };
            }

            var used =
                await _context.VoucherUsages
                .AnyAsync(x =>
                    x.UserId == dbUser.Id &&
                    x.VoucherId == voucher.Id
                );

            if (used)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "Bạn đã sử dụng voucher này rồi"
                };
            }

            if (!voucher.IsActive)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "Voucher đã bị khóa"
                };
            }

            if (DateTime.Now < voucher.StartDate)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "Voucher chưa có hiệu lực"
                };
            }

            if (DateTime.Now > voucher.ExpiredAt)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "Voucher đã hết hạn"
                };
            }

            if (voucher.Quantity <= 0)
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message = "Voucher đã hết lượt sử dụng"
                };
            }

            if (
                dto.OrderAmount <
                voucher.MinOrderAmount
            )
            {
                return new VoucherResultDTO
                {
                    IsValid = false,
                    Message =
                        $"Đơn hàng tối thiểu {voucher.MinOrderAmount:N0}₫"
                };
            }

            decimal discount =
                dto.OrderAmount *
                voucher.DiscountPercent / 100;

            if (
                discount >
                voucher.MaxDiscountAmount
            )
            {
                discount =
                    voucher.MaxDiscountAmount;
            }

            return new VoucherResultDTO
            {
                IsValid = true,
                Message = "Áp dụng thành công",
                VoucherCode = voucher.Code,
                DiscountAmount = discount,
                FinalAmount =
                    dto.OrderAmount - discount
            };
        }

        public async Task<VoucherDTO>
            CreateAsync(
            CreateVoucherDTO dto
        )
        {
            var existed =
                await _context.Vouchers
                .AnyAsync(v =>
                    v.Code == dto.Code
                );

            if (existed)
            {
                throw new Exception(
                    "Voucher code already exists"
                );
            }

            var voucher =
                new Voucher
                {
                    Code = dto.Code,
                    DiscountPercent =
                        dto.DiscountPercent,
                    MaxDiscountAmount =
                        dto.MaxDiscountAmount,
                    MinOrderAmount =
                        dto.MinOrderAmount,
                    Quantity =
                        dto.Quantity,
                    UsedCount = 0,
                    StartDate =
                        dto.StartDate,
                    ExpiredAt =
                        dto.ExpiredAt,
                    IsActive = true
                };

            _context.Vouchers.Add(
                voucher
            );

            await _context.SaveChangesAsync();

            return new VoucherDTO
            {
                Id = voucher.Id,
                Code = voucher.Code,
                DiscountPercent =
                    voucher.DiscountPercent,
                MaxDiscountAmount =
                    voucher.MaxDiscountAmount,
                MinOrderAmount =
                    voucher.MinOrderAmount,
                Quantity =
                    voucher.Quantity,
                UsedCount =
                    voucher.UsedCount,
                StartDate =
                    voucher.StartDate,
                ExpiredAt =
                    voucher.ExpiredAt,
                IsActive =
                    voucher.IsActive
            };
        }

        public async Task<bool>
            UpdateAsync(
            int id,
            UpdateVoucherDTO dto
        )
        {
            var voucher =
                await _context.Vouchers
                .FirstOrDefaultAsync(
                    x => x.Id == id
                );

            if (voucher == null)
                return false;

            voucher.Code =
                dto.Code;

            voucher.DiscountPercent =
                dto.DiscountPercent;

            voucher.MaxDiscountAmount =
                dto.MaxDiscountAmount;

            voucher.MinOrderAmount =
                dto.MinOrderAmount;

            voucher.Quantity =
                dto.Quantity;

            voucher.StartDate =
                dto.StartDate;

            voucher.ExpiredAt =
                dto.ExpiredAt;

            voucher.IsActive =
                dto.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
            DeleteAsync(
            int id
        )
        {
            var voucher =
                await _context.Vouchers
                .FirstOrDefaultAsync(
                    x => x.Id == id
                );

            if (voucher == null)
                return false;

            _context.Vouchers.Remove(
                voucher
            );

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool>
            ToggleActiveAsync(
            int id
        )
        {
            var voucher =
                await _context.Vouchers
                .FirstOrDefaultAsync(
                    x => x.Id == id
                );

            if (voucher == null)
                return false;

            voucher.IsActive =
                !voucher.IsActive;

            await _context.SaveChangesAsync();

            return true;
        }
    }
}