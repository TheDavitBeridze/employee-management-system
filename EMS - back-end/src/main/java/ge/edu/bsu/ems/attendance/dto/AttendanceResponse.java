package ge.edu.bsu.ems.attendance.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record AttendanceResponse(
        Long id,
        Long employeeId,
        String employeeFirstName,
        String employeeLastName,
        Long departmentId,
        String departmentName,
        LocalDate workDate,
        LocalDateTime checkInTime,
        LocalDateTime checkOutTime,
        LocalDateTime createdAt
) { }