CREATE TABLE dbo.leave_requests (
                                    id BIGINT IDENTITY PRIMARY KEY,
                                    employee_id BIGINT NOT NULL,
                                    start_date DATE NOT NULL,
                                    end_date DATE NOT NULL,
                                    reason NVARCHAR(500) NOT NULL,
                                    status VARCHAR(20) NOT NULL,
                                    manager_comment NVARCHAR(500) NULL,
                                    created_at DATETIME2 NOT NULL,
                                    decided_at DATETIME2 NULL,
                                    decided_by_user_id BIGINT NULL,

                                    CONSTRAINT FK_leave_requests_employee
                                        FOREIGN KEY (employee_id) REFERENCES dbo.employees(id)
);