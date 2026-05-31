package ge.edu.bsu.ems.department.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DepartmentUpdateRequest(
        @NotBlank(message = "name is required")
        @Size(min = 2, max = 100, message = "name must be 2-100 characters")
        String name,

        @Size(max = 255, message = "description max length is 255")
        String description
) { }