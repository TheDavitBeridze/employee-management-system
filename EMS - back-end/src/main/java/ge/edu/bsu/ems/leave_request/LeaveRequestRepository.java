package ge.edu.bsu.ems.leave_request;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    List<LeaveRequest> findByEmployee_Department_IdAndStatusOrderByCreatedAtDesc(
            Long departmentId,
            LeaveRequestStatus status
    );


    boolean existsByEmployeeIdAndStatus(Long employeeId, LeaveRequestStatus status);

    boolean existsByEmployeeIdAndStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            Long employeeId,
            LeaveRequestStatus status,
            LocalDate endDate,
            LocalDate startDate
    );

    List<LeaveRequest> findByStatusAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            LeaveRequestStatus status,
            LocalDate startDate,
            LocalDate endDate
    );

    List<LeaveRequest> findByStatusAndEndDateBefore(
            LeaveRequestStatus status,
            LocalDate date
    );
}