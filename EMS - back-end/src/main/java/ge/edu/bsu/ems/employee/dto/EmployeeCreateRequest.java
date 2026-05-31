package ge.edu.bsu.ems.employee.dto;

import ge.edu.bsu.ems.department.Department;
import ge.edu.bsu.ems.employee.EmployeeStatus;
import ge.edu.bsu.ems.position.Position;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EmployeeCreateRequest(

        @NotNull Long userId,

        @NotBlank @Size(max = 100) String firstName,
        @NotBlank @Size(max = 100) String lastName,

        @NotBlank @Size(max = 50) String personalNumber,

        @Size(max = 50) String phone,

        LocalDate birthDate,

        @NotNull LocalDate hireDate,

        @NotNull EmployeeStatus status,

        @NotNull Long departmentId,
        @NotNull Long positionId
) {}
