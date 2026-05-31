CREATE TABLE dbo.assignments (
                                 id BIGINT IDENTITY PRIMARY KEY,
                                 title NVARCHAR(200) NOT NULL,
                                 description NVARCHAR(2000) NOT NULL,
                                 status VARCHAR(30) NOT NULL,

                                 department_id BIGINT NOT NULL,
                                 manager_employee_id BIGINT NOT NULL,
                                 assigned_employee_id BIGINT NULL,

                                 created_at DATETIME2 NOT NULL,
                                 assigned_at DATETIME2 NULL,
                                 due_at DATETIME2 NULL,

                                 manager_comment NVARCHAR(1000) NULL,
                                 submission_comment NVARCHAR(2000) NULL,
                                 submission_link NVARCHAR(1000) NULL,

                                 submission_file_name NVARCHAR(255) NULL,
                                 submission_file_content_type NVARCHAR(255) NULL,
                                 submission_file_data VARBINARY(MAX) NULL,

                                 submitted_at DATETIME2 NULL,
                                 reviewed_at DATETIME2 NULL,

                                 CONSTRAINT FK_assignments_department
                                     FOREIGN KEY (department_id) REFERENCES dbo.departments(id),

                                 CONSTRAINT FK_assignments_manager_employee
                                     FOREIGN KEY (manager_employee_id) REFERENCES dbo.employees(id),

                                 CONSTRAINT FK_assignments_assigned_employee
                                     FOREIGN KEY (assigned_employee_id) REFERENCES dbo.employees(id)
);