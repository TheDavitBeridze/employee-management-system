package ge.edu.bsu.ems.assignment.dto;

import ge.edu.bsu.ems.assignment.AssignmentStatus;

import java.time.LocalDateTime;

public record AssignmentResponse(
        Long id,
        String title,
        String description,
        AssignmentStatus status,

        Long departmentId,
        String departmentName,

        Long managerEmployeeId,

        Long assignedEmployeeId,
        String assignedEmployeeName,

        LocalDateTime createdAt,
        LocalDateTime assignedAt,
        LocalDateTime dueAt,

        String managerComment,
        String submissionComment,
        String submissionLink,

        String submissionFileName,
        String submissionFileContentType,

        LocalDateTime submittedAt,
        LocalDateTime reviewedAt
) { }