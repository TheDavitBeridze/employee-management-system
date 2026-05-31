CREATE TABLE dbo.positions (
                               id BIGINT IDENTITY PRIMARY KEY,
                               name NVARCHAR(100) NOT NULL UNIQUE,
                               base_salary DECIMAL(18,2) NOT NULL,
                               created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);