package ge.edu.bsu.ems.employee.dto;

import ge.edu.bsu.ems.employee.EmployeeStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record EmployeeResponse(
        Long id,
        Long userId,
        String firstName,
        String lastName,
        String personalNumber,
        String phone,
        LocalDate birthDate,
        LocalDate hireDate,
        EmployeeStatus status,
        BigDecimal salary,
        Long departmentId,
        String departmentName,
        Long positionId,
        String positionName,
        LocalDateTime createdAt
) {}
