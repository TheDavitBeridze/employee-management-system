package ge.edu.bsu.ems.employee;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    boolean existsByPersonalNumber(String personalNumber);

    Optional<Employee> findByUserId(Long userId);

    List<Employee> findByStatus(EmployeeStatus status);

    List<Employee> findByDepartmentIdOrderByFirstNameAscLastNameAsc(Long departmentId);

}