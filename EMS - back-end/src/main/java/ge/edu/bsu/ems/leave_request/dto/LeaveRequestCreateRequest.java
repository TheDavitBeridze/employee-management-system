package ge.edu.bsu.ems.leave_request.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record LeaveRequestCreateRequest(
        @NotNull(message = "start date is required")
        @FutureOrPresent(message = "start date cannot be in the past")
        LocalDate startDate,

        @NotNull(message = "end date is required")
        @FutureOrPresent(message = "end date cannot be in the past")
        LocalDate endDate,

        @NotBlank(message = "reason is required")
        @Size(max = 500, message = "reason max length is 500")
        String reason
) { }