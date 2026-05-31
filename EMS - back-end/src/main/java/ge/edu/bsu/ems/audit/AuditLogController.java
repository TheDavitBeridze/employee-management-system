package ge.edu.bsu.ems.audit;

import ge.edu.bsu.ems.audit.dto.AuditLogResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/audit-logs")
public class AuditLogController {

    private final AuditLogService auditLogService;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<AuditLogResponse> listAll() {
        return auditLogService.listAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/entity-type/{entityType}")
    public List<AuditLogResponse> listByEntityType(@PathVariable AuditEntityType entityType) {
        return auditLogService.listByEntityType(entityType);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/actor/{actorUserId}")
    public List<AuditLogResponse> listByActorUserId(@PathVariable Long actorUserId) {
        return auditLogService.listByActorUserId(actorUserId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/entity/{entityType}/{entityId}")
    public List<AuditLogResponse> listByEntity(
            @PathVariable AuditEntityType entityType,
            @PathVariable Long entityId
    ) {
        return auditLogService.listByEntity(entityType, entityId);
    }
}