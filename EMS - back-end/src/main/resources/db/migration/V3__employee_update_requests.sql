CREATE TABLE employee_update_requests (
                                          id BIGINT IDENTITY(1,1) PRIMARY KEY,
                                          employee_id BIGINT NOT NULL,
                                          status VARCHAR(20) NOT NULL,
                                          requested_first_name VARCHAR(50) NULL,
                                          requested_last_name VARCHAR(50) NULL,
                                          requested_email VARCHAR(120) NULL,
                                          requested_password_hash VARCHAR(255) NULL,
                                          comment VARCHAR(255) NULL,
                                          created_at DATETIME2 NOT NULL,
                                          decided_at DATETIME2 NULL,
                                          decided_by_user_id BIGINT NULL
);

ALTER TABLE employee_update_requests
    ADD CONSTRAINT fk_employee_update_requests_employee
        FOREIGN KEY (employee_id) REFERENCES employees(id);