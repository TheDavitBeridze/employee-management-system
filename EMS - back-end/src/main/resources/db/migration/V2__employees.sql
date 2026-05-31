CREATE TABLE dbo.employees (
                               id BIGINT IDENTITY(1,1) PRIMARY KEY,

                               user_id BIGINT NOT NULL UNIQUE,  -- 1:1 user

                               first_name NVARCHAR(100) NOT NULL,
                               last_name NVARCHAR(100) NOT NULL,

                               personal_number NVARCHAR(50) NOT NULL UNIQUE,
                               phone NVARCHAR(50) NULL,
                               birth_date DATE NULL,

                               hire_date DATE NOT NULL,
                               status NVARCHAR(20) NOT NULL,

                               salary DECIMAL(12,2) NULL,

                               department_id BIGINT NULL,
                               position_id BIGINT NULL,

                               created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

ALTER TABLE dbo.employees
    ADD CONSTRAINT fk_employee_user
        FOREIGN KEY (user_id) REFERENCES dbo.users(id);
