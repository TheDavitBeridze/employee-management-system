CREATE TABLE dbo.departments (
                                 id BIGINT IDENTITY PRIMARY KEY,
                                 name NVARCHAR(100) NOT NULL UNIQUE,
                                 description NVARCHAR(255) NULL,
                                 created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);