package ge.edu.bsu.ems.employee.update_request;

import ge.edu.bsu.ems.employee.Employee;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "employee_update_requests")
public class EmployeeUpdateRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UpdateRequestStatus status;

    @Column(name = "requested_first_name", length = 50)
    private String requestedFirstName;

    @Column(name = "requested_last_name", length = 50)
    private String requestedLastName;

    @Column(name = "requested_email", length = 120)
    private String requestedEmail;

    @Column(name = "requested_phone", length = 20)
    private String requestedPhone;

    @Column(name = "requested_password_hash", length = 255)
    private String requestedPasswordHash;

    @Column(length = 255)
    private String comment;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "decided_at")
    private LocalDateTime decidedAt;

    @Column(name = "decided_by_user_id")
    private Long decidedByUserId;




}