package ge.edu.bsu.ems.attendance.dto;

import jakarta.validation.constraints.PastOrPresent;

import java.time.LocalDate;

public record MyAttendanceSearchRequest(
        @PastOrPresent(message = "fromDate cannot be in the future")
        LocalDate fromDate,

        @PastOrPresent(message = "toDate cannot be in the future")
        LocalDate toDate,

        Boolean openOnly
) { }