package ge.edu.bsu.ems.attendance.dto;

import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public record DepartmentAttendanceSearchRequest(
        @Positive(message = "employeeId must be positive")
        Long employeeId,

        @PastOrPresent(message = "fromDate cannot be in the future")
        LocalDate fromDate,

        @PastOrPresent(message = "toDate cannot be in the future")
        LocalDate toDate,

        Boolean openOnly
) { }