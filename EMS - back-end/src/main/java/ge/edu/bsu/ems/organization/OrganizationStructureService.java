package ge.edu.bsu.ems.organization;

import ge.edu.bsu.ems.department.Department;
import ge.edu.bsu.ems.department.DepartmentRepository;
import ge.edu.bsu.ems.employee.Employee;
import ge.edu.bsu.ems.employee.EmployeeRepository;
import ge.edu.bsu.ems.organization.dto.OrganizationDepartmentStructureResponse;
import ge.edu.bsu.ems.organization.dto.OrganizationEmployeeSummaryResponse;
import ge.edu.bsu.ems.organization.dto.OrganizationPositionGroupResponse;
import ge.edu.bsu.ems.user.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrganizationStructureService {

    private final DepartmentRepository departmentRepository;
    private final EmployeeRepository employeeRepository;

    public List<OrganizationDepartmentStructureResponse> listOrganizationStructure() {
        return departmentRepository.findAll()
                .stream()
                .map(this::buildDepartmentStructure)
                .toList();
    }

    private OrganizationDepartmentStructureResponse buildDepartmentStructure(Department department) {
        List<Employee> departmentEmployees =
                employeeRepository.findByDepartmentIdOrderByFirstNameAscLastNameAsc(department.getId());

        OrganizationEmployeeSummaryResponse manager = departmentEmployees.stream()
                .filter(this::isManager)
                .findFirst()
                .map(this::toEmployeeSummary)
                .orElse(null);

        Map<Long, List<OrganizationEmployeeSummaryResponse>> employeesByPosition = new LinkedHashMap<>();
        Map<Long, String> positionNames = new LinkedHashMap<>();

        for (Employee employee : departmentEmployees) {
            if (isManager(employee)) {
                continue;
            }

            Long positionId = employee.getPosition() != null ? employee.getPosition().getId() : -1L;
            String positionName = employee.getPosition() != null
                    ? employee.getPosition().getName()
                    : "Unassigned Position";

            employeesByPosition
                    .computeIfAbsent(positionId, key -> new java.util.ArrayList<>())
                    .add(toEmployeeSummary(employee));

            positionNames.putIfAbsent(positionId, positionName);
        }

        List<OrganizationPositionGroupResponse> positions = employeesByPosition.entrySet()
                .stream()
                .map(entry -> new OrganizationPositionGroupResponse(
                        entry.getKey(),
                        positionNames.get(entry.getKey()),
                        entry.getValue()
                ))
                .toList();

        return new OrganizationDepartmentStructureResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                manager,
                positions
        );
    }

    private boolean isManager(Employee employee) {
        return employee.getUser() != null && employee.getUser().getRole() == UserRole.MANAGER;
    }

    private OrganizationEmployeeSummaryResponse toEmployeeSummary(Employee employee) {
        String firstName = employee.getFirstName() == null ? "" : employee.getFirstName().trim();
        String lastName = employee.getLastName() == null ? "" : employee.getLastName().trim();
        String fullName = (firstName + " " + lastName).trim();

        return new OrganizationEmployeeSummaryResponse(
                employee.getId(),
                employee.getUser() != null ? employee.getUser().getId() : null,
                fullName.isEmpty() ? "Employee" : fullName,
                employee.getPhone(),
                employee.getPosition() != null ? employee.getPosition().getName() : null,
                employee.getStatus() != null ? employee.getStatus().name() : null
        );
    }
}