package ge.edu.bsu.ems.employee.update_request.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ManagerRejectRequest(
        @NotBlank(message = "reason is required")
        @Size(max = 255, message = "reason max length is 255")
        String reason
) { }