package ge.edu.bsu.ems.position.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PositionCreateRequest(
        @NotBlank(message = "name is required")
        @Size(min = 2, max = 100, message = "name must be 2-100 characters")
        String name,

        @NotNull(message = "baseSalary is required")
        @DecimalMin(value = "0.0", inclusive = false, message = "baseSalary must be greater than 0")
        BigDecimal baseSalary
) { }