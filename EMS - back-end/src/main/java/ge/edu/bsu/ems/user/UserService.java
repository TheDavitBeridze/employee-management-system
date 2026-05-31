package ge.edu.bsu.ems.user;

import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;
import ge.edu.bsu.ems.audit.AuditLog;
import ge.edu.bsu.ems.audit.AuditLogService;
import ge.edu.bsu.ems.user.dto.UserCreateRequest;
import ge.edu.bsu.ems.user.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

//    public UserService(UserRepository repo, PasswordEncoder passwordEncoder) {
//        this.repo = repo;
//        this.passwordEncoder = passwordEncoder;
//    }

    private final AuditLogService auditLogService;

    public UserResponse create(UserCreateRequest req) {

        if (repo.existsByEmailIgnoreCase(req.email)) {
            throw new RuntimeException("Email already exists");
        }

        String hash = passwordEncoder.encode(req.password);

        User user = User.builder()
                .email(req.email.toLowerCase())
                .passwordHash(hash)
                .role(req.role)
                .enabled(true)
                .build();

        User saved = repo.save(user);

        //აუდიტ ლოგისთვის
        auditLogService.logForCurrentUser(
                AuditAction.CREATE,
                AuditEntityType.USER,
                saved.getId(),
                "Created user with email=" + saved.getEmail() + ", role=" + saved.getRole()
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public UserResponse getById(long id) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> search(String q) {
        List<User> users = (q == null || q.isBlank())
                ? repo.findAll()
                : repo.findByEmailContainingIgnoreCase(q);

        return users.stream().map(this::toResponse).toList();
    }

    public UserResponse setRole(long id, UserRole role) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        UserRole oldRole = user.getRole();
        user.updateRole(role);

        //აუდიტ ლოგისთვის
        auditLogService.logForCurrentUser(
                AuditAction.ROLE_CHANGE,
                AuditEntityType.USER,
                user.getId(),
                "Changed user role from " + oldRole + " to " + role
        );


        return toResponse(user);
    }

    public UserResponse setEnabled(long id, boolean enabled) {
        User user = repo.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (enabled){
            user.enable();
            auditLogService.logForCurrentUser(
                    AuditAction.ENABLE,
                    AuditEntityType.USER,
                    user.getId(),
                    "Enabled user with email=" + user.getEmail()
            );
        }
        else {
            user.disable();
            auditLogService.logForCurrentUser(
                    AuditAction.DISABLE,
                    AuditEntityType.USER,
                    user.getId(),
                    "Disabled user with email=" + user.getEmail()
            );
        }

        return toResponse(user);
    }

    private UserResponse toResponse(User u) {
        UserResponse r = new UserResponse();
        r.id = u.getId();
        r.email = u.getEmail();
        r.role = u.getRole();
        r.enabled = u.isEnabled();
        r.createdAt = u.getCreatedAt();
        return r;
    }
}