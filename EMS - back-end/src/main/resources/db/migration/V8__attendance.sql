CREATE TABLE dbo.attendances (
                                 id BIGINT IDENTITY(1,1) PRIMARY KEY,
                                 employee_id BIGINT NOT NULL,
                                 work_date DATE NOT NULL,
                                 check_in_time DATETIME2 NOT NULL,
                                 check_out_time DATETIME2 NULL,
                                 created_at DATETIME2 NOT NULL,

                                 CONSTRAINT FK_attendances_employee
                                     FOREIGN KEY (employee_id) REFERENCES dbo.employees(id),

                                 CONSTRAINT UK_attendances_employee_work_date
                                     UNIQUE (employee_id, work_date)
);

CREATE INDEX IX_attendances_employee_id
    ON dbo.attendances(employee_id);

CREATE INDEX IX_attendances_work_date
    ON dbo.attendances(work_date);

CREATE INDEX IX_attendances_employee_work_date
    ON dbo.attendances(employee_id, work_date);

CREATE INDEX IX_attendances_department_lookup
    ON dbo.attendances(employee_id, check_out_time, work_date);