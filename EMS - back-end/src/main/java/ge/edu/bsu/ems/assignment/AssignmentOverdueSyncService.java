package ge.edu.bsu.ems.assignment;

import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;
import ge.edu.bsu.ems.audit.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Slf4j
public class AssignmentOverdueSyncService {

    private final AssignmentRepository assignmentRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public void syncOverdueAssignments() {
        LocalDateTime now = LocalDateTime.now();

        log.info("Assignment overdue sync started at {}", now);

        List<Assignment> overdueAssignments =
                assignmentRepository.findByStatusAndDueAtBefore(AssignmentStatus.ASSIGNED, now);

        log.info("Assignments to mark OVERDUE: {}", overdueAssignments.size());

        for (Assignment assignment : overdueAssignments) {
            assignment.setStatus(AssignmentStatus.OVERDUE);
            assignmentRepository.save(assignment);

            auditLogService.logSystem(
                    AuditAction.STATUS_SYNC,
                    AuditEntityType.SYSTEM,
                    assignment.getId(),
                    "Assignment status changed from ASSIGNED to OVERDUE"
            );

            log.info("Assignment id={} changed to OVERDUE", assignment.getId());
        }

        log.info("Assignment overdue sync finished at {}", now);
    }
}