using API.Datas;
using API.DTO;
using API.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Services
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;
        private readonly IEmailService _emailService;

        public OrderService(
    AppDbContext context,
    IEmailService emailService
)
        {
            _context = context;

            _emailService =
                emailService;
        }

        public async Task<OrderDTO> Checkout(
    ClaimsPrincipal user,
    CreateOrderDTO dto
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
                throw new Exception(
                    "User not found"
                );
            }

            // ==========================
            // VALIDATE SHIPPING
            // ==========================

            if (string.IsNullOrWhiteSpace(dto.ReceiverName))
            {
                throw new Exception(
                    "Vui lòng nhập tên người nhận"
                );
            }

            if (string.IsNullOrWhiteSpace(dto.ReceiverPhone))
            {
                throw new Exception(
                    "Vui lòng nhập số điện thoại"
                );
            }

            if (string.IsNullOrWhiteSpace(dto.ShippingAddress))
            {
                throw new Exception(
                    "Vui lòng nhập địa chỉ giao hàng"
                );
            }

            decimal totalAmount = 0;

            decimal discountAmount = 0;

            Voucher? voucher = null;

            var orderItems =
                new List<OrderItem>();

            // ==========================
            // CALCULATE TOTAL
            // ==========================

            foreach (var item in dto.Items)
            {
                var book =
                    await _context.Books
                    .FirstOrDefaultAsync(
                        x => x.Id == item.BookId
                    );

                if (book == null)
                {
                    continue;
                }

                var availableStock =
                    book.Stock -
                    book.ReservedStock;

                if (
                    availableStock <
                    item.Quantity
                )
                {
                    throw new Exception(
                        $"{book.Title} chỉ còn {availableStock} sản phẩm"
                    );
                }

                book.ReservedStock +=
                    item.Quantity;

                totalAmount +=
                    book.Price *
                    item.Quantity;

                orderItems.Add(
                    new OrderItem
                    {
                        BookId = book.Id,
                        Quantity = item.Quantity,
                        Price = book.Price
                    }
                );
            }

            if (totalAmount <= 0)
            {
                throw new Exception(
                    "Giỏ hàng trống"
                );
            }

            await _context.SaveChangesAsync();

            // ==========================
            // APPLY VOUCHER
            // ==========================

            if (
                !string.IsNullOrEmpty(
                    dto.VoucherCode
                )
            )
            {
                voucher =
                    await _context.Vouchers
                    .FirstOrDefaultAsync(
                        x =>
                            x.Code ==
                            dto.VoucherCode
                            &&
                            x.IsActive
                    );

                if (voucher == null)
                {
                    throw new Exception(
                        "Voucher không tồn tại"
                    );
                }

                if (
                    voucher.StartDate >
                    DateTime.UtcNow
                )
                {
                    throw new Exception(
                        "Voucher chưa bắt đầu"
                    );
                }

                if (
                    voucher.ExpiredAt <
                    DateTime.UtcNow
                )
                {
                    throw new Exception(
                        "Voucher đã hết hạn"
                    );
                }

                if (
                    voucher.Quantity <= 0
                )
                {
                    throw new Exception(
                        "Voucher đã hết lượt"
                    );
                }

                var alreadyUsed =
                    await _context.VoucherUsages
                    .AnyAsync(x =>
                        x.UserId == dbUser.Id
                        &&
                        x.VoucherId ==
                        voucher.Id
                    );

                if (alreadyUsed)
                {
                    throw new Exception(
                        "Bạn đã sử dụng voucher này"
                    );
                }

                if (
                    totalAmount <
                    voucher.MinOrderAmount
                )
                {
                    throw new Exception(
                        $"Đơn tối thiểu {voucher.MinOrderAmount:N0}₫"
                    );
                }

                discountAmount =
                    totalAmount *
                    voucher.DiscountPercent /
                    100;

                if (
                    discountAmount >
                    voucher.MaxDiscountAmount
                )
                {
                    discountAmount =
                        voucher.MaxDiscountAmount;
                }

                voucher.UsedCount++;

                voucher.Quantity--;
            }

            // ==========================
            // CREATE ORDER
            // ==========================

            var order = new Order
            {
                UserId =
                    dbUser.Id,

                VoucherId =
                    voucher?.Id,

                DiscountAmount =
                    discountAmount,

                TotalAmount =
                    totalAmount -
                    discountAmount,

                ReceiverName =
                    dto.ReceiverName,

                ReceiverPhone =
                    dto.ReceiverPhone,

                ShippingAddress =
                    dto.ShippingAddress,

                Status =
                    "Pending",

                CreatedAt =
                    DateTime.UtcNow
            };

            _context.Orders.Add(
                order
            );

            await _context.SaveChangesAsync();

            // ==========================
            // CREATE ORDER ITEMS
            // ==========================

            foreach (var item in orderItems)
            {
                item.OrderId =
                    order.Id;
            }

            _context.OrderItems.AddRange(
                orderItems
            );

            await _context.SaveChangesAsync();

            // ==========================
            // SAVE VOUCHER USAGE
            // ==========================

            if (voucher != null)
            {
                _context.VoucherUsages.Add(
                    new VoucherUsage
                    {
                        UserId =
                            dbUser.Id,

                        VoucherId =
                            voucher.Id,

                        UsedAt =
                            DateTime.UtcNow
                    }
                );

                await _context.SaveChangesAsync();
            }

            // ==========================
            // SEND EMAIL
            // ==========================

            var orderItemsHtml = "";

            foreach (var item in orderItems)
            {
                var book =
                    await _context.Books
                    .FindAsync(
                        item.BookId
                    );

                orderItemsHtml += $@"
<tr>
    <td>{book?.Title}</td>
    <td>{item.Quantity}</td>
    <td>{item.Price:N0}₫</td>
</tr>";
            }

            await _emailService.SendEmailAsync(
                dbUser.Email,
                $"Xác nhận đơn hàng #{order.Id}",
                $@"
<h2>Cảm ơn bạn đã mua hàng</h2>

<p>
Mã đơn hàng:
<strong>#{order.Id}</strong>
</p>

<hr/>

<h3>Thông tin giao hàng</h3>

<p>
Người nhận:
{order.ReceiverName}
</p>

<p>
SĐT:
{order.ReceiverPhone}
</p>

<p>
Địa chỉ:
{order.ShippingAddress}
</p>

<hr/>

<table border='1'
cellpadding='8'
cellspacing='0'>

<tr>
    <th>Sách</th>
    <th>SL</th>
    <th>Giá</th>
</tr>

{orderItemsHtml}

</table>

<br/>

<h3>
Tổng thanh toán:
{order.TotalAmount:N0}₫
</h3>

<p>
Trạng thái:
{order.Status}
</p>"
            );

            // ==========================
            // RESPONSE
            // ==========================

            return new OrderDTO
            {
                Id = order.Id,

                UserId =
                    order.UserId,

                TotalAmount =
                    order.TotalAmount,

                Status =
                    order.Status,

                CreatedAt =
                    order.CreatedAt,

                Items =
                    orderItems.Select(
                        x =>
                            new OrderItemDTO
                            {
                                BookId =
                                    x.BookId,

                                Quantity =
                                    x.Quantity,

                                Price =
                                    x.Price
                            }
                    ).ToList()
            };
        }
        public async Task<
            IEnumerable<OrderDTO>
        > GetMyOrders(
            ClaimsPrincipal user
        )
        {
            var email = user.FindFirst(
                ClaimTypes.Email
            )?.Value;

            var dbUser =
                await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Email == email
                );

            if (dbUser == null)
            {
                throw new Exception(
                    "User not found"
                );
            }

            var orders =
                await _context.Orders.Where(o =>o.UserId == dbUser.Id).Include(o => o.OrderItems)
                .ThenInclude(
                    oi => oi.Book
                )
                .OrderByDescending(
                    o => o.CreatedAt
                )
                .ToListAsync();

            return orders.Select(
                o => new OrderDTO
                {
                    Id = o.Id,

                    UserId =
                        o.UserId,

                    TotalAmount =
                        o.TotalAmount,

                    Status =
                        o.Status,

                    CreatedAt =
                        o.CreatedAt,

                    Items =
                        o.OrderItems
                        .Select(
                            oi =>
                                new OrderItemDTO
                                {
                                    BookId =
                                        oi.BookId,

                                    BookTitle =
                                        oi.Book
                                            ?.Title,

                                    Quantity =
                                        oi.Quantity,

                                    Price =
                                        oi.Price
                                }
                        )
                        .ToList()
                }
            );
        }

        public async Task<IEnumerable<OrderAdminDTO>>
    GetAllOrders()
        {
            return await _context.Orders
                .Include(x => x.User)
                .OrderByDescending(
                    x => x.CreatedAt
                )
                .Select(x =>
                    new OrderAdminDTO
                    {
                        Id = x.Id,

                        UserName =
                            x.User == null
                                ? "Unknown"
                                : x.User.FullName,

                        TotalAmount =
                            x.TotalAmount,

                        Status =
                            x.Status ?? "Pending",

                        CreatedAt =
                            x.CreatedAt
                    }
                )
                .ToListAsync();
        }

        public async Task<bool>
UpdateStatus(int id, string status)
        {
            var order =
                await _context.Orders
                .Include(x => x.OrderItems)
                .ThenInclude(x => x.Book)
                .FirstOrDefaultAsync(
                    x => x.Id == id
                );

            if (order == null)
                return false;

            var oldStatus = order.Status;

            // Pending -> Approved
            if (
                oldStatus == "Pending" &&
                status == "Approved"
            )
            {
                foreach (var item in order.OrderItems)
                {
                    var book = item.Book;

                    if (book == null)
                        continue;

                    if (book.Stock < item.Quantity)
                    {
                        throw new Exception(
                            $"{book.Title} không đủ tồn kho"
                        );
                    }

                    book.Stock -= item.Quantity;

                    book.ReservedStock -= item.Quantity;
                }
            }

            // Pending -> Cancelled
            if (
                oldStatus == "Pending" &&
                status == "Cancelled"
            )
            {
                foreach (var item in order.OrderItems)
                {
                    var book = item.Book;

                    if (book == null)
                        continue;

                    book.ReservedStock -= item.Quantity;
                }
            }

            order.Status = status;

            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<string> CancelOrder(
    int orderId,
    ClaimsPrincipal user)
        {
            var email = user.FindFirst(
                ClaimTypes.Email
            )?.Value;

            var dbUser = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Email == email
                );

            if (dbUser == null)
            {
                throw new Exception("User not found");
            }

            var order = await _context.Orders
                .Include(x => x.OrderItems)
                .FirstOrDefaultAsync(
                    x => x.Id == orderId
                    && x.UserId == dbUser.Id
                );

            if (order == null)
            {
                throw new Exception("Order not found");
            }

            // Không cho hủy đơn đã hủy
            if (order.Status == "Cancelled")
            {
                throw new Exception("Đơn hàng đã bị hủy");
            }

            // Chỉ cho hủy khi Pending
            if (order.Status != "Pending")
            {
                throw new Exception(
                    "Chỉ được hủy đơn đang chờ xử lý"
                );
            }

            order.Status = "Cancelled";

            // Trả lại hàng đã giữ
            foreach (var item in order.OrderItems)
            {
                var book = await _context.Books
                    .FirstOrDefaultAsync(
                        x => x.Id == item.BookId
                    );

                if (book != null)
                {
                    book.ReservedStock -= item.Quantity;

                    if (book.ReservedStock < 0)
                    {
                        book.ReservedStock = 0;
                    }
                }
            }

            await _context.SaveChangesAsync();

            return "Hủy đơn thành công";
        }
    }
}