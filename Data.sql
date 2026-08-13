SET IDENTITY_INSERT Authors ON;

INSERT INTO Authors (Id, Name, Bio)
VALUES
(1,N'Nguyễn Nhật Ánh',N'Tác giả nổi tiếng Việt Nam'),
(2,N'Tô Hoài',N'Tác giả Dế Mèn Phiêu Lưu Ký'),
(3,N'Haruki Murakami',N'Nhà văn Nhật Bản'),
(4,N'Dale Carnegie',N'Tác giả Đắc Nhân Tâm'),
(5,N'Robert Kiyosaki',N'Tác giả Cha Giàu Cha Nghèo');

SET IDENTITY_INSERT Authors OFF;



SET IDENTITY_INSERT Categories ON;

INSERT INTO Categories (Id, Name)
VALUES
(1,N'Tiểu thuyết'),
(2,N'Kinh doanh'),
(3,N'Kỹ năng sống'),
(4,N'Thiếu nhi'),
(5,N'Văn học nước ngoài');

SET IDENTITY_INSERT Categories OFF;



SET IDENTITY_INSERT Books ON;

INSERT INTO Books
(
    Id,
    Title,
    Description,
    Price,
    Stock,
    AuthorId,
    CategoryId,
    ImageUrl,
    CreatedAt
)
VALUES

(
1,
N'Mắt Biếc',
N'Tiểu thuyết nổi tiếng của Nguyễn Nhật Ánh',
120000,
50,
1,
1,
'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
GETDATE()
),

(
2,
N'Tôi Thấy Hoa Vàng Trên Cỏ Xanh',
N'Tác phẩm nổi tiếng của Nguyễn Nhật Ánh',
135000,
45,
1,
1,
'https://images.unsplash.com/photo-1512820790803-83ca734da794',
GETDATE()
),

(
3,
N'Dế Mèn Phiêu Lưu Ký',
N'Tác phẩm kinh điển dành cho thiếu nhi',
95000,
60,
2,
4,
'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
GETDATE()
),

(
4,
N'Rừng Na Uy',
N'Tiểu thuyết nổi tiếng của Haruki Murakami',
180000,
30,
3,
5,
'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
GETDATE()
),

(
5,
N'Kafka Bên Bờ Biển',
N'Tác phẩm nổi tiếng của Murakami',
190000,
25,
3,
5,
'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
GETDATE()
),

(
6,
N'Đắc Nhân Tâm',
N'Sách kỹ năng bán chạy nhất thế giới',
150000,
100,
4,
3,
'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
GETDATE()
),

(
7,
N'Quẳng Gánh Lo Đi Và Vui Sống',
N'Sách phát triển bản thân',
145000,
80,
4,
3,
'https://images.unsplash.com/photo-1512820790803-83ca734da794',
GETDATE()
),

(
8,
N'Cha Giàu Cha Nghèo',
N'Kiến thức tài chính cá nhân',
170000,
70,
5,
2,
'https://images.unsplash.com/photo-1541963463532-d68292c34b19',
GETDATE()
),

(
9,
N'Dạy Con Làm Giàu',
N'Sách đầu tư tài chính',
185000,
55,
5,
2,
'https://images.unsplash.com/photo-1495446815901-a7297e633e8d',
GETDATE()
),

(
10,
N'Bí Mật Tư Duy Triệu Phú',
N'Tư duy tài chính thành công',
165000,
40,
5,
2,
'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
GETDATE()
),

(
11,
N'Nhà Giả Kim',
N'Tác phẩm truyền cảm hứng',
160000,
50,
3,
5,
'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
GETDATE()
),

(
12,
N'Không Gia Đình',
N'Tiểu thuyết kinh điển',
140000,
30,
3,
5,
'https://images.unsplash.com/photo-1512820790803-83ca734da794',
GETDATE()
);

SET IDENTITY_INSERT Books OFF;



SET IDENTITY_INSERT Vouchers ON;

INSERT INTO Vouchers
(
    Id,
    Code,
    DiscountPercent,
    MaxDiscountAmount,
    MinOrderAmount,
    Quantity,
    UsedCount,
    StartDate,
    ExpiredAt,
    IsActive
)
VALUES

(
1,
'WELCOME10',
10,
50000,
100000,
100,
0,
GETDATE(),
DATEADD(MONTH,6,GETDATE()),
1
),

(
2,
'SALE20',
20,
100000,
300000,
50,
0,
GETDATE(),
DATEADD(MONTH,3,GETDATE()),
1
),

(
3,
'FREESHIP',
5,
30000,
50000,
200,
0,
GETDATE(),
DATEADD(YEAR,1,GETDATE()),
1
),

(
4,
'BOOK30',
30,
150000,
500000,
20,
0,
GETDATE(),
DATEADD(MONTH,2,GETDATE()),
1
),

(
5,
'VIP50',
50,
200000,
1000000,
10,
0,
GETDATE(),
DATEADD(MONTH,1,GETDATE()),
1
);

SET IDENTITY_INSERT Vouchers OFF;