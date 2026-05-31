CREATE TABLE dbo.audit_logs (
                                id BIGINT IDENTITY PRIMARY KEY,
                                actor_user_id BIGINT NULL,
                                actor_email NVARCHAR(255) NULL,
                                action VARCHAR(50) NOT NULL,
                                entity_type VARCHAR(50) NOT NULL,
                                entity_id BIGINT NULL,
                                details NVARCHAR(1000) NULL,
                                created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);