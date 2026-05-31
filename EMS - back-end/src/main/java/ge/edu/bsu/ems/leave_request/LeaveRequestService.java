package ge.edu.bsu.ems.leave_request;

import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;
import ge.edu.bsu.ems.audit.AuditLogService;
import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.exception.BadRequestException;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.leave_request.dto.LeaveRequestCreateRequest;
import ge.edu.bsu.ems.leave_request.dto.LeaveRequestResponse;
import ge.edu.bsu.ems.leave_request.dto.ManagerLeaveDecisionRequest;
import ge.edu.bsu.ems.mail.MailService;
import ge.edu.bsu.ems.mail.MailTemplateService;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class LeaveRequestService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final MailService mailService;
    private final MailTemplateService mailTemplateService;

    public LeaveRequestResponse createForCurrentEmployee(LeaveRequestCreateRequest req) {
        Employee employee = getCurrentEmployee();

        if (req.startDate().isAfter(req.endDate())) {
            throw new BadRequestException("startDate cannot be after endDate");
        }

        boolean overlaps = leaveRequestRepository
                .existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        employee.getId(),
                        LeaveRequestStatus.APPROVED,
                        req.endDate(),
                        req.startDate()
                );

        if (overlaps) {
            throw new ConflictException("Requested leave overlaps with existing approved leave");
        }

        LeaveRequest leaveRequest = LeaveRequest.builder()
                .employee(employee)
                .startDate(req.startDate())
                .endDate(req.endDate())
                .reason(req.reason().trim())
                .status(LeaveRequestStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(leaveRequestRepository.save(leaveRequest));
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> listMine() {
        Employee employee = getCurrentEmployee();

        return leaveRequestRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeaveRequestResponse> listPendingForManager() {
        Employee managerEmployee = getCurrentEmployee();

        if (managerEmployee.getDepartment() == null) {
            throw new BadRequestException("Manager department is not assigned");
        }

        Long departmentId = managerEmployee.getDepartment().getId();

        return leaveRequestRepository
                .findByEmployee_Department_IdAndStatusOrderByCreatedAtDesc(
                        departmentId,
                        LeaveRequestStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public LeaveRequestResponse approve(Long requestId, ManagerLeaveDecisionRequest req) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + requestId));

        if (leaveRequest.getStatus() != LeaveRequestStatus.PENDING) {
            throw new ConflictException("Only PENDING requests can be approved");
        }

        Employee managerEmployee = getCurrentEmployee();
        validateManagerDepartmentAccess(managerEmployee, leaveRequest.getEmployee());

        boolean overlaps = leaveRequestRepository
                .existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        leaveRequest.getEmployee().getId(),
                        LeaveRequestStatus.APPROVED,
                        leaveRequest.getEndDate(),
                        leaveRequest.getStartDate()
                );

        if (overlaps) {
            throw new ConflictException("Leave overlaps with existing approved leave");
        }

        leaveRequest.setStatus(LeaveRequestStatus.APPROVED);
        leaveRequest.setManagerComment(blankToNull(req.managerComment()));
        leaveRequest.setDecidedAt(LocalDateTime.now());
        leaveRequest.setDecidedByUserId(managerEmployee.getUser().getId());

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        auditLogService.logForCurrentUser(
                AuditAction.APPROVE,
                AuditEntityType.LEAVE_REQUEST,
                saved.getId(),
                "Approved leave request for employeeId=" + saved.getEmployee().getId()
                        + ", period=" + saved.getStartDate() + " to " + saved.getEndDate()
        );

        sendLeaveApprovedEmail(saved);

        return toResponse(saved);
    }

    public LeaveRequestResponse reject(Long requestId, ManagerLeaveDecisionRequest req) {
        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + requestId));

        if (leaveRequest.getStatus() != LeaveRequestStatus.PENDING) {
            throw new ConflictException("Only PENDING requests can be rejected");
        }

        Employee managerEmployee = getCurrentEmployee();
        validateManagerDepartmentAccess(managerEmployee, leaveRequest.getEmployee());

        leaveRequest.setStatus(LeaveRequestStatus.REJECTED);
        leaveRequest.setManagerComment(blankToNull(req.managerComment()));
        leaveRequest.setDecidedAt(LocalDateTime.now());
        leaveRequest.setDecidedByUserId(managerEmployee.getUser().getId());

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        auditLogService.logForCurrentUser(
                AuditAction.REJECT,
                AuditEntityType.LEAVE_REQUEST,
                saved.getId(),
                "Rejected leave request for employeeId=" + saved.getEmployee().getId()
        );

        sendLeaveRejectedEmail(saved);

        return toResponse(saved);
    }

    public LeaveRequestResponse cancelMyRequest(Long requestId) {
        Employee employee = getCurrentEmployee();

        LeaveRequest leaveRequest = leaveRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Leave request not found: " + requestId));

        if (!leaveRequest.getEmployee().getId().equals(employee.getId())) {
            throw new ResourceNotFoundException("Leave request not found: " + requestId);
        }

        if (leaveRequest.getStatus() != LeaveRequestStatus.PENDING) {
            throw new ConflictException("Only PENDING requests can be cancelled");
        }

        leaveRequest.setStatus(LeaveRequestStatus.CANCELLED);

        LeaveRequest saved = leaveRequestRepository.save(leaveRequest);

        auditLogService.logForCurrentUser(
                AuditAction.CANCEL,
                AuditEntityType.LEAVE_REQUEST,
                saved.getId(),
                "Cancelled own leave request"
        );

        return toResponse(saved);
    }

    private void sendLeaveApprovedEmail(LeaveRequest leaveRequest) {
        try {
            User targetUser = leaveRequest.getEmployee().getUser();
            if (targetUser == null || isBlank(targetUser.getEmail())) {
                return;
            }

            String employeeName = buildEmployeeFullName(leaveRequest.getEmployee());

            mailService.send(
                    targetUser.getEmail(),
                    mailTemplateService.leaveRequestApprovedSubject(),
                    mailTemplateService.leaveRequestApprovedBody(
                            employeeName,
                            String.valueOf(leaveRequest.getStartDate()),
                            String.valueOf(leaveRequest.getEndDate()),
                            leaveRequest.getManagerComment()
                    )
            );
        } catch (Exception ex) {
            log.error("Failed to send leave approval email for leaveRequestId={}", leaveRequest.getId(), ex);
        }
    }

    private void sendLeaveRejectedEmail(LeaveRequest leaveRequest) {
        try {
            User targetUser = leaveRequest.getEmployee().getUser();
            if (targetUser == null || isBlank(targetUser.getEmail())) {
                return;
            }

            String employeeName = buildEmployeeFullName(leaveRequest.getEmployee());

            mailService.send(
                    targetUser.getEmail(),
                    mailTemplateService.leaveRequestRejectedSubject(),
                    mailTemplateService.leaveRequestRejectedBody(
                            employeeName,
                            String.valueOf(leaveRequest.getStartDate()),
                            String.valueOf(leaveRequest.getEndDate()),
                            leaveRequest.getManagerComment()
                    )
            );
        } catch (Exception ex) {
            log.error("Failed to send leave rejection email for leaveRequestId={}", leaveRequest.getId(), ex);
        }
    }

    private String buildEmployeeFullName(Employee employee) {
        String firstName = employee.getFirstName() == null ? "" : employee.getFirstName().trim();
        String lastName = employee.getLastName() == null ? "" : employee.getLastName().trim();
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? "Employee" : fullName;
    }

    private LeaveRequestResponse toResponse(LeaveRequest leaveRequest) {
        return new LeaveRequestResponse(
                leaveRequest.getId(),
                leaveRequest.getEmployee().getId(),
                leaveRequest.getStartDate(),
                leaveRequest.getEndDate(),
                leaveRequest.getReason(),
                leaveRequest.getStatus(),
                leaveRequest.getManagerComment(),
                leaveRequest.getCreatedAt(),
                leaveRequest.getDecidedAt(),
                leaveRequest.getDecidedByUserId()
        );
    }

    private Employee getCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for userId: " + user.getId()));
    }

    private void validateManagerDepartmentAccess(Employee managerEmployee, Employee targetEmployee) {
        if (managerEmployee.getDepartment() == null || targetEmployee.getDepartment() == null) {
            throw new ConflictException("Department is not assigned");
        }

        Long managerDepartmentId = managerEmployee.getDepartment().getId();
        Long targetDepartmentId = targetEmployee.getDepartment().getId();

        if (!managerDepartmentId.equals(targetDepartmentId)) {
            throw new ResourceNotFoundException("Leave request not found");
        }
    }

    private String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}