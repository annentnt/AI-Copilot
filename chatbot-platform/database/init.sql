CREATE DATABASE ChatbotPlatform;
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT GETDATE()
);