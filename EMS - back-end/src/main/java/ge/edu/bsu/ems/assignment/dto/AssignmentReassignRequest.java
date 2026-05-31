package ge.edu.bsu.ems.assignment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record AssignmentReassignRequest(
        @NotNull(message = "newEmployeeId is required")
        Long newEmployeeId,

        @NotNull(message = "newDueAt is required")
        @Future(message = "newDueAt must be in the future")
        LocalDateTime newDueAt,

        @Size(max = 1000, message = "managerComment max length is 1000")
        String managerComment
) { }