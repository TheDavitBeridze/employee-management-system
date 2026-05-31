package ge.edu.bsu.ems.security;

import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component("employeeSecurity")
@RequiredArgsConstructor
public class EmployeeSecurity {

    private final EmployeeRepository employeeRepository;

    public boolean canAccessEmployee(Long employeeId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) return false;

        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (isAdmin) return true;

        // username=email!!!!!!!!!!!!!!!!1
        String email = authentication.getName();

        return employeeRepository.findById(employeeId)
                .map(Employee::getUser)
                .map(User::getEmail)
                .map(ownerEmail -> ownerEmail.equalsIgnoreCase(email))
                .orElse(false);
    }
}