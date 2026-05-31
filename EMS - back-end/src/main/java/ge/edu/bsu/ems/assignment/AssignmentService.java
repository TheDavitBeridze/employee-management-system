package ge.edu.bsu.ems.assignment;

import ge.edu.bsu.ems.assignment.dto.*;
import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;
import ge.edu.bsu.ems.audit.AuditLogService;
import ge.edu.bsu.ems.department.Department;
import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.exception.BadRequestException;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.notification.NotificationService;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import ge.edu.bsu.ems.assignment.dto.AssignmentFileDownloadResponse;
import ge.edu.bsu.ems.assignment.dto.AssignmentSubmitForm;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;


    public AssignmentResponse createDraft(AssignmentCreateRequest req) {
        Employee manager = getCurrentEmployee();

        if (manager.getDepartment() == null) {
            throw new BadRequestException("Manager department is not assigned");
        }

        Assignment assignment = Assignment.builder()
                .title(req.title().trim())
                .description(req.description().trim())
                .status(AssignmentStatus.DRAFT)
                .department(manager.getDepartment())
                .manager(manager)
                .createdAt(LocalDateTime.now())
                .build();

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.CREATE,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Created assignment draft: title=" + saved.getTitle()
        );

        return toResponse(saved);
    }


    public AssignmentResponse assign(Long assignmentId, AssignmentAssignRequest req) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);
        Employee manager = getCurrentEmployee();

        Employee targetEmployee = employeeRepository.findById(req.employeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + req.employeeId()));

        validateManagerDepartmentAccess(manager, targetEmployee);

        if (assignment.getStatus() != AssignmentStatus.DRAFT) {
            throw new ConflictException("Only DRAFT assignments can be assigned");
        }

        assignment.setAssignedEmployee(targetEmployee);
        assignment.setAssignedAt(LocalDateTime.now());
        assignment.setDueAt(req.dueAt());
        assignment.setManagerComment(blankToNull(req.managerComment()));
        assignment.setStatus(AssignmentStatus.ASSIGNED);

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.UPDATE,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Assigned assignment to employeeId=" + targetEmployee.getId()
        );

        try {
            notificationService.sendAssignmentAssignedEmail(
                    targetEmployee.getUser().getEmail(),
                    targetEmployee.getFirstName() + " " + targetEmployee.getLastName(),
                    saved.getTitle(),
                    manager.getFirstName() + " " + manager.getLastName()
            );
        } catch (Exception ex) {
            log.error("Failed to send assignment assigned email for assignmentId={} to employeeId={}",
                    saved.getId(),
                    targetEmployee.getId(),
                    ex);
        }

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> listMine() {
        Employee employee = getCurrentEmployee();

        return assignmentRepository.findByAssignedEmployeeIdOrderByCreatedAtDesc(employee.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<AssignmentResponse> listForManagerDepartment() {
        Employee manager = getCurrentEmployee();

        if (manager.getDepartment() == null) {
            throw new BadRequestException("Manager department is not assigned");
        }

        Long departmentId = manager.getDepartment().getId();

        return assignmentRepository.findByDepartment_IdOrderByCreatedAtDesc(departmentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }


    public AssignmentResponse submit(Long assignmentId, AssignmentSubmitForm form, MultipartFile file) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

        Employee employee = getCurrentEmployee();

        if (assignment.getAssignedEmployee() == null
                || !assignment.getAssignedEmployee().getId().equals(employee.getId())) {
            throw new ResourceNotFoundException("Assignment not found: " + assignmentId);
        }

        if (assignment.getStatus() != AssignmentStatus.ASSIGNED
                && assignment.getStatus() != AssignmentStatus.OVERDUE) {
            throw new ConflictException("Only ASSIGNED or OVERDUE assignments can be submitted");
        }

        assignment.setSubmissionComment(form.submissionComment().trim());
        assignment.setSubmissionLink(blankToNull(form.submissionLink()));

        if (file != null && !file.isEmpty()) {
            try {
                assignment.setSubmissionFileName(file.getOriginalFilename());
                assignment.setSubmissionFileContentType(
                        file.getContentType() == null || file.getContentType().isBlank()
                                ? "application/octet-stream"
                                : file.getContentType()
                );
                assignment.setSubmissionFileData(file.getBytes());
            } catch (IOException ex) {
                throw new BadRequestException("Failed to read uploaded file");
            }
        }

        assignment.setSubmittedAt(LocalDateTime.now());
        assignment.setStatus(AssignmentStatus.SUBMITTED);

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.UPDATE,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Submitted assignment id=" + saved.getId()
        );

        return toResponse(saved);
    }


    public AssignmentResponse approve(Long assignmentId, AssignmentDecisionRequest req) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);
        Employee employee = assignment.getAssignedEmployee();

        if (assignment.getStatus() != AssignmentStatus.SUBMITTED) {
            throw new ConflictException("Only SUBMITTED assignments can be approved");
        }

        assignment.setStatus(AssignmentStatus.APPROVED);
        assignment.setManagerComment(blankToNull(req.managerComment()));
        assignment.setReviewedAt(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.APPROVE,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Approved assignment id=" + saved.getId()
        );

        try {
            notificationService.sendAssignmentApprovedEmail(
                    employee.getUser().getEmail(),
                    employee.getFirstName() + " " + employee.getLastName(),
                    saved.getTitle(),
                    req.managerComment()
            );
        } catch (Exception ex) {
            log.error("Failed to send assignment approved email for assignmentId={} to employeeId={}",
                    saved.getId(),
                    employee.getId(),
                    ex);
        }

        return toResponse(saved);
    }

    public AssignmentResponse reject(Long assignmentId, AssignmentDecisionRequest req) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);
        Employee employee = assignment.getAssignedEmployee();

        if (assignment.getStatus() != AssignmentStatus.SUBMITTED) {
            throw new ConflictException("Only SUBMITTED assignments can be rejected");
        }

        assignment.setStatus(AssignmentStatus.REJECTED);
        assignment.setManagerComment(blankToNull(req.managerComment()));
        assignment.setReviewedAt(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.REJECT,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Rejected assignment id=" + saved.getId()
        );

        try {
            notificationService.sendAssignmentRejectedEmail(
                    employee.getUser().getEmail(),
                    employee.getFirstName() + " " + employee.getLastName(),
                    saved.getTitle(),
                    req.managerComment()
            );
        } catch (Exception ex) {
            log.error("Failed to send assignment rejected email for assignmentId={} to employeeId={}",
                    saved.getId(),
                    employee.getId(),
                    ex);
        }

        return toResponse(saved);
    }


    public AssignmentResponse updateDeadline(Long assignmentId, AssignmentDeadlineUpdateRequest req) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);

        if (assignment.getAssignedAt() == null) {
            throw new ConflictException("Assignment is not yet assigned");
        }

        if (!assignment.getAssignedAt().isBefore(req.dueAt())) {
            throw new BadRequestException("dueAt must be after assignedAt");
        }

        assignment.setDueAt(req.dueAt());
        assignment.setManagerComment(blankToNull(req.managerComment()));

        // if it was overdue and manager extended deadline, task becomes ASSIGNED again
        if (assignment.getStatus() == AssignmentStatus.OVERDUE) {
            assignment.setStatus(AssignmentStatus.ASSIGNED);
        }

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.UPDATE,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Updated assignment deadline to " + saved.getDueAt()
        );

        return toResponse(saved);
    }


    public AssignmentResponse reassign(Long assignmentId, AssignmentReassignRequest req) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);
        Employee manager = getCurrentEmployee();

        Employee newEmployee = employeeRepository.findById(req.newEmployeeId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + req.newEmployeeId()));

        validateManagerDepartmentAccess(manager, newEmployee);

        if (assignment.getStatus() == AssignmentStatus.APPROVED
                || assignment.getStatus() == AssignmentStatus.CANCELLED) {
            throw new ConflictException("Assignment cannot be reassigned in current status");
        }

        LocalDateTime reassignedAt = LocalDateTime.now();

        if (!reassignedAt.isBefore(req.newDueAt())) {
            throw new BadRequestException("newDueAt must be after reassignment time");
        }

        assignment.setAssignedEmployee(newEmployee);
        assignment.setAssignedAt(reassignedAt);
        assignment.setDueAt(req.newDueAt());
        assignment.setManagerComment(blankToNull(req.managerComment()));

        // old submission is cleared because task is re-opened for another employee
        assignment.setSubmissionComment(null);
        assignment.setSubmissionLink(null);
        assignment.setSubmissionFileName(null);
        assignment.setSubmissionFileContentType(null);
        assignment.setSubmissionFileData(null);
        assignment.setSubmittedAt(null);
        assignment.setReviewedAt(null);

        assignment.setStatus(AssignmentStatus.ASSIGNED);

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.UPDATE,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Reassigned assignment to employeeId=" + newEmployee.getId()
        );

        return toResponse(saved);
    }

    public AssignmentResponse cancel(Long assignmentId, AssignmentDecisionRequest req) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);

        if (assignment.getStatus() == AssignmentStatus.APPROVED) {
            throw new ConflictException("Approved assignment cannot be cancelled");
        }

        assignment.setStatus(AssignmentStatus.CANCELLED);
        assignment.setManagerComment(blankToNull(req.managerComment()));
        assignment.setReviewedAt(LocalDateTime.now());

        Assignment saved = assignmentRepository.save(assignment);

        auditLogService.logForCurrentUser(
                AuditAction.CANCEL,
                AuditEntityType.SYSTEM,
                saved.getId(),
                "Cancelled assignment id=" + saved.getId()
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public AssignmentFileDownloadResponse downloadSubmissionFile(Long assignmentId) {
        Assignment assignment = getManagerVisibleAssignment(assignmentId);

        if (assignment.getSubmissionFileData() == null || assignment.getSubmissionFileData().length == 0) {
            throw new ResourceNotFoundException("Submission file not found for assignment: " + assignmentId);
        }

        String fileName = assignment.getSubmissionFileName();
        if (fileName == null || fileName.isBlank()) {
            fileName = "assignment-submission";
        }

        String contentType = assignment.getSubmissionFileContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        return new AssignmentFileDownloadResponse(
                fileName,
                contentType,
                assignment.getSubmissionFileData()
        );
    }

//helper methods
    private Assignment getManagerVisibleAssignment(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found: " + assignmentId));

        Employee manager = getCurrentEmployee();

        if (manager.getDepartment() == null
                || assignment.getDepartment() == null
                || !manager.getDepartment().getId().equals(assignment.getDepartment().getId())) {
            throw new ResourceNotFoundException("Assignment not found: " + assignmentId);
        }

        return assignment;
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
            throw new ResourceNotFoundException("Employee not found in manager department");
        }
    }

    private AssignmentResponse toResponse(Assignment a) {
        return new AssignmentResponse(
                a.getId(),
                a.getTitle(),
                a.getDescription(),
                a.getStatus(),
                a.getDepartment() != null ? a.getDepartment().getId() : null,
                a.getDepartment() != null ? a.getDepartment().getName() : null,
                a.getManager() != null ? a.getManager().getId() : null,
                a.getAssignedEmployee() != null ? a.getAssignedEmployee().getId() : null,
                a.getAssignedEmployee() != null
                        ? a.getAssignedEmployee().getFirstName() + " " + a.getAssignedEmployee().getLastName()
                        : null,
                a.getCreatedAt(),
                a.getAssignedAt(),
                a.getDueAt(),
                a.getManagerComment(),
                a.getSubmissionComment(),
                a.getSubmissionLink(),
                a.getSubmissionFileName(),
                a.getSubmissionFileContentType(),
                a.getSubmittedAt(),
                a.getReviewedAt()
        );
    }

    private String blankToNull(String s) {
        if (s == null) return null;
        String t = s.trim();
        return t.isEmpty() ? null : t;
    }
}