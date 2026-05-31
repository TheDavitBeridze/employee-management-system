package ge.edu.bsu.ems.assignment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AssignmentCreateRequest(
        @NotBlank(message = "title is required")
        @Size(max = 200, message = "title max length is 200")
        String title,

        @NotBlank(message = "description is required")
        @Size(max = 2000, message = "description max length is 2000")
        String description
) { }