package ge.edu.bsu.ems.employee.dto;

import ge.edu.bsu.ems.employee.EmployeeStatus;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeUpdateRequest(
        @NotBlank @Size(max = 50) String firstName,
        @NotBlank @Size(max = 50) String lastName,
        @NotBlank @Size(max = 60) String newEmail,
        @NotBlank @Size(max = 60) String newPassword
) {}