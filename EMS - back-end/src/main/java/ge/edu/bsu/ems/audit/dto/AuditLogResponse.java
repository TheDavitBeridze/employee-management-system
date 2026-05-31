package ge.edu.bsu.ems.audit.dto;

import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;

import java.time.LocalDateTime;

public record AuditLogResponse(
        Long id,
        Long actorUserId,
        String actorEmail,
        AuditAction action,
        AuditEntityType entityType,
        Long entityId,
        String details,
        LocalDateTime createdAt
) { }