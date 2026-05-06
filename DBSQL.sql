-- =========================
-- CREATE DATABASE
-- =========================
CREATE DATABASE WebSellBook;
GO

USE WebSellBook;
GO

-- =========================
-- USERS
-- =========================
CREATE TABLE Users (
    Id INT PRIMARY KEY IDENTITY,
    Email NVARCHAR(255) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(255),
    Role NVARCHAR(50) DEFAULT 'User',
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =========================
-- AUTHORS
-- =========================
CREATE TABLE Authors (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(255),
    Bio NVARCHAR(MAX)
);

-- =========================
-- CATEGORIES
-- =========================
CREATE TABLE Categories (
    Id INT PRIMARY KEY IDENTITY,
    Name NVARCHAR(255)
);

-- =========================
-- BOOKS
-- =========================
CREATE TABLE Books (
    Id INT PRIMARY KEY IDENTITY,
    Title NVARCHAR(255),
    Description NVARCHAR(MAX),
    Price DECIMAL(10,2),
    Stock INT,
    AuthorId INT,
    CategoryId INT,
    ImageUrl NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (AuthorId) REFERENCES Authors(Id),
    FOREIGN KEY (CategoryId) REFERENCES Categories(Id)
);

-- =========================
-- CARTS
-- =========================
CREATE TABLE Carts (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT,
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =========================
-- CART ITEMS
-- =========================
CREATE TABLE CartItems (
    Id INT PRIMARY KEY IDENTITY,
    CartId INT,
    BookId INT,
    Quantity INT,

    FOREIGN KEY (CartId) REFERENCES Carts(Id),
    FOREIGN KEY (BookId) REFERENCES Books(Id)
);

-- =========================
-- ORDERS
-- =========================
CREATE TABLE Orders (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT,
    TotalAmount DECIMAL(10,2),
    Status NVARCHAR(50),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id)
);

-- =========================
-- ORDER ITEMS
-- =========================
CREATE TABLE OrderItems (
    Id INT PRIMARY KEY IDENTITY,
    OrderId INT,
    BookId INT,
    Quantity INT,
    Price DECIMAL(10,2),

    FOREIGN KEY (OrderId) REFERENCES Orders(Id),
    FOREIGN KEY (BookId) REFERENCES Books(Id)
);

-- =========================
-- REVIEWS
-- =========================
CREATE TABLE Reviews (
    Id INT PRIMARY KEY IDENTITY,
    UserId INT,
    BookId INT,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment NVARCHAR(MAX),
    CreatedAt DATETIME DEFAULT GETDATE(),

    FOREIGN KEY (UserId) REFERENCES Users(Id),
    FOREIGN KEY (BookId) REFERENCES Books(Id)
);

-- =========================
-- INDEX (TĂNG TỐC)
-- =========================
CREATE INDEX idx_books_title ON Books(Title);
CREATE INDEX idx_books_category ON Books(CategoryId);
CREATE INDEX idx_orders_user ON Orders(UserId);

-- =========================
-- SAMPLE DATA
-- =========================

INSERT INTO Authors (Name) VALUES 
('Nguyễn Nhật Ánh'),
('J.K. Rowling');

INSERT INTO Categories (Name) VALUES 
('Tiểu thuyết'),
('Fantasy');

INSERT INTO Books (Title, Price, Stock, AuthorId, CategoryId)
VALUES
('Cho tôi xin một vé đi tuổi thơ', 50000, 10, 1, 1),
('Harry Potter', 150000, 20, 2, 2);
