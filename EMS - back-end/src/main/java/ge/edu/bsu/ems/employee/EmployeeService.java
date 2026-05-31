package ge.edu.bsu.ems.employee;

import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;
import ge.edu.bsu.ems.audit.AuditLogService;
import ge.edu.bsu.ems.department.Department;
import ge.edu.bsu.ems.department.DepartmentRepository;
import ge.edu.bsu.ems.employee.dto.EmployeeCreateRequest;
import ge.edu.bsu.ems.employee.dto.EmployeeResponse;
import ge.edu.bsu.ems.employee.dto.EmployeeUpdateRequest;
import ge.edu.bsu.ems.employee.dto.StaffCreateRequest;
import ge.edu.bsu.ems.employee.dto.StaffUpdateRequest;
import ge.edu.bsu.ems.exception.BadRequestException;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.notification.NotificationService;
import ge.edu.bsu.ems.position.Position;
import ge.edu.bsu.ems.position.PositionRepository;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import ge.edu.bsu.ems.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ge.edu.bsu.ems.employee.MeController;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final AuditLogService auditLogService;
    private final NotificationService notificationService;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public EmployeeResponse createStaff(StaffCreateRequest req) {
        String normalizedEmail = req.email().trim().toLowerCase();
        String normalizedFirstName = req.firstName().trim();
        String normalizedLastName = req.lastName().trim();
        String normalizedPersonalNumber = req.personalNumber().trim();
        String normalizedPhone = req.phone().trim();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("User email already exists: " + normalizedEmail);
        }

        if (employeeRepository.existsByPersonalNumber(normalizedPersonalNumber)) {
            throw new ConflictException("Employee personal number already exists: " + normalizedPersonalNumber);
        }

        Department department = departmentRepository.findById(req.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.departmentId()));

        Position position = positionRepository.findById(req.positionId())
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + req.positionId()));

        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(req.password()))
                .role(req.role())
                .enabled(true)
                .build();

        User savedUser = userRepository.save(user);

        // edited part///////////////////////////////
        BigDecimal finalSalary = req.salary() != null
                ? req.salary()
                : position.getBaseSalary();
        /////////////////////////////////////////////

        Employee employee = Employee.builder()
                .user(savedUser)
                .firstName(normalizedFirstName)
                .lastName(normalizedLastName)
                .personalNumber(normalizedPersonalNumber)
                .phone(normalizedPhone)
                .birthDate(req.birthDate())
                .hireDate(req.hireDate())
                .status(EmployeeStatus.ACTIVE)
                .salary(finalSalary)
                .department(department)
                .position(position)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);

        return toResponse(savedEmployee);
    }


    @Transactional
    public EmployeeResponse create(EmployeeCreateRequest req) {

        User user = userRepository.findById(req.userId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + req.userId()));

        Department department = departmentRepository.findById(req.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.departmentId()));

        Position position = positionRepository.findById(req.positionId())
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + req.positionId()));

        if (employeeRepository.existsByPersonalNumber(req.personalNumber())) {
            throw new ConflictException("Personal number already exists: " + req.personalNumber());
        }

        employeeRepository.findByUserId(req.userId())
                .ifPresent(e -> {
                    throw new ConflictException("This user already has an employee profile");
                });

        Employee employee = Employee.builder()
                .user(user)
                .firstName(req.firstName())
                .lastName(req.lastName())
                .personalNumber(req.personalNumber())
                .phone(req.phone())
                .birthDate(req.birthDate())
                .hireDate(req.hireDate())
                .status(req.status())
                .salary(position.getBaseSalary())
                .department(department)
                .position(position)
                .createdAt(LocalDateTime.now())
                .build();

        Employee saved = employeeRepository.save(employee);

        auditLogService.logForCurrentUser(
                AuditAction.CREATE,
                AuditEntityType.EMPLOYEE,
                saved.getId(),
                "Created employee profile for userId=" + saved.getUser().getId()
                        + ", role=" + saved.getUser().getRole()
                        + ", department=" + saved.getDepartment().getName()
                        + ", position=" + saved.getPosition().getName()
        );

        notificationService.sendWelcomeEmail(
                user.getEmail(),
                employee.getFirstName() + " " + employee.getLastName()
        );

        return toResponse(saved);
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));
        return toResponse(employee);
    }

    private EmployeeResponse toResponse(Employee e) {
        return new EmployeeResponse(
                e.getId(),
                e.getUser().getId(),
                e.getFirstName(),
                e.getLastName(),
                e.getPersonalNumber(),
                e.getPhone(),
                e.getBirthDate(),
                e.getHireDate(),
                e.getStatus(),
                e.getSalary(),
                e.getDepartment() != null ? e.getDepartment().getId() : null,
                e.getDepartment() != null ? e.getDepartment().getName() : null,
                e.getPosition() != null ? e.getPosition().getId() : null,
                e.getPosition() != null ? e.getPosition().getName() : null,
                e.getCreatedAt()
        );
    }

    // to-do
    public void delete(Long id) {
    }

    public EmployeeResponse update(Long id, EmployeeUpdateRequest req) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + id));

        return null;
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> listDepartmentEmployeesForCurrentManager() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        Employee managerEmployee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for userId: " + user.getId()));

        if (managerEmployee.getDepartment() == null) {
            throw new BadRequestException("Manager department is not assigned");
        }

        Long departmentId = managerEmployee.getDepartment().getId();

        return employeeRepository.findByDepartmentIdOrderByFirstNameAscLastNameAsc(departmentId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public EmployeeResponse getCurrentEmployeeProfile() {
        String email = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        Employee employee = employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for userId: " + user.getId()));

        return toResponse(employee);
    }

    @Transactional(readOnly = true)
    public List<EmployeeResponse> listAll() {
        return employeeRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }


    @Transactional
    public EmployeeResponse updateStaff(Long employeeId, StaffUpdateRequest req) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        User user = employee.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found for employeeId: " + employeeId);
        }

        String normalizedEmail = req.email().trim().toLowerCase();
        String normalizedFirstName = req.firstName().trim();
        String normalizedLastName = req.lastName().trim();
        String normalizedPersonalNumber = req.personalNumber().trim();
        String normalizedPhone = req.phone().trim();

        if (!normalizedEmail.equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ConflictException("User email already exists: " + normalizedEmail);
        }

        if (!normalizedPersonalNumber.equalsIgnoreCase(employee.getPersonalNumber())
                && employeeRepository.existsByPersonalNumber(normalizedPersonalNumber)) {
            throw new ConflictException("Employee personal number already exists: " + normalizedPersonalNumber);
        }

        Department department = departmentRepository.findById(req.departmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + req.departmentId()));

        Position position = positionRepository.findById(req.positionId())
                .orElseThrow(() -> new ResourceNotFoundException("Position not found: " + req.positionId()));

        user.updateEmail(normalizedEmail);
        user.updateRole(req.role());

        if (req.password() != null && !req.password().trim().isEmpty()) {
            user.updatePasswordHash(passwordEncoder.encode(req.password().trim()));
        }

        BigDecimal finalSalary = req.salary() != null ? req.salary() : position.getBaseSalary();

        employee.setFirstName(normalizedFirstName);
        employee.setLastName(normalizedLastName);
        employee.setPersonalNumber(normalizedPersonalNumber);
        employee.setPhone(normalizedPhone);
        employee.setBirthDate(req.birthDate());
        employee.setHireDate(req.hireDate());
        employee.setSalary(finalSalary);
        employee.setDepartment(department);
        employee.setPosition(position);

        userRepository.save(user);
        Employee savedEmployee = employeeRepository.save(employee);

        return toResponse(savedEmployee);
    }


    @Transactional
    public void deleteStaff(Long employeeId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        User user = employee.getUser();
        if (user == null) {
            throw new ResourceNotFoundException("User not found for employeeId: " + employeeId);
        }

        employeeRepository.delete(employee);
        userRepository.delete(user);
    }





}
