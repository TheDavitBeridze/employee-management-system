package ge.edu.bsu.ems.employee;

import ge.edu.bsu.ems.employee.dto.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse create(@Valid @RequestBody EmployeeCreateRequest req) {
        return employeeService.create(req);
    }

    @PreAuthorize("@employeeSecurity.canAccessEmployee(#id, authentication)")
    @GetMapping("/{id}")
    public EmployeeResponse getById(@PathVariable Long id) {
        return employeeService.getById(id);
    }


    @PreAuthorize("@employeeSecurity.canAccessEmployee(#id, authentication)")
    @PutMapping("/{id}")
    public EmployeeResponse update(@PathVariable Long id, @RequestBody @Valid EmployeeUpdateRequest req) {
        return employeeService.update(id, req);
    }


    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        employeeService.delete(id);
    }

    @PreAuthorize("hasRole('MANAGER')")
    @GetMapping("/manager/department-employees")
    public List<EmployeeResponse> listDepartmentEmployeesForCurrentManager() {
        return employeeService.listDepartmentEmployeesForCurrentManager();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public List<EmployeeResponse> listAll() {
        return employeeService.listAll();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/staff")
    @ResponseStatus(HttpStatus.CREATED)
    public EmployeeResponse createStaff(@Valid @RequestBody StaffCreateRequest req) {
        return employeeService.createStaff(req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/staff/{id}")
    public EmployeeResponse updateStaff(@PathVariable Long id, @Valid @RequestBody StaffUpdateRequest req) {
        return employeeService.updateStaff(id, req);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/staff/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteStaff(@PathVariable Long id) {
        employeeService.deleteStaff(id);
    }



}
