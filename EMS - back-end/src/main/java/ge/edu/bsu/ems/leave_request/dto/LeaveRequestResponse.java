package ge.edu.bsu.ems.leave_request.dto;

import ge.edu.bsu.ems.leave_request.LeaveRequestStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record LeaveRequestResponse(
        Long id,
        Long employeeId,
        LocalDate startDate,
        LocalDate endDate,
        String reason,
        LeaveRequestStatus status,
        String managerComment,
        LocalDateTime createdAt,
        LocalDateTime decidedAt,
        Long decidedByUserId
) { }