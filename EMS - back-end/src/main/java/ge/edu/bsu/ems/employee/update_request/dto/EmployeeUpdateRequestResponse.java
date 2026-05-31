package ge.edu.bsu.ems.employee.update_request.dto;
import ge.edu.bsu.ems.employee.update_request.UpdateRequestStatus;

import java.time.LocalDateTime;

public record EmployeeUpdateRequestResponse(
        Long id,
        Long employeeId,
        UpdateRequestStatus status,

        String requestedFirstName,
        String requestedLastName,
        String requestedEmail,
        boolean passwordRequested,
        String requestedPhone,

        String comment,
        LocalDateTime createdAt,
        LocalDateTime decidedAt,
        Long decidedByUserId
) { }