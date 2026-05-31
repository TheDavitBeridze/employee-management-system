package ge.edu.bsu.ems.employee.update_request;

import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.employee.update_request.dto.EmployeeUpdateRequestCreateRequest;
import ge.edu.bsu.ems.employee.update_request.dto.EmployeeUpdateRequestResponse;
import ge.edu.bsu.ems.employee.update_request.dto.ManagerRejectRequest;
import ge.edu.bsu.ems.exception.BadRequestException;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.mail.MailService;
import ge.edu.bsu.ems.mail.MailTemplateService;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmployeeUpdateRequestService {

    private final EmployeeUpdateRequestRepository requestRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MailService mailService;
    private final MailTemplateService mailTemplateService;

    public EmployeeUpdateRequestResponse createForCurrentEmployee(EmployeeUpdateRequestCreateRequest req) {
        Employee employee = getCurrentEmployee();

        if (isBlank(req.firstName()) && isBlank(req.lastName()) && isBlank(req.email()) && isBlank(req.password()) && isBlank(req.phone())) {
            throw new BadRequestException("At least one field must be provided");
        }

        if (requestRepository.existsByEmployeeIdAndStatus(employee.getId(), UpdateRequestStatus.PENDING)) {
            throw new ConflictException("You already have a pending update request");
        }

        if (!isBlank(req.email())) {
            String newEmail = req.email().trim().toLowerCase();
            User currentUser = employee.getUser();
            if (currentUser == null) throw new ConflictException("Employee has no linked User");

            if (!newEmail.equalsIgnoreCase(currentUser.getEmail()) && userRepository.existsByEmailIgnoreCase(newEmail)) {
                throw new ConflictException("Email is already taken");
            }
        }

        EmployeeUpdateRequest entity = EmployeeUpdateRequest.builder()
                .employee(employee)
                .status(UpdateRequestStatus.PENDING)
                .requestedFirstName(blankToNull(req.firstName()))
                .requestedLastName(blankToNull(req.lastName()))
                .requestedEmail(isBlank(req.email()) ? null : req.email().trim().toLowerCase())
                .requestedPhone(isBlank(req.phone()) ? null : req.phone().trim())
                .requestedPasswordHash(isBlank(req.password()) ? null : passwordEncoder.encode(req.password()))
                .createdAt(LocalDateTime.now())
                .build();

        return toResponse(requestRepository.save(entity));
    }

    public List<EmployeeUpdateRequestResponse> listMine() {
        Employee employee = getCurrentEmployee();
        return requestRepository.findByEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public List<EmployeeUpdateRequestResponse> listPendingForManager() {
        Employee managerEmployee = getCurrentEmployee();

        if (managerEmployee.getDepartment() == null) {
            throw new BadRequestException("Manager department is not assigned");
        }

        Long departmentId = managerEmployee.getDepartment().getId();

        return requestRepository
                .findByEmployee_Department_IdAndStatusOrderByCreatedAtDesc(
                        departmentId,
                        UpdateRequestStatus.PENDING
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private void validateManagerDepartmentAccess(Employee managerEmployee, Employee targetEmployee) {
        if (managerEmployee.getDepartment() == null || targetEmployee.getDepartment() == null) {
            throw new ConflictException("Department is not assigned");
        }

        Long managerDepartmentId = managerEmployee.getDepartment().getId();
        Long targetDepartmentId = targetEmployee.getDepartment().getId();

        if (!managerDepartmentId.equals(targetDepartmentId)) {
            throw new ResourceNotFoundException("Update request not found");
        }
    }

    @Transactional
    public EmployeeUpdateRequestResponse approve(Long requestId) {
        EmployeeUpdateRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Update request not found: " + requestId));

        if (req.getStatus() != UpdateRequestStatus.PENDING) {
            throw new ConflictException("Only PENDING requests can be approved");
        }

        Employee managerEmployee = getCurrentEmployee();
        Employee targetEmployee = req.getEmployee();

        validateManagerDepartmentAccess(managerEmployee, targetEmployee);

        if (!isBlank(req.getRequestedFirstName())) {
            targetEmployee.setFirstName(req.getRequestedFirstName());
        }
        if (!isBlank(req.getRequestedLastName())) {
            targetEmployee.setLastName(req.getRequestedLastName());
        }
        if (!isBlank(req.getRequestedPhone())) {
            targetEmployee.setPhone(req.getRequestedPhone());
        }

        User targetUser = targetEmployee.getUser();
        if (targetUser == null) throw new ConflictException("Employee has no linked User");

        if (!isBlank(req.getRequestedEmail())) {
            String newEmail = req.getRequestedEmail().trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(targetUser.getEmail()) && userRepository.existsByEmailIgnoreCase(newEmail)) {
                throw new ConflictException("Email is already taken");
            }
            targetUser.updateEmail(newEmail);
        }

        if (!isBlank(req.getRequestedPasswordHash())) {
            targetUser.updatePasswordHash(req.getRequestedPasswordHash());
        }

        employeeRepository.save(targetEmployee);
        userRepository.save(targetUser);

        req.setStatus(UpdateRequestStatus.APPROVED);
        req.setDecidedAt(LocalDateTime.now());
        req.setDecidedByUserId(managerEmployee.getUser() != null ? managerEmployee.getUser().getId() : null);
        req.setComment("APPROVED");

        EmployeeUpdateRequest saved = requestRepository.save(req);

        sendUpdateApprovedEmail(saved);

        return toResponse(saved);
    }

    @Transactional
    public EmployeeUpdateRequestResponse reject(Long requestId, ManagerRejectRequest body) {
        EmployeeUpdateRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Update request not found: " + requestId));

        if (req.getStatus() != UpdateRequestStatus.PENDING) {
            throw new ConflictException("Only PENDING requests can be rejected");
        }

        Employee managerEmployee = getCurrentEmployee();
        validateManagerDepartmentAccess(managerEmployee, req.getEmployee());

        req.setStatus(UpdateRequestStatus.REJECTED);
        req.setDecidedAt(LocalDateTime.now());
        req.setDecidedByUserId(managerEmployee.getUser() != null ? managerEmployee.getUser().getId() : null);
        req.setComment(body.reason());

        EmployeeUpdateRequest saved = requestRepository.save(req);

        sendUpdateRejectedEmail(saved);

        return toResponse(saved);
    }

    private void sendUpdateApprovedEmail(EmployeeUpdateRequest request) {
        try {
            User targetUser = request.getEmployee().getUser();
            if (targetUser == null || isBlank(targetUser.getEmail())) {
                return;
            }

            String employeeName = buildEmployeeFullName(request.getEmployee());

            mailService.send(
                    targetUser.getEmail(),
                    mailTemplateService.updateRequestApprovedSubject(),
                    mailTemplateService.updateRequestApprovedBody(employeeName)
            );
        } catch (Exception ex) {
            log.error("Failed to send update approval email for updateRequestId={}", request.getId(), ex);
        }
    }

    private void sendUpdateRejectedEmail(EmployeeUpdateRequest request) {
        try {
            User targetUser = request.getEmployee().getUser();
            if (targetUser == null || isBlank(targetUser.getEmail())) {
                return;
            }

            String employeeName = buildEmployeeFullName(request.getEmployee());

            mailService.send(
                    targetUser.getEmail(),
                    mailTemplateService.updateRequestRejectedSubject(),
                    mailTemplateService.updateRequestRejectedBody(employeeName, request.getComment())
            );
        } catch (Exception ex) {
            log.error("Failed to send update rejection email for updateRequestId={}", request.getId(), ex);
        }
    }

    private String buildEmployeeFullName(Employee employee) {
        String firstName = employee.getFirstName() == null ? "" : employee.getFirstName().trim();
        String lastName = employee.getLastName() == null ? "" : employee.getLastName().trim();
        String fullName = (firstName + " " + lastName).trim();
        return fullName.isEmpty() ? "Employee" : fullName;
    }

    private EmployeeUpdateRequestResponse toResponse(EmployeeUpdateRequest e) {
        return new EmployeeUpdateRequestResponse(
                e.getId(),
                e.getEmployee() != null ? e.getEmployee().getId() : null,
                e.getStatus(),
                e.getRequestedFirstName(),
                e.getRequestedLastName(),
                e.getRequestedEmail(),
                e.getRequestedPasswordHash() != null,
                e.getRequestedPhone(),
                e.getComment(),
                e.getCreatedAt(),
                e.getDecidedAt(),
                e.getDecidedByUserId()
        );
    }

    private Employee getCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for userId: " + user.getId()));
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }

    private String blankToNull(String s) {
        return isBlank(s) ? null : s.trim();
    }
}