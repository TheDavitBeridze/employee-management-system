package ge.edu.bsu.ems.assignment.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDateTime;

public record AssignmentDeadlineUpdateRequest(
        @NotNull(message = "dueAt is required")
        @Future(message = "dueAt must be in the future")
        LocalDateTime dueAt,

        @Size(max = 1000, message = "managerComment max length is 1000")
        String managerComment
) { }