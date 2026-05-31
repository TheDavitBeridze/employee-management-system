package ge.edu.bsu.ems.employee.update_request;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EmployeeUpdateRequestRepository extends JpaRepository<EmployeeUpdateRequest, Long> {

    boolean existsByEmployeeIdAndStatus(Long employeeId, UpdateRequestStatus status);

    List<EmployeeUpdateRequest> findByEmployeeIdOrderByCreatedAtDesc(Long employeeId);

    List<EmployeeUpdateRequest> findByStatusOrderByCreatedAtDesc(UpdateRequestStatus status);

    List<EmployeeUpdateRequest> findByEmployee_Department_IdAndStatusOrderByCreatedAtDesc(
            Long departmentId,
            UpdateRequestStatus status
    );
}