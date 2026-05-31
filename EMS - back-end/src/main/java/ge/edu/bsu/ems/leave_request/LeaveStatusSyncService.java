package ge.edu.bsu.ems.leave_request;

import ge.edu.bsu.ems.audit.AuditAction;
import ge.edu.bsu.ems.audit.AuditEntityType;
import ge.edu.bsu.ems.audit.AuditLogService;
import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.employee.EmployeeStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class LeaveStatusSyncService {

    private final LeaveRequestRepository leaveRequestRepository;
    private final EmployeeRepository employeeRepository;
    private final AuditLogService auditLogService;

    @Transactional
    public void syncEmployeeStatusesWithApprovedLeaves() {
        LocalDate today = LocalDate.now();

        log.info("Leave status sync started for date={}", today);

        List<LeaveRequest> activeApprovedLeaves =
                leaveRequestRepository.findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        LeaveRequestStatus.APPROVED,
                        today,
                        today
                );

        Set<Long> employeesOnApprovedLeaveToday = new HashSet<>();

        for (LeaveRequest leaveRequest : activeApprovedLeaves) {
            Employee employee = leaveRequest.getEmployee();

            if (employee == null || employee.getId() == null) {
                continue;
            }

            employeesOnApprovedLeaveToday.add(employee.getId());

            if (employee.getStatus() != EmployeeStatus.TERMINATED
                    && employee.getStatus() != EmployeeStatus.ON_LEAVE) {

                employee.setStatus(EmployeeStatus.ON_LEAVE);
                employeeRepository.save(employee);

                auditLogService.logSystem(
                        AuditAction.STATUS_SYNC,
                        AuditEntityType.EMPLOYEE,
                        employee.getId(),
                        "Employee status changed from ACTIVE to ON_LEAVE by leave scheduler"
                );

                // ტერმინალისთვის
                log.info("Employee id={} status changed to ON_LEAVE", employee.getId());
            }
        }

        List<Employee> employeesCurrentlyOnLeave =
                employeeRepository.findByStatus(EmployeeStatus.ON_LEAVE);

        for (Employee employee : employeesCurrentlyOnLeave) {
            if (employee.getStatus() == EmployeeStatus.TERMINATED) {
                continue;
            }

            boolean stillHasApprovedLeaveToday =
                    employeesOnApprovedLeaveToday.contains(employee.getId());

            if (!stillHasApprovedLeaveToday) {
                employee.setStatus(EmployeeStatus.ACTIVE);
                employeeRepository.save(employee);

                auditLogService.logSystem(
                        AuditAction.STATUS_SYNC,
                        AuditEntityType.EMPLOYEE,
                        employee.getId(),
                        "Employee status changed from ON_LEAVE to ACTIVE by leave scheduler"
                );

                log.info("Employee id={} status changed to ACTIVE", employee.getId());
            }
        }

        log.info("Leave status sync finished for date={}", today);
    }
}