package ge.edu.bsu.ems.assignment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {


    List<Assignment> findByAssignedEmployeeIdOrderByCreatedAtDesc(Long employeeId);
    List<Assignment> findByManagerIdOrderByCreatedAtDesc(Long managerEmployeeId);
    List<Assignment> findByDepartment_IdOrderByCreatedAtDesc(Long departmentId);
    List<Assignment> findByStatusAndDueAtBefore(AssignmentStatus status, LocalDateTime dueAt);
}