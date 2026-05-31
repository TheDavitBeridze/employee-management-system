package ge.edu.bsu.ems.employee.dto;

import ge.edu.bsu.ems.user.UserRole;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;

public record StaffCreateRequest(

        @NotBlank(message = "email is required")
        @Email(message = "email must be valid")
        @Size(max = 255, message = "email max length is 255")
        String email,

        @NotBlank(message = "password is required")
        @Size(min = 6, max = 72, message = "password must be 6-72 characters")
        String password,

        @NotNull(message = "role is required")
        UserRole role,

        @NotBlank(message = "firstName is required")
        @Size(max = 50, message = "firstName max length is 50")
        String firstName,

        @NotBlank(message = "lastName is required")
        @Size(max = 50, message = "lastName max length is 50")
        String lastName,

        @NotBlank(message = "personalNumber is required")
        @Size(max = 50, message = "personalNumber max length is 50")
        String personalNumber,

        @NotBlank(message = "phone is required")
        @Size(max = 20, message = "phone max length is 20")
        String phone,

        @NotNull(message = "birthDate is required")
        LocalDate birthDate,

        @NotNull(message = "hireDate is required")
        LocalDate hireDate,


        @DecimalMin(value = "0.0", inclusive = true, message = "salary must be non-negative")
        BigDecimal salary,

        @NotNull(message = "departmentId is required")
        Long departmentId,

        @NotNull(message = "positionId is required")
        Long positionId
) { }