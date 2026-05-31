package ge.edu.bsu.ems.audit;

import ge.edu.bsu.ems.audit.dto.AuditLogResponse;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
// to-do
// საწყისი ვერსიაა, დიდი ალბათობით დავააფდეითებ ისე რომ პროცესების ავტომატიზირება მოხდეს AOP (Aspect-Oriented Programming)-ით თუ არ შემეზარა**
@Service
@RequiredArgsConstructor
@Transactional
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public void logForCurrentUser(AuditAction action,
                                  AuditEntityType entityType,
                                  Long entityId,
                                  String details) {

        String currentEmail = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + currentEmail));

        AuditLog log = AuditLog.builder()
                .actorUserId(user.getId())
                .actorEmail(user.getEmail())
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();

        auditLogRepository.save(log);
    }

    //აუდიტ ლოგი სისტემისთვის (ენთითის ნაცვლად system ჩაიწერება ლოგში)
    public void logSystem(AuditAction action,
                          AuditEntityType entityType,
                          Long entityId,
                          String details) {

        AuditLog log = AuditLog.builder()
                .actorUserId(null)
                .actorEmail("SYSTEM")
                .action(action)
                .entityType(entityType)
                .entityId(entityId)
                .details(details)
                .build();

        auditLogRepository.save(log);
    }


    // ადმინისთვის ფილტრები
    @Transactional(readOnly = true)
    public List<AuditLogResponse> listAll() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> listByEntityType(AuditEntityType entityType) {
        return auditLogRepository.findByEntityTypeOrderByCreatedAtDesc(entityType)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> listByActorUserId(Long actorUserId) {
        return auditLogRepository.findByActorUserIdOrderByCreatedAtDesc(actorUserId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AuditLogResponse> listByEntity(AuditEntityType entityType, Long entityId) {
        return auditLogRepository.findByEntityTypeAndEntityIdOrderByCreatedAtDesc(entityType, entityId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getActorUserId(),
                log.getActorEmail(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getDetails(),
                log.getCreatedAt()
        );
    }
}
