package ge.edu.bsu.ems.attendance;

import ge.edu.bsu.ems.attendance.dto.AdminAttendanceSearchRequest;
import ge.edu.bsu.ems.attendance.dto.AttendanceResponse;
import ge.edu.bsu.ems.attendance.dto.DepartmentAttendanceSearchRequest;
import ge.edu.bsu.ems.attendance.dto.MyAttendanceSearchRequest;
import ge.edu.bsu.ems.department.Department;
import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.employee.EmployeeStatus;
import ge.edu.bsu.ems.exception.BadRequestException;
import ge.edu.bsu.ems.exception.ConflictException;
import ge.edu.bsu.ems.exception.ResourceNotFoundException;
import ge.edu.bsu.ems.user.User;
import ge.edu.bsu.ems.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;

    public void registerCheckInByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for userId: " + userId));

        if (employee.getStatus() != EmployeeStatus.ACTIVE) {
            return;
        }

        LocalDate today = LocalDate.now();
        LocalDateTime now = LocalDateTime.now();

        if (attendanceRepository.existsByEmployeeIdAndWorkDate(employee.getId(), today)) {
            return;
        }

        Attendance attendance = Attendance.builder()
                .employee(employee)
                .workDate(today)
                .checkInTime(now)
                .checkOutTime(null)
                .createdAt(now)
                .build();

        try {
            attendanceRepository.save(attendance);
        } catch (DataIntegrityViolationException ignored) {
            // safe on concurrent login
        }
    }

    public void registerCheckOutForCurrentUser() {
        Employee employee = getCurrentEmployee();

        attendanceRepository.findFirstByEmployeeIdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(employee.getId())
                .ifPresent(attendance -> {
                    attendance.setCheckOutTime(LocalDateTime.now());
                    attendanceRepository.save(attendance);
                });
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> listMine(MyAttendanceSearchRequest req) {
        validateDateRange(req.fromDate(), req.toDate());

        Employee employee = getCurrentEmployee();
        List<Attendance> attendances;

        if (hasDateRange(req.fromDate(), req.toDate())) {
            if (Boolean.TRUE.equals(req.openOnly())) {
                attendances = attendanceRepository
                        .findByEmployeeIdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                employee.getId(), req.fromDate(), req.toDate()
                        );
            } else {
                attendances = attendanceRepository
                        .findByEmployeeIdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                                employee.getId(), req.fromDate(), req.toDate()
                        );
            }
        } else if (Boolean.TRUE.equals(req.openOnly())) {
            attendances = attendanceRepository
                    .findByEmployeeIdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(employee.getId());
        } else {
            attendances = attendanceRepository
                    .findByEmployeeIdOrderByWorkDateDescCheckInTimeDesc(employee.getId());
        }

        return attendances.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> listForManager(DepartmentAttendanceSearchRequest req) {
        validateDateRange(req.fromDate(), req.toDate());

        Employee managerEmployee = getCurrentEmployee();

        if (managerEmployee.getDepartment() == null) {
            throw new BadRequestException("Manager department is not assigned");
        }

        Long departmentId = managerEmployee.getDepartment().getId();

        if (req.employeeId() != null) {
            validateManagerDepartmentAccessToEmployee(departmentId, req.employeeId());
        }

        List<Attendance> attendances;

        if (hasDateRange(req.fromDate(), req.toDate())) {
            if (req.employeeId() != null) {
                if (Boolean.TRUE.equals(req.openOnly())) {
                    attendances = attendanceRepository
                            .findByEmployee_Department_IdAndEmployee_IdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                    departmentId, req.employeeId(), req.fromDate(), req.toDate()
                            );
                } else {
                    attendances = attendanceRepository
                            .findByEmployee_Department_IdAndEmployee_IdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                                    departmentId, req.employeeId(), req.fromDate(), req.toDate()
                            );
                }
            } else {
                if (Boolean.TRUE.equals(req.openOnly())) {
                    attendances = attendanceRepository
                            .findByEmployee_Department_IdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                    departmentId, req.fromDate(), req.toDate()
                            );
                } else {
                    attendances = attendanceRepository
                            .findByEmployee_Department_IdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                                    departmentId, req.fromDate(), req.toDate()
                            );
                }
            }
        } else if (req.employeeId() != null) {
            if (Boolean.TRUE.equals(req.openOnly())) {
                attendances = attendanceRepository
                        .findByEmployee_Department_IdAndEmployee_IdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                departmentId, req.employeeId()
                        );
            } else {
                attendances = attendanceRepository
                        .findByEmployee_Department_IdAndEmployee_IdOrderByWorkDateDescCheckInTimeDesc(
                                departmentId, req.employeeId()
                        );
            }
        } else if (Boolean.TRUE.equals(req.openOnly())) {
            attendances = attendanceRepository
                    .findByEmployee_Department_IdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(departmentId);
        } else {
            attendances = attendanceRepository
                    .findByEmployee_Department_IdOrderByWorkDateDescCheckInTimeDesc(departmentId);
        }

        return attendances.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<AttendanceResponse> listAllForAdmin(AdminAttendanceSearchRequest req) {
        validateDateRange(req.fromDate(), req.toDate());

        if (req.employeeId() != null) {
            validateEmployeeExists(req.employeeId());
        }

        List<Attendance> attendances;

        if (hasDateRange(req.fromDate(), req.toDate())) {
            attendances = filterAdminWithDateRange(req);
        } else {
            attendances = filterAdminWithoutDateRange(req);
        }

        return attendances.stream().map(this::toResponse).toList();
    }

    private List<Attendance> filterAdminWithDateRange(AdminAttendanceSearchRequest req) {
        if (req.departmentId() != null && req.employeeId() != null) {
            validateEmployeeBelongsToDepartment(req.employeeId(), req.departmentId());

            if (Boolean.TRUE.equals(req.openOnly())) {
                return attendanceRepository
                        .findByEmployee_Department_IdAndEmployee_IdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                req.departmentId(), req.employeeId(), req.fromDate(), req.toDate()
                        );
            }

            return attendanceRepository
                    .findByEmployee_Department_IdAndEmployee_IdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                            req.departmentId(), req.employeeId(), req.fromDate(), req.toDate()
                    );
        }

        if (req.departmentId() != null) {
            if (Boolean.TRUE.equals(req.openOnly())) {
                return attendanceRepository
                        .findByEmployee_Department_IdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                req.departmentId(), req.fromDate(), req.toDate()
                        );
            }

            return attendanceRepository
                    .findByEmployee_Department_IdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                            req.departmentId(), req.fromDate(), req.toDate()
                    );
        }

        if (req.employeeId() != null) {
            if (Boolean.TRUE.equals(req.openOnly())) {
                return attendanceRepository
                        .findByEmployeeIdAndWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                req.employeeId(), req.fromDate(), req.toDate()
                        );
            }

            return attendanceRepository
                    .findByEmployeeIdAndWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                            req.employeeId(), req.fromDate(), req.toDate()
                    );
        }

        if (Boolean.TRUE.equals(req.openOnly())) {
            return attendanceRepository
                    .findByWorkDateBetweenAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                            req.fromDate(), req.toDate()
                    );
        }

        return attendanceRepository
                .findByWorkDateBetweenOrderByWorkDateDescCheckInTimeDesc(
                        req.fromDate(), req.toDate()
                );
    }

    private List<Attendance> filterAdminWithoutDateRange(AdminAttendanceSearchRequest req) {
        if (req.departmentId() != null && req.employeeId() != null) {
            validateEmployeeBelongsToDepartment(req.employeeId(), req.departmentId());

            if (Boolean.TRUE.equals(req.openOnly())) {
                return attendanceRepository
                        .findByEmployee_Department_IdAndEmployee_IdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(
                                req.departmentId(), req.employeeId()
                        );
            }

            return attendanceRepository
                    .findByEmployee_Department_IdAndEmployee_IdOrderByWorkDateDescCheckInTimeDesc(
                            req.departmentId(), req.employeeId()
                    );
        }

        if (req.departmentId() != null) {
            if (Boolean.TRUE.equals(req.openOnly())) {
                return attendanceRepository
                        .findByEmployee_Department_IdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(req.departmentId());
            }

            return attendanceRepository
                    .findByEmployee_Department_IdOrderByWorkDateDescCheckInTimeDesc(req.departmentId());
        }

        if (req.employeeId() != null) {
            if (Boolean.TRUE.equals(req.openOnly())) {
                return attendanceRepository
                        .findByEmployeeIdAndCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc(req.employeeId());
            }

            return attendanceRepository
                    .findByEmployeeIdOrderByWorkDateDescCheckInTimeDesc(req.employeeId());
        }

        if (Boolean.TRUE.equals(req.openOnly())) {
            return attendanceRepository.findByCheckOutTimeIsNullOrderByWorkDateDescCheckInTimeDesc();
        }

        return attendanceRepository.findAllByOrderByWorkDateDescCheckInTimeDesc();
    }

    private AttendanceResponse toResponse(Attendance attendance) {
        Employee employee = attendance.getEmployee();
        Department department = employee.getDepartment();

        return new AttendanceResponse(
                attendance.getId(),
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                department != null ? department.getId() : null,
                department != null ? department.getName() : null,
                attendance.getWorkDate(),
                attendance.getCheckInTime(),
                attendance.getCheckOutTime(),
                attendance.getCreatedAt()
        );
    }

    private Employee getCurrentEmployee() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found for email: " + email));

        return employeeRepository.findByUserId(user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found for userId: " + user.getId()));
    }

    private void validateDateRange(LocalDate fromDate, LocalDate toDate) {
        if ((fromDate == null && toDate != null) || (fromDate != null && toDate == null)) {
            throw new BadRequestException("Both fromDate and toDate must be provided together");
        }

        if (fromDate != null && fromDate.isAfter(toDate)) {
            throw new BadRequestException("fromDate cannot be after toDate");
        }
    }

    private boolean hasDateRange(LocalDate fromDate, LocalDate toDate) {
        return fromDate != null && toDate != null;
    }

    private void validateManagerDepartmentAccessToEmployee(Long managerDepartmentId, Long employeeId) {
        Employee targetEmployee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        if (targetEmployee.getDepartment() == null) {
            throw new ConflictException("Department is not assigned");
        }

        if (!managerDepartmentId.equals(targetEmployee.getDepartment().getId())) {
            throw new ResourceNotFoundException("Employee not found: " + employeeId);
        }
    }

    private void validateEmployeeBelongsToDepartment(Long employeeId, Long departmentId) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found: " + employeeId));

        if (employee.getDepartment() == null) {
            throw new ConflictException("Department is not assigned");
        }

        if (!departmentId.equals(employee.getDepartment().getId())) {
            throw new BadRequestException("Employee does not belong to the specified department");
        }
    }

    private void validateEmployeeExists(Long employeeId) {
        if (!employeeRepository.existsById(employeeId)) {
            throw new ResourceNotFoundException("Employee not found: " + employeeId);
        }
    }
}