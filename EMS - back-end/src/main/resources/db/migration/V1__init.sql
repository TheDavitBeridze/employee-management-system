CREATE TABLE dbo.users (
                           id BIGINT IDENTITY(1,1) PRIMARY KEY,
                           email NVARCHAR(255) NOT NULL UNIQUE,
                           password_hash NVARCHAR(255) NOT NULL,
                           role NVARCHAR(50) NOT NULL,
                           is_enabled BIT NOT NULL CONSTRAINT DF_users_is_enabled DEFAULT 1,
                           created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created_at DEFAULT SYSUTCDATETIME()
);
